import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { StateOfMatter } from '../../types';
import { sound } from '../../utils/audio';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sparkles,
  Box,
  Droplets,
  Wind,
} from 'lucide-react';
import { createWoodTexture, createStoneTextures, createSparkleTexture } from './proceduralTextures';

interface Matter3DViewerProps {
  stateType: StateOfMatter;
  onSelectState?: (state: StateOfMatter) => void;
  isParticleMode?: boolean;
  onToggleParticleMode?: () => void;
  containerShape?: 'glass' | 'flask' | 'bowl'; // For liquid
}

export const Matter3DViewer: React.FC<Matter3DViewerProps> = ({
  stateType,
  onSelectState,
  isParticleMode = false,
  onToggleParticleMode,
  containerShape = 'glass',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [, setZoomLevel] = useState(1);
  const [particleEnergy, setParticleEnergy] = useState<number>(1); // 0.5 to 2.5

  // Local active state tracking (allows direct switching within canvas)
  const [activeState, setActiveState] = useState<StateOfMatter>(stateType);

  useEffect(() => {
    setActiveState(stateType);
  }, [stateType]);

  const handleSwitchState = (newState: StateOfMatter) => {
    sound.playPop();
    setActiveState(newState);
    if (onSelectState) {
      onSelectState(newState);
    }
  };

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const sparklesGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Cached procedural textures
  const woodTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const stoneTexturesRef = useRef<{ map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } | null>(null);
  const sparkleTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Interaction rotation state (smooth OrbitControls)
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.22, y: 0.45 });
  const targetRotationRef = useRef({ x: 0.22, y: 0.45 });
  const zoomDistRef = useRef(4.8);
  const targetZoomDistRef = useRef(4.8);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  const resetCamera = useCallback(() => {
    targetRotationRef.current = { x: 0.22, y: 0.45 };
    targetZoomDistRef.current = 4.8;
    setZoomPercent(100);
    sound.playPop();
  }, []);

  const handleZoom = useCallback((delta: number) => {
    // Clamped between 2.2 (close zoom in) and 7.2 (wide zoom out)
    const nextZoom = Math.min(Math.max(targetZoomDistRef.current + delta, 2.2), 7.2);
    targetZoomDistRef.current = nextZoom;
    setZoomPercent(Math.round((4.8 / nextZoom) * 100));
    sound.playPop();
  }, []);

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

  // Setup Three.js Scene, Camera, Renderer, Studio Lights
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Initialize textures once
    if (!woodTextureRef.current) woodTextureRef.current = createWoodTexture();
    if (!stoneTexturesRef.current) stoneTexturesRef.current = createStoneTextures();
    if (!sparkleTextureRef.current) sparkleTextureRef.current = createSparkleTexture();

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomDistRef.current);
    cameraRef.current = camera;

    // 3. Renderer Setup with Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio 4-Point Lighting Rig
    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.75);
    scene.add(ambientLight);

    // Key Light with High-Resolution Soft Shadows
    const keyLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    keyLight.position.set(4.5, 7.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.03;
    scene.add(keyLight);

    // Fill Light (Cool Sky Blue from Left)
    const fillLight = new THREE.DirectionalLight(0xbbe1fa, 0.85);
    fillLight.position.set(-5, 2.5, -3);
    scene.add(fillLight);

    // Rim Accent PointLight (Backlight to highlight silhouette edges)
    const rimLight = new THREE.PointLight(0x38bdf8, 1.5, 14);
    rimLight.position.set(0, 4.5, -3.5);
    scene.add(rimLight);

    // Subtle Warm Table Reflection Bounce
    const bounceLight = new THREE.DirectionalLight(0xfef3c7, 0.4);
    bounceLight.position.set(0, -4, 2);
    scene.add(bounceLight);

    // 5. Container Group for Dynamic Objects
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);
    objectGroupRef.current = objectGroup;

    // 6. Sparkles Group (Glitter halo around the 3D model)
    const sparklesGroup = new THREE.Group();
    scene.add(sparklesGroup);
    sparklesGroupRef.current = sparklesGroup;
    buildSparklesSystem(sparklesGroup);

    // 7. Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.35;
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

  // Build Sturdy Tabletop Pedestal
  const createTablePedestal = (woodTexture: THREE.CanvasTexture): THREE.Group => {
    const pedestalGroup = new THREE.Group();

    // Round wooden table surface
    const tableGeo = new THREE.CylinderGeometry(2.35, 2.45, 0.3, 48);
    const tableMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.45,
      metalness: 0.05,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -1.2;
    tableMesh.receiveShadow = true;
    tableMesh.castShadow = true;
    pedestalGroup.add(tableMesh);

    // Beveled rim accent
    const rimGeo = new THREE.TorusGeometry(2.38, 0.04, 16, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x5c3818,
      roughness: 0.3,
      metalness: 0.2,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -1.05;
    pedestalGroup.add(rimMesh);

    return pedestalGroup;
  };

  // Sparkles / Glitter Particle System
  const buildSparklesSystem = (group: THREE.Group) => {
    while (group.children.length > 0) {
      const c = group.children[0];
      group.remove(c);
    }

    const sparkleGeo = new THREE.OctahedronGeometry(0.04, 0);
    const sparkleMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.85,
    });

    const count = 36;
    for (let i = 0; i < count; i++) {
      const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat.clone());
      const rad = 1.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = 0.2 + Math.random() * (Math.PI - 0.4);

      sparkle.position.set(
        rad * Math.sin(phi) * Math.cos(theta),
        -0.5 + rad * Math.cos(phi),
        rad * Math.sin(phi) * Math.sin(theta)
      );

      sparkle.userData = {
        baseY: sparkle.position.y,
        speed: 0.005 + Math.random() * 0.015,
        rotSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 1.0,
      };

      group.add(sparkle);
    }
  };

  // Populate 3D Objects based on State and Particle Mode
  useEffect(() => {
    const group = objectGroupRef.current;
    if (!group) return;

    // Clear previous children and clean memory
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      child.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((m) => m.dispose());
          } else {
            node.material.dispose();
          }
        }
      });
    }

    if (isParticleMode) {
      // PARTICLE SIMULATION MODE
      buildParticleSystem(group, activeState);
    } else {
      // REALISTIC 3D OBJECT MODE
      if (activeState === 'solid') {
        buildRealisticSolid(group);
      } else if (activeState === 'liquid') {
        buildRealisticLiquid(group, containerShape);
      } else {
        buildRealisticGas(group);
      }
    }
  }, [activeState, isParticleMode, containerShape]);

  // BUILD REALISTIC SOLID (Natural Rough Stone + Grained Wood Block + Crystal on Wooden Pedestal)
  const buildRealisticSolid = (group: THREE.Group) => {
    const solidGroup = new THREE.Group();

    const woodTex = woodTextureRef.current || createWoodTexture();
    const stoneTex = stoneTexturesRef.current || createStoneTextures();

    // 1. Sturdy Wooden Pedestal Table
    const pedestal = createTablePedestal(woodTex);
    solidGroup.add(pedestal);

    // 2. Natural Rough Stone / Granite Rock (Batu Alami Bertekstur Kasar)
    const rockGeo = new THREE.DodecahedronGeometry(0.85, 2);
    // Displace vertices for authentic, organic jagged facets
    const rPos = rockGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const x = rPos.getX(i);
      const y = rPos.getY(i);
      const z = rPos.getZ(i);
      const noise =
        1 +
        Math.sin(x * 5) * 0.08 +
        Math.cos(y * 6 + z * 3) * 0.07 +
        Math.sin(z * 7) * 0.05;
      rPos.setXYZ(i, x * noise, y * noise, z * noise);
    }
    rockGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      map: stoneTex.map,
      bumpMap: stoneTex.bumpMap,
      bumpScale: 0.09,
      roughness: 0.88,
      metalness: 0.08,
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.position.set(-0.65, -0.32, 0.1);
    rockMesh.rotation.set(0.3, 0.6, -0.2);
    rockMesh.castShadow = true;
    rockMesh.receiveShadow = true;
    solidGroup.add(rockMesh);

    // 3. Dense Grained Wooden Block (Balok Kayu Berserat Padat)
    const woodBlockGeo = new THREE.BoxGeometry(0.95, 0.95, 0.95, 4, 4, 4);
    // Chamfer bevel edges slightly
    const bPos = woodBlockGeo.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      const bx = bPos.getX(i);
      const by = bPos.getY(i);
      const bz = bPos.getZ(i);
      const len = Math.sqrt(bx * bx + by * by + bz * bz);
      if (len > 0.75) {
        bPos.setXYZ(i, bx * 0.96, by * 0.96, bz * 0.96);
      }
    }
    woodBlockGeo.computeVertexNormals();

    const woodBlockMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.45,
      metalness: 0.02,
    });
    const woodBlockMesh = new THREE.Mesh(woodBlockGeo, woodBlockMat);
    woodBlockMesh.position.set(0.68, -0.56, 0.15);
    woodBlockMesh.rotation.set(0, 0.35, 0);
    woodBlockMesh.castShadow = true;
    woodBlockMesh.receiveShadow = true;
    solidGroup.add(woodBlockMesh);

    // 4. Translucent Ice / Quartz Crystal (Kontras Kristal Padat)
    const crystalGeo = new THREE.OctahedronGeometry(0.48, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.78,
      ior: 1.34,
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: 0.9,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(0.12, -0.74, 0.75);
    crystalMesh.rotation.set(0.4, 0.2, 0.5);
    crystalMesh.castShadow = true;
    crystalMesh.receiveShadow = true;
    solidGroup.add(crystalMesh);

    // 5. Small Pebbles on Pedestal
    const pebbleGeo = new THREE.DodecahedronGeometry(0.12, 1);
    for (let i = 0; i < 4; i++) {
      const pebble = new THREE.Mesh(pebbleGeo, rockMat);
      pebble.position.set(
        -0.2 + (Math.random() - 0.5) * 1.4,
        -1.0,
        0.5 + (Math.random() - 0.5) * 0.8
      );
      pebble.scale.set(1.2, 0.6, 0.9);
      pebble.castShadow = true;
      solidGroup.add(pebble);
    }

    group.add(solidGroup);
  };

  // BUILD REALISTIC LIQUID (Dynamic Water with Waves, Reflections, Bubbles in Glass Container)
  const buildRealisticLiquid = (group: THREE.Group, shape: 'glass' | 'flask' | 'bowl') => {
    const liquidGroup = new THREE.Group();

    const woodTex = woodTextureRef.current || createWoodTexture();

    // 1. Sturdy Pedestal Table
    const pedestal = createTablePedestal(woodTex);
    liquidGroup.add(pedestal);

    // 2. High-Grade Transparent Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.04,
      transmission: 0.94,
      thickness: 0.8,
      transparent: true,
      opacity: 0.42,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // 3. Azure Cyan Water Material with depth
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7, // vivid ocean cyan
      roughness: 0.06,
      metalness: 0.05,
      transmission: 0.68,
      transparent: true,
      opacity: 0.88,
      ior: 1.33,
      reflectivity: 0.85,
      clearcoat: 1.0,
    });

    if (shape === 'glass') {
      // Cylindrical Beaker Vessel
      const glassGeo = new THREE.CylinderGeometry(1.15, 1.1, 2.3, 40, 1, true);
      const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
      glassMesh.position.y = 0.1;
      glassMesh.castShadow = true;
      liquidGroup.add(glassMesh);

      // Glass bottom base
      const bottomGeo = new THREE.CylinderGeometry(1.12, 1.12, 0.1, 40);
      const bottomMesh = new THREE.Mesh(bottomGeo, glassMaterial);
      bottomMesh.position.y = -1.0;
      bottomMesh.receiveShadow = true;
      liquidGroup.add(bottomMesh);

      // Top Glass Rim Lip
      const lipGeo = new THREE.TorusGeometry(1.15, 0.04, 16, 40);
      const lipMesh = new THREE.Mesh(lipGeo, glassMaterial);
      lipMesh.rotation.x = Math.PI / 2;
      lipMesh.position.y = 1.25;
      liquidGroup.add(lipMesh);

      // Water Body inside Cylinder
      const waterGeo = new THREE.CylinderGeometry(1.08, 1.05, 1.5, 40, 16);
      const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
      waterMesh.position.y = -0.22;
      waterMesh.name = 'waterMesh';
      waterMesh.castShadow = true;
      waterMesh.receiveShadow = true;
      liquidGroup.add(waterMesh);

      // Measurement graduation lines on glass
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.55,
      });
      for (let y = -0.7; y <= 0.8; y += 0.35) {
        const points = [];
        for (let a = -Math.PI * 0.35; a <= Math.PI * 0.35; a += 0.1) {
          points.push(new THREE.Vector3(Math.cos(a) * 1.16, y, Math.sin(a) * 1.16));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        liquidGroup.add(line);
      }
    } else if (shape === 'flask') {
      // Erlenmeyer Lab Flask
      const baseGeo = new THREE.CylinderGeometry(0.55, 1.5, 1.8, 40, 1, true);
      const baseMesh = new THREE.Mesh(baseGeo, glassMaterial);
      baseMesh.position.y = -0.15;
      baseMesh.castShadow = true;
      liquidGroup.add(baseMesh);

      const neckGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.9, 40, 1, true);
      const neckMesh = new THREE.Mesh(neckGeo, glassMaterial);
      neckMesh.position.y = 1.15;
      liquidGroup.add(neckMesh);

      const bottomGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 40);
      const bottomMesh = new THREE.Mesh(bottomGeo, glassMaterial);
      bottomMesh.position.y = -1.0;
      bottomMesh.receiveShadow = true;
      liquidGroup.add(bottomMesh);

      // Water inside conical flask
      const waterGeo = new THREE.CylinderGeometry(0.95, 1.42, 1.25, 40, 16);
      const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
      waterMesh.position.y = -0.38;
      waterMesh.name = 'waterMesh';
      waterMesh.castShadow = true;
      liquidGroup.add(waterMesh);
    } else {
      // Wide Glass Bowl
      const bowlGeo = new THREE.SphereGeometry(
        1.55,
        40,
        24,
        0,
        Math.PI * 2,
        Math.PI / 2,
        Math.PI / 2
      );
      const bowlMesh = new THREE.Mesh(bowlGeo, glassMaterial);
      bowlMesh.rotation.x = Math.PI;
      bowlMesh.position.y = 0.45;
      bowlMesh.castShadow = true;
      liquidGroup.add(bowlMesh);

      const bowlBottomGeo = new THREE.CylinderGeometry(0.65, 0.7, 0.08, 40);
      const bowlBottomMesh = new THREE.Mesh(bowlBottomGeo, glassMaterial);
      bowlBottomMesh.position.y = -1.0;
      bowlBottomMesh.receiveShadow = true;
      liquidGroup.add(bowlBottomMesh);

      // Water inside bowl
      const waterGeo = new THREE.CylinderGeometry(1.4, 0.55, 0.95, 40, 16);
      const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
      waterMesh.position.y = -0.48;
      waterMesh.name = 'waterMesh';
      waterMesh.castShadow = true;
      liquidGroup.add(waterMesh);
    }

    // 4. Rising Dynamic Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.8,
      ior: 1.1,
    });

    for (let i = 0; i < 16; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set(
        (Math.random() - 0.5) * 1.3,
        -0.85 + Math.random() * 1.1,
        (Math.random() - 0.5) * 1.3
      );
      b.scale.setScalar(0.5 + Math.random() * 0.9);
      b.userData = {
        speed: 0.012 + Math.random() * 0.018,
        startY: -0.9,
        maxY: 0.42,
        wobbleFreq: 3 + Math.random() * 4,
        wobbleAmp: 0.008 + Math.random() * 0.012,
      };
      liquidGroup.add(b);
    }

    group.add(liquidGroup);
  };

  // BUILD REALISTIC GAS (Laboratory Bell Jar Cloche with Soft Puffy Clouds & Kinetic Gas Molecules)
  const buildRealisticGas = (group: THREE.Group) => {
    const gasGroup = new THREE.Group();

    const woodTex = woodTextureRef.current || createWoodTexture();

    // 1. Sturdy Pedestal Table
    const pedestal = createTablePedestal(woodTex);
    gasGroup.add(pedestal);

    // 2. Closed Glass Bell Jar Cloche (Wadah Tertutup Estetis)
    const domeCylinderGeo = new THREE.CylinderGeometry(1.4, 1.45, 1.8, 40, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      transmission: 0.94,
      thickness: 0.6,
      transparent: true,
      opacity: 0.35,
      ior: 1.5,
      reflectivity: 0.85,
    });
    const domeCylinder = new THREE.Mesh(domeCylinderGeo, glassMat);
    domeCylinder.position.y = -0.15;
    domeCylinder.castShadow = true;
    gasGroup.add(domeCylinder);

    // Top Dome Cap
    const domeCapGeo = new THREE.SphereGeometry(1.4, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeCap = new THREE.Mesh(domeCapGeo, glassMat);
    domeCap.position.y = 0.75;
    gasGroup.add(domeCap);

    // Brass Top Knob / Stopper
    const knobGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const knobMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // warm gold brass
      roughness: 0.25,
      metalness: 0.85,
    });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.position.y = 2.15;
    knob.castShadow = true;
    gasGroup.add(knob);

    // 3. Volumetric Swirling Steam / Gas Clouds
    const puffGeo = new THREE.DodecahedronGeometry(0.36, 1);
    const puffsCount = 38;

    for (let i = 0; i < puffsCount; i++) {
      const isTurquoise = i % 2 === 0;
      const puffMat = new THREE.MeshStandardMaterial({
        color: isTurquoise ? 0xa5f3fc : 0xe9d5ff, // pastel cyan & soft lavender
        roughness: 0.9,
        transparent: true,
        opacity: 0.38,
      });

      const puff = new THREE.Mesh(puffGeo, puffMat);
      const rad = 0.2 + Math.random() * 1.05;
      const theta = Math.random() * Math.PI * 2;
      const phi = 0.3 + Math.random() * (Math.PI - 0.6);

      puff.position.set(
        rad * Math.sin(phi) * Math.cos(theta),
        -0.7 + Math.random() * 1.9,
        rad * Math.sin(phi) * Math.sin(theta)
      );

      puff.scale.setScalar(0.6 + Math.random() * 0.9);
      puff.userData = {
        vx: (Math.random() - 0.5) * 0.014,
        vy: 0.008 + Math.random() * 0.016,
        vz: (Math.random() - 0.5) * 0.014,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        baseScale: puff.scale.x,
      };

      gasGroup.add(puff);
    }

    // 4. Micro Glowing Gas Molecules moving rapidly in all directions
    const moleculeGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const moleculeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.1,
    });

    for (let i = 0; i < 24; i++) {
      const mol = new THREE.Mesh(moleculeGeo, moleculeMat);
      mol.position.set(
        (Math.random() - 0.5) * 1.8,
        -0.8 + Math.random() * 2.0,
        (Math.random() - 0.5) * 1.8
      );
      mol.userData = {
        vx: (Math.random() - 0.5) * 0.035,
        vy: (Math.random() - 0.5) * 0.035,
        vz: (Math.random() - 0.5) * 0.035,
      };
      gasGroup.add(mol);
    }

    group.add(gasGroup);
  };

  // BUILD PARTICLE SYSTEM FOR SOLID / LIQUID / GAS (Mode Partikel Molekul)
  const buildParticleSystem = (group: THREE.Group, state: StateOfMatter) => {
    const particleGroup = new THREE.Group();

    // Container wireframe / transparent bounds
    const boxGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireBox = new THREE.Mesh(boxGeo, wireMat);
    particleGroup.add(wireBox);

    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);

    if (state === 'solid') {
      // SOLID: 64 particles in 4x4x4 tight lattice, vibration only
      const solidMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
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
            p.castShadow = true;
            particleGroup.add(p);
          }
        }
      }
    } else if (state === 'liquid') {
      // LIQUID: ~48 particles sliding in lower half, fluid motion
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0x0d9488,
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
        };
        p.castShadow = true;
        particleGroup.add(p);
      }
    } else {
      // GAS: ~28 particles moving fast and bouncing around entire volume
      const gasMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
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
        p.castShadow = true;
        particleGroup.add(p);
      }
    }

    group.add(particleGroup);
  };

  // Main Animation Loop with Sparkles and Object Vibrations
  useEffect(() => {
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera orbit rotation lerp with clamp bounds
      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1;
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1;

      // Smooth camera zoom distance lerp
      zoomDistRef.current += (targetZoomDistRef.current - zoomDistRef.current) * 0.15;

      if (cameraRef.current) {
        const dist = zoomDistRef.current;
        const rx = rotationRef.current.x;
        const ry = rotationRef.current.y;

        cameraRef.current.position.x = dist * Math.sin(ry) * Math.cos(rx);
        cameraRef.current.position.y = dist * Math.sin(rx);
        cameraRef.current.position.z = dist * Math.cos(ry) * Math.cos(rx);
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Animate Sparkles (Twinkle & Hover)
      const sparklesGroup = sparklesGroupRef.current;
      if (sparklesGroup) {
        sparklesGroup.rotation.y = elapsedTime * 0.08;
        sparklesGroup.children.forEach((sp) => {
          if (sp instanceof THREE.Mesh && sp.userData) {
            sp.position.y =
              sp.userData.baseY + Math.sin(elapsedTime * 2 + sp.userData.phase) * 0.08;
            sp.rotation.x += sp.userData.rotSpeed;
            sp.rotation.y += sp.userData.rotSpeed;

            const scalePulse =
              sp.userData.scale *
              (0.85 + Math.sin(elapsedTime * 3 + sp.userData.phase) * 0.25);
            sp.scale.setScalar(scalePulse);

            if (sp.material instanceof THREE.MeshBasicMaterial) {
              sp.material.opacity =
                0.5 + Math.sin(elapsedTime * 3 + sp.userData.phase) * 0.4;
            }
          }
        });
      }

      const group = objectGroupRef.current;
      if (!group) return;

      // Animate Objects inside Group
      if (isParticleMode) {
        // Particle Animations
        group.children.forEach((container) => {
          container.children.forEach((child) => {
            if (!(child instanceof THREE.Mesh) || !child.userData) return;

            if (activeState === 'solid') {
              const { baseX, baseY, baseZ, phase } = child.userData;
              if (baseX !== undefined) {
                const vibAmp = 0.025 * particleEnergy;
                child.position.x =
                  baseX + Math.sin(elapsedTime * 18 * particleEnergy + phase) * vibAmp;
                child.position.y =
                  baseY + Math.cos(elapsedTime * 20 * particleEnergy + phase) * vibAmp;
                child.position.z =
                  baseZ + Math.sin(elapsedTime * 16 * particleEnergy + phase) * vibAmp;
              }
            } else if (activeState === 'liquid') {
              if (child.userData.vx !== undefined) {
                child.position.x += child.userData.vx * particleEnergy;
                child.position.y += child.userData.vy * particleEnergy;
                child.position.z += child.userData.vz * particleEnergy;

                if (Math.abs(child.position.x) > 1.0) child.userData.vx *= -1;
                if (child.position.y < -1.1 || child.position.y > 0.0)
                  child.userData.vy *= -1;
                if (Math.abs(child.position.z) > 1.0) child.userData.vz *= -1;
              }
            } else {
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
        if (activeState === 'solid') {
          // Slow breathing rotation and gentle pedestal poise
          group.rotation.y = Math.sin(elapsedTime * 0.3) * 0.08;
        } else if (activeState === 'liquid') {
          // Water wave ripple on liquid mesh
          const waterMesh = group.getObjectByName('waterMesh') as THREE.Mesh | undefined;
          if (waterMesh) {
            waterMesh.scale.x = 1 + Math.sin(elapsedTime * 2.8) * 0.012;
            waterMesh.scale.z = 1 + Math.cos(elapsedTime * 2.8) * 0.012;
          }
          // Dynamic Bubble Rise and Wobble
          group.traverse((obj) => {
            if (obj.userData?.speed) {
              obj.position.y += obj.userData.speed;
              obj.position.x +=
                Math.sin(elapsedTime * obj.userData.wobbleFreq) *
                obj.userData.wobbleAmp;

              if (obj.position.y > obj.userData.maxY) {
                obj.position.y = obj.userData.startY;
              }
            }
          });
        } else if (activeState === 'gas') {
          // Gas Puffs Turbulent Swirling
          group.traverse((obj) => {
            if (obj.userData?.vy) {
              obj.position.x += obj.userData.vx;
              obj.position.y += obj.userData.vy;
              obj.position.z += obj.userData.vz;
              obj.rotation.y += obj.userData.rotSpeed;

              // Soft bounce inside dome boundaries
              const horizDist = Math.sqrt(
                obj.position.x * obj.position.x + obj.position.z * obj.position.z
              );
              if (horizDist > 1.15) {
                obj.userData.vx *= -1;
                obj.userData.vz *= -1;
              }
              if (obj.position.y > 1.55) {
                obj.position.y = -0.7;
                obj.position.x = (Math.random() - 0.5) * 0.9;
                obj.position.z = (Math.random() - 0.5) * 0.9;
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
  }, [activeState, isParticleMode, particleEnergy]);

  // Mobile Multi-Touch Gestures (Single finger 3D rotate + 2-finger Pinch-to-Zoom)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isPinching = false;
    let initialPinchDist = 0;
    let initialZoomDist = targetZoomDistRef.current;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isSingleTouch = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isSingleTouch = true;
        isPinching = false;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length >= 2) {
        isSingleTouch = false;
        isPinching = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        initialZoomDist = targetZoomDistRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      // Prevent browser default pull-to-refresh or whole-page zoom/scroll during 3D interaction
      if (e.cancelable) {
        e.preventDefault();
      }

      if (isPinching && e.touches.length >= 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);

        if (initialPinchDist > 5) {
          // Pinch distance ratio:
          // Expanding fingers (currentDist > initialPinchDist) -> Zoom In (targetZoomDist decreases)
          // Pinching in (currentDist < initialPinchDist) -> Zoom Out (targetZoomDist increases)
          const scaleFactor = initialPinchDist / Math.max(currentDist, 10);
          const computedZoom = initialZoomDist * scaleFactor;
          const clampedZoom = Math.min(Math.max(computedZoom, 2.2), 7.2);
          targetZoomDistRef.current = clampedZoom;
          setZoomPercent(Math.round((4.8 / clampedZoom) * 100));
        }
      } else if (isSingleTouch && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;

        targetRotationRef.current.y += deltaX * 0.008;
        targetRotationRef.current.x = Math.max(
          Math.min(targetRotationRef.current.x + deltaY * 0.008, Math.PI / 2.3),
          -Math.PI / 2.3
        );

        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isPinching = false;
        isSingleTouch = false;
      } else if (e.touches.length === 1) {
        isPinching = false;
        isSingleTouch = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        initialZoomDist = targetZoomDistRef.current;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  // Desktop Pointer / Mouse Drag Handlers for 3D OrbitControls
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle mouse to avoid conflicting with mobile touch listeners
    if (e.pointerType === 'touch') return;
    isDraggingRef.current = true;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    // Strict pitch clamp so camera never flips upside down or goes out of scene bounds
    targetRotationRef.current.x = Math.max(
      Math.min(targetRotationRef.current.x + deltaY * 0.008, Math.PI / 2.3),
      -Math.PI / 2.3
    );

    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
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
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between gap-1 sm:gap-2 pointer-events-none">
        {/* In-Canvas Mini Tabs to switch between Padat / Cair / Gas */}
        <div className="flex items-center gap-0.5 sm:gap-1 pointer-events-auto bg-white/95 backdrop-blur-md p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/90 sm:border-2 shadow-xs sm:shadow-md">
          <button
            onClick={() => handleSwitchState('solid')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 font-heading ${
              activeState === 'solid'
                ? 'bg-sky-500 text-white shadow-xs scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Lihat Model 3D Zat Padat"
          >
            <span className="text-xs sm:text-sm">🧊</span>
            <span className="hidden xxs:inline xs:inline">Padat</span>
          </button>
          <button
            onClick={() => handleSwitchState('liquid')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 font-heading ${
              activeState === 'liquid'
                ? 'bg-teal-500 text-white shadow-xs scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Lihat Model 3D Zat Cair"
          >
            <span className="text-xs sm:text-sm">💧</span>
            <span className="hidden xxs:inline xs:inline">Cair</span>
          </button>
          <button
            onClick={() => handleSwitchState('gas')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 font-heading ${
              activeState === 'gas'
                ? 'bg-purple-500 text-white shadow-xs scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Lihat Model 3D Zat Gas"
          >
            <span className="text-xs sm:text-sm">☁️</span>
            <span className="hidden xxs:inline xs:inline">Gas</span>
          </button>
        </div>

        {/* Action Controls (Reset, Zoom In, Zoom Out, Fullscreen) */}
        <div className="flex items-center gap-0.5 sm:gap-1 pointer-events-auto bg-white/95 backdrop-blur-md p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-slate-200/90 sm:border-2 shadow-xs sm:shadow-md">
          <button
            onClick={resetCamera}
            title="Reset Posisi Kamera (↻)"
            aria-label="Reset Posisi Kamera"
            className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.6)}
            title="Perbesar Kamera / Zoom In (🔍+)"
            aria-label="Perbesar Kamera"
            className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-sky-700 hover:text-sky-950 hover:bg-sky-50 active:scale-90 transition-all cursor-pointer font-bold"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.6)}
            title="Perkecil Kamera / Zoom Out (🔍-)"
            aria-label="Perkecil Kamera"
            className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-sky-700 hover:text-sky-950 hover:bg-sky-50 active:scale-90 transition-all cursor-pointer font-bold"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="Layar Penuh (⛶)"
            aria-label="Layar Penuh"
            className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Quick-Zoom Widget (Ringkas & pas di Mobile) */}
      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-auto bg-white/95 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-sky-300/80 sm:border-2 shadow-xs sm:shadow-md z-10">
        <button
          onClick={() => handleZoom(-0.6)}
          aria-label="Perbesar Model (Zoom In)"
          title="Perbesar Model (+)"
          className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-800 flex flex-col items-center justify-center shadow-2xs transition-transform active:scale-90 cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          <span className="text-[7px] sm:text-[8px] font-black leading-none mt-0.5">+</span>
        </button>

        <div className="px-0.5 py-0.5 text-[8px] sm:text-[9px] font-mono font-black text-slate-700 select-none">
          {zoomPercent}%
        </div>

        <button
          onClick={() => handleZoom(0.6)}
          aria-label="Perkecil Model (Zoom Out)"
          title="Perkecil Model (-)"
          className="w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 flex flex-col items-center justify-center shadow-2xs transition-transform active:scale-90 cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          <span className="text-[7px] sm:text-[8px] font-black leading-none mt-0.5">−</span>
        </button>
      </div>

      {/* Bottom Floating Bar: Particle Toggle & Interactive Helper */}
      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
        {/* Toggle Particle Button */}
        {onToggleParticleMode && (
          <button
            onClick={() => {
              sound.playPop();
              onToggleParticleMode();
            }}
            className={`pointer-events-auto px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 shadow-xs sm:shadow-md transition-all active:scale-95 cursor-pointer font-heading ${
              isParticleMode
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 border sm:border-2 border-amber-400'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 border sm:border-2 border-indigo-500'
            }`}
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isParticleMode ? '👀 Objek Realistis' : '🔬 Lihat Partikel!'}</span>
          </button>
        )}

        {/* Dynamic Energy Slider for Particles */}
        {isParticleMode ? (
          <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-200/90 sm:border-2 shadow-xs sm:shadow-md text-[10px] sm:text-xs font-bold">
            <span className="text-slate-700">⚡ Energi:</span>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={particleEnergy}
              onChange={(e) => setParticleEnergy(parseFloat(e.target.value))}
              className="w-14 sm:w-24 accent-indigo-600 cursor-pointer"
            />
            <span className="font-mono text-slate-600">{particleEnergy.toFixed(1)}x</span>
          </div>
        ) : (
          <div className="pointer-events-none bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200/80 text-[9px] sm:text-[11px] font-bold text-slate-600 shadow-2xs">
            👆 Putar • 🤏 Cubit Zoom • 🔍 Tombol Zoom
          </div>
        )}
      </div>
    </div>
  );
};
