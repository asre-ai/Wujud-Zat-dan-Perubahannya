import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { StateOfMatter } from '../../types';
import { sound } from '../../utils/audio';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, Sparkles, Box, Droplets, Wind } from 'lucide-react';

interface Matter3DViewerProps {
  stateType: StateOfMatter;
  isParticleMode?: boolean;
  onToggleParticleMode?: () => void;
  containerShape?: 'glass' | 'flask' | 'bowl'; // For liquid
}

export const Matter3DViewer: React.FC<Matter3DViewerProps> = ({
  stateType,
  isParticleMode = false,
  onToggleParticleMode,
  containerShape = 'glass',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [particleEnergy, setParticleEnergy] = useState<number>(1); // 0.5 to 2.5
  
  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction rotation state
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.2, y: 0.4 });
  const targetRotationRef = useRef({ x: 0.2, y: 0.4 });
  const zoomDistRef = useRef(4.8);

  const resetCamera = useCallback(() => {
    targetRotationRef.current = { x: 0.2, y: 0.4 };
    zoomDistRef.current = 4.8;
    setZoomLevel(1);
    sound.playPop();
  }, []);

  const handleZoom = (delta: number) => {
    const nextZoom = Math.min(Math.max(zoomDistRef.current + delta, 2.5), 8.5);
    zoomDistRef.current = nextZoom;
    setZoomLevel(Number((4.8 / nextZoom).toFixed(1)));
    sound.playPop();
  };

  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    sound.playPop();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomDistRef.current);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7); // subtle blue fill
    fillLight.position.set(-5, -2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.2, 10);
    rimLight.position.set(0, 4, -3);
    scene.add(rimLight);

    // 5. Container Group for dynamic objects
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);
    objectGroupRef.current = objectGroup;

    // 6. Floor shadow receiver
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.6;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Populate 3D Objects based on State and Particle Mode
  useEffect(() => {
    const group = objectGroupRef.current;
    if (!group) return;

    // Clear previous children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    if (isParticleMode) {
      // PARTICLE SIMULATION MODE
      buildParticleSystem(group, stateType);
    } else {
      // REALISTIC 3D OBJECT MODE
      if (stateType === 'solid') {
        buildRealisticSolid(group);
      } else if (stateType === 'liquid') {
        buildRealisticLiquid(group, containerShape);
      } else {
        buildRealisticGas(group);
      }
    }
  }, [stateType, isParticleMode, containerShape]);

  // BUILD REALISTIC SOLID (Ice Cubes with bevels, bubbles, frost)
  const buildRealisticSolid = (group: THREE.Group) => {
    // Main Ice Cube Group
    const iceGroup = new THREE.Group();

    // 1. Semi-transparent icy material
    const iceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd, // ice blue
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.65, // translucent ice
      ior: 1.31, // ice refractive index
      thickness: 1.5,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.9,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    // Main central ice cube
    const cubeGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6, 6, 6, 6);
    // Displace vertices slightly to make it organic and not a robotic perfect cube
    const pos = cubeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      // Small bevel / rounded effect
      pos.setXYZ(
        i,
        vx * (0.95 + 0.04 * Math.sin(vy * 4 + vz * 2)),
        vy * (0.95 + 0.04 * Math.cos(vx * 4 + vz * 2)),
        vz * (0.95 + 0.04 * Math.sin(vx * 4 + vy * 2))
      );
    }
    cubeGeo.computeVertexNormals();

    const mainCube = new THREE.Mesh(cubeGeo, iceMaterial);
    mainCube.castShadow = true;
    mainCube.receiveShadow = true;
    iceGroup.add(mainCube);

    // Inner frozen bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
    for (let i = 0; i < 18; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set(
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.2
      );
      b.scale.setScalar(0.4 + Math.random() * 0.8);
      iceGroup.add(b);
    }

    // Secondary smaller ice cube leaning next to it
    const subCubeGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85, 4, 4, 4);
    const subCube = new THREE.Mesh(subCubeGeo, iceMaterial);
    subCube.position.set(1.2, -0.4, 0.3);
    subCube.rotation.set(0.2, 0.6, -0.3);
    subCube.castShadow = true;
    iceGroup.add(subCube);

    // Small cold drops / condensation around bottom
    const dropGeo = new THREE.SphereGeometry(0.08, 12, 8);
    const dropMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    for (let i = 0; i < 6; i++) {
      const d = new THREE.Mesh(dropGeo, dropMat);
      d.position.set((Math.random() - 0.5) * 1.8, -0.85, (Math.random() - 0.5) * 1.8);
      d.scale.set(1, 0.3, 1); // flat puddle drop
      iceGroup.add(d);
    }

    group.add(iceGroup);
  };

  // BUILD REALISTIC LIQUID (Interactive Water in Glass/Flask/Bowl with ripples)
  const buildRealisticLiquid = (group: THREE.Group, shape: 'glass' | 'flask' | 'bowl') => {
    const liquidGroup = new THREE.Group();

    // Transparent Glass Vessel Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 0.3,
      transparent: true,
      opacity: 0.45,
      ior: 1.5,
      reflectivity: 0.9,
    });

    // Blue Water Material
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9, // vibrant cyan blue
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
      ior: 1.33,
    });

    if (shape === 'glass') {
      // Cylindrical Beaker
      const glassGeo = new THREE.CylinderGeometry(1.1, 1.05, 2.4, 32, 1, true);
      const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
      liquidGroup.add(glassMesh);

      // Glass bottom
      const bottomGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.08, 32);
      const bottomMesh = new THREE.Mesh(bottomGeo, glassMaterial);
      bottomMesh.position.y = -1.2;
      liquidGroup.add(bottomMesh);

      // Liquid body inside cylinder
      const waterGeo = new THREE.CylinderGeometry(1.02, 0.98, 1.6, 32);
      const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
      waterMesh.position.y = -0.38;
      waterMesh.name = 'waterMesh';
      liquidGroup.add(waterMesh);

      // Measurement graduation lines on glass
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
      for (let y = -0.8; y <= 0.8; y += 0.4) {
        const ringGeo = new THREE.BufferGeometry();
        const points = [];
        for (let a = 0; a <= Math.PI * 0.8; a += 0.1) {
          points.push(new THREE.Vector3(Math.cos(a) * 1.11, y, Math.sin(a) * 1.11));
        }
        ringGeo.setFromPoints(points);
        const line = new THREE.Line(ringGeo, lineMat);
        liquidGroup.add(line);
      }
    } else if (shape === 'flask') {
      // Erlenmeyer Flask (Conical base + narrow neck)
      const baseGeo = new THREE.CylinderGeometry(0.5, 1.5, 1.8, 32, 1, true);
      const baseMesh = new THREE.Mesh(baseGeo, glassMaterial);
      liquidGroup.add(baseMesh);

      const neckGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.0, 32, 1, true);
      const neckMesh = new THREE.Mesh(neckGeo, glassMaterial);
      neckMesh.position.y = 1.2;
      liquidGroup.add(neckMesh);

      const bottomGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.08, 32);
      const bottomMesh = new THREE.Mesh(bottomGeo, glassMaterial);
      bottomMesh.position.y = -0.9;
      liquidGroup.add(bottomMesh);

      // Liquid inside conical flask
      const waterGeo = new THREE.CylinderGeometry(0.9, 1.42, 1.2, 32);
      const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
      waterMesh.position.y = -0.28;
      waterMesh.name = 'waterMesh';
      liquidGroup.add(waterMesh);
    } else {
      // Wide Bowl (Mangkuk)
      const bowlGeo = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const bowlMesh = new THREE.Mesh(bowlGeo, glassMaterial);
      bowlMesh.rotation.x = Math.PI;
      bowlMesh.position.y = 0.5;
      liquidGroup.add(bowlMesh);

      // Liquid inside bowl
      const waterGeo = new THREE.CylinderGeometry(1.35, 0.4, 0.9, 32);
      const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
      waterMesh.position.y = -0.25;
      waterMesh.name = 'waterMesh';
      liquidGroup.add(waterMesh);
    }

    // Tiny rising bubbles in water
    const bubbleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 10; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set(
        (Math.random() - 0.5) * 1.2,
        -0.8 + Math.random() * 0.9,
        (Math.random() - 0.5) * 1.2
      );
      b.userData = { speed: 0.01 + Math.random() * 0.02, startY: b.position.y };
      liquidGroup.add(b);
    }

    group.add(liquidGroup);
  };

  // BUILD REALISTIC GAS (Puffy Steam & Expanding Molecules)
  const buildRealisticGas = (group: THREE.Group) => {
    const gasGroup = new THREE.Group();

    // 1. Soft spherical cloud puffs
    const cloudGeo = new THREE.DodecahedronGeometry(0.45, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x99f6e4, // light turquoise
      roughness: 0.8,
      transparent: true,
      opacity: 0.45,
    });

    const puffsCount = 28;
    for (let i = 0; i < puffsCount; i++) {
      const puff = new THREE.Mesh(cloudGeo, cloudMat.clone());
      const radius = 0.4 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      puff.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) * 0.9,
        radius * Math.sin(phi) * Math.sin(theta)
      );
      puff.scale.setScalar(0.5 + Math.random() * 0.9);
      puff.userData = {
        vx: (Math.random() - 0.5) * 0.015,
        vy: 0.008 + Math.random() * 0.015,
        vz: (Math.random() - 0.5) * 0.015,
        initialY: puff.position.y,
        baseScale: puff.scale.x,
      };
      gasGroup.add(puff);
    }

    // Outer subtle boundary container (jar) to visualize gas filling the container
    const jarGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.8, 32, 1, true);
    const jarMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
    });
    const jar = new THREE.Mesh(jarGeo, jarMat);
    gasGroup.add(jar);

    group.add(gasGroup);
  };

  // BUILD PARTICLE SYSTEM FOR SOLID / LIQUID / GAS
  const buildParticleSystem = (group: THREE.Group, state: StateOfMatter) => {
    const particleGroup = new THREE.Group();

    // Container wireframe / transparent bounds
    const boxGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, wireframe: true, transparent: true, opacity: 0.25 });
    const wireBox = new THREE.Mesh(boxGeo, wireMat);
    particleGroup.add(wireBox);

    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);

    if (state === 'solid') {
      // SOLID: 64 particles in 4x4x4 tight lattice, vibration only
      const solidMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // Sky Blue
        roughness: 0.3,
        metalness: 0.2,
      });

      const spacing = 0.55;
      for (let x = -1.5; x <= 1.5; x += 1) {
        for (let y = -1.5; y <= 1.5; y += 1) {
          for (let z = -1.5; z <= 1.5; z += 1) {
            const p = new THREE.Mesh(sphereGeo, solidMat);
            const baseX = x * spacing;
            const baseY = y * spacing;
            const baseZ = z * spacing;
            p.position.set(baseX, baseY, baseZ);
            p.userData = { baseX, baseY, baseZ, phase: Math.random() * Math.PI * 2 };
            particleGroup.add(p);
          }
        }
      }
    } else if (state === 'liquid') {
      // LIQUID: ~45 particles sliding in lower half, fluid motion
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0x0d9488, // Teal
        roughness: 0.2,
        metalness: 0.1,
      });

      for (let i = 0; i < 48; i++) {
        const p = new THREE.Mesh(sphereGeo, liquidMat);
        p.position.set(
          (Math.random() - 0.5) * 1.9,
          -1.0 + Math.random() * 0.9,
          (Math.random() - 0.5) * 1.9
        );
        p.userData = {
          vx: (Math.random() - 0.5) * 0.02,
          vy: (Math.random() - 0.5) * 0.015,
          vz: (Math.random() - 0.5) * 0.02,
          radius: 0.95,
        };
        particleGroup.add(p);
      }
    } else {
      // GAS: ~24 particles moving very fast and bouncing around entire volume
      const gasMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6, // Violet
        roughness: 0.2,
        metalness: 0.1,
      });

      for (let i = 0; i < 28; i++) {
        const p = new THREE.Mesh(sphereGeo, gasMat);
        p.position.set(
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0
        );
        const speed = 0.05 + Math.random() * 0.04;
        p.userData = {
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          vz: (Math.random() - 0.5) * speed,
        };
        particleGroup.add(p);
      }
    }

    group.add(particleGroup);
  };

  // Main Animation Loop
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera orbit rotation lerp
      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1;
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1;

      if (cameraRef.current) {
        const dist = zoomDistRef.current;
        const rx = rotationRef.current.x;
        const ry = rotationRef.current.y;

        cameraRef.current.position.x = dist * Math.sin(ry) * Math.cos(rx);
        cameraRef.current.position.y = dist * Math.sin(rx);
        cameraRef.current.position.z = dist * Math.cos(ry) * Math.cos(rx);
        cameraRef.current.lookAt(0, 0, 0);
      }

      const group = objectGroupRef.current;
      if (!group) return;

      // Animate Objects inside Group
      if (isParticleMode) {
        // Particle Animations
        group.children.forEach(container => {
          container.children.forEach(child => {
            if (!(child instanceof THREE.Mesh) || !child.userData) return;

            if (stateType === 'solid') {
              // Vibrate around base position
              const { baseX, baseY, baseZ, phase } = child.userData;
              if (baseX !== undefined) {
                const vibAmp = 0.025 * particleEnergy;
                child.position.x = baseX + Math.sin(elapsedTime * 18 * particleEnergy + phase) * vibAmp;
                child.position.y = baseY + Math.cos(elapsedTime * 20 * particleEnergy + phase) * vibAmp;
                child.position.z = baseZ + Math.sin(elapsedTime * 16 * particleEnergy + phase) * vibAmp;
              }
            } else if (stateType === 'liquid') {
              // Drift and slide inside container
              if (child.userData.vx !== undefined) {
                child.position.x += child.userData.vx * particleEnergy;
                child.position.y += child.userData.vy * particleEnergy;
                child.position.z += child.userData.vz * particleEnergy;

                // Bounds bouncing (liquid stays at bottom half)
                if (Math.abs(child.position.x) > 1.0) child.userData.vx *= -1;
                if (child.position.y < -1.1 || child.position.y > 0.0) child.userData.vy *= -1;
                if (Math.abs(child.position.z) > 1.0) child.userData.vz *= -1;
              }
            } else {
              // Gas: High speed bounce in all 3D box
              if (child.userData.vx !== undefined) {
                child.position.x += child.userData.vx * particleEnergy * 1.5;
                child.position.y += child.userData.vy * particleEnergy * 1.5;
                child.position.z += child.userData.vz * particleEnergy * 1.5;

                if (Math.abs(child.position.x) > 1.1) child.userData.vx *= -1;
                if (Math.abs(child.position.y) > 1.1) child.userData.vy *= -1;
                if (Math.abs(child.position.z) > 1.1) child.userData.vz *= -1;
              }
            }
          });
        });
      } else {
        // Realistic Mode Animations
        if (stateType === 'solid') {
          // Slow floating wobble
          group.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15;
          group.position.y = Math.sin(elapsedTime * 1.2) * 0.08;
        } else if (stateType === 'liquid') {
          // Subtle water wave ripple
          const waterMesh = group.getObjectByName('waterMesh') as THREE.Mesh | undefined;
          if (waterMesh) {
            waterMesh.scale.x = 1 + Math.sin(elapsedTime * 2.5) * 0.015;
            waterMesh.scale.z = 1 + Math.cos(elapsedTime * 2.5) * 0.015;
          }
          // Bubble rise
          group.traverse(obj => {
            if (obj.userData?.speed) {
              obj.position.y += obj.userData.speed;
              if (obj.position.y > 0.35) {
                obj.position.y = obj.userData.startY;
              }
            }
          });
        } else if (stateType === 'gas') {
          // Steam puffs drifting upward and dispersing
          group.traverse(obj => {
            if (obj.userData?.vy) {
              obj.position.x += obj.userData.vx;
              obj.position.y += obj.userData.vy;
              obj.position.z += obj.userData.vz;
              obj.rotation.y += 0.01;

              // Dispersal reset
              if (obj.position.y > 1.4) {
                obj.position.y = -1.1;
                obj.position.x = (Math.random() - 0.5) * 0.8;
                obj.position.z = (Math.random() - 0.5) * 0.8;
              }
            }
          });
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [stateType, isParticleMode, particleEnergy]);

  // Pointer Drag Handlers for 3D Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(
      Math.min(targetRotationRef.current.x + deltaY * 0.008, Math.PI / 2.3),
      -Math.PI / 2.3
    );

    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY * 0.003);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[340px] sm:min-h-[440px] rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100/80 via-white/50 to-indigo-100/70 border-2 border-sky-200/90 shadow-md flex flex-col backdrop-blur-xs ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-900' : ''
      }`}
    >
      {/* 3D Canvas Mounting Area */}
      <div
        ref={mountRef}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* State/Mode indicator */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
          {stateType === 'solid' && <Box className="w-4 h-4 text-sky-600" />}
          {stateType === 'liquid' && <Droplets className="w-4 h-4 text-teal-600" />}
          {stateType === 'gas' && <Wind className="w-4 h-4 text-purple-600" />}
          <span className="text-xs font-bold text-slate-800">
            {isParticleMode ? '🔬 Mode Partikel Molekul' : '✨ Model 3D Nyata'}
          </span>
        </div>

        {/* Action Controls (Reset, Zoom, Fullscreen) */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-white/90 backdrop-blur-md p-1 rounded-full border border-slate-200/80 shadow-sm">
          <button
            onClick={resetCamera}
            title="Reset Posisi (↻)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.5)}
            title="Perbesar (🔍+)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.5)}
            title="Perkecil (🔍-)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="Layar Penuh (⛶)"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar: Particle Toggle & Interactive Helper */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Toggle Particle Button */}
        {onToggleParticleMode && (
          <button
            onClick={() => {
              sound.playPop();
              onToggleParticleMode();
            }}
            className={`pointer-events-auto px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 ${
              isParticleMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isParticleMode ? '👀 Lihat Objek Biasa' : '🔬 Lihat Partikelnya!'}</span>
          </button>
        )}

        {/* Dynamic Energy Slider for Particles */}
        {isParticleMode ? (
          <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
            <span className="font-semibold text-slate-700">⚡ Energi:</span>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={particleEnergy}
              onChange={e => setParticleEnergy(parseFloat(e.target.value))}
              className="w-20 accent-indigo-600 cursor-pointer"
            />
            <span className="font-mono text-slate-500">{particleEnergy.toFixed(1)}x</span>
          </div>
        ) : (
          <div className="pointer-events-none bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-500">
            👆 Geser untuk memutar • Scroll untuk zoom
          </div>
        )}
      </div>
    </div>
  );
};
