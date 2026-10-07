import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Flame, Snowflake, Play, RotateCcw, Thermometer, Info } from 'lucide-react';
import { sound } from '../../utils/audio';

export type LabExperimentId = 'melt' | 'evaporate' | 'condense' | 'freeze';

interface ExperimentMeta {
  id: LabExperimentId;
  title: string;
  badge: string;
  changeFormula: string;
  actionText: string;
  explanation: string;
  initialTemp: number;
  targetTemp: number;
  mode: 'heat' | 'cool';
}

const EXPERIMENTS: Record<LabExperimentId, ExperimentMeta> = {
  melt: {
    id: 'melt',
    title: 'Eksperimen 1: Es Batu → Air',
    badge: 'Mencair',
    changeFormula: 'ES (PADAT) → AIR (CAIR)',
    actionText: 'Nyalakan Pemanas 🔥',
    explanation: 'Benda padat berubah menjadi cair karena menerima panas.',
    initialTemp: -5,
    targetTemp: 28,
    mode: 'heat'
  },
  evaporate: {
    id: 'evaporate',
    title: 'Eksperimen 2: Air → Uap',
    badge: 'Menguap',
    changeFormula: 'AIR (CAIR) → UAP (GAS)',
    actionText: 'Didihkan Air 🔥🔥',
    explanation: 'Benda cair berubah menjadi gas karena menerima panas.',
    initialTemp: 25,
    targetTemp: 100,
    mode: 'heat'
  },
  condense: {
    id: 'condense',
    title: 'Eksperimen 3: Uap → Air',
    badge: 'Mengembun',
    changeFormula: 'UAP (GAS) → AIR (CAIR)',
    actionText: 'Beri Tutup Dingin ❄️',
    explanation: 'Gas berubah menjadi cair karena kehilangan panas.',
    initialTemp: 90,
    targetTemp: 35,
    mode: 'cool'
  },
  freeze: {
    id: 'freeze',
    title: 'Eksperimen 4: Air → Es',
    badge: 'Membeku',
    changeFormula: 'AIR (CAIR) → ES (PADAT)',
    actionText: 'Masukkan ke Pendingin ❄️❄️',
    explanation: 'Benda cair berubah menjadi padat karena kehilangan panas.',
    initialTemp: 20,
    targetTemp: -8,
    mode: 'cool'
  }
};

export const LabExperiment3D: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState<LabExperimentId>('melt');
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isRunning, setIsRunning] = useState(false);
  const [currentTemp, setCurrentTemp] = useState<number>(EXPERIMENTS.melt.initialTemp);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const labGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const isRunningRef = useRef(false);

  // Sync ref
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Switch experiment handler
  const handleSelectExp = (id: LabExperimentId) => {
    sound.playPop();
    setSelectedExp(id);
    setProgress(0);
    progressRef.current = 0;
    setIsRunning(false);
    isRunningRef.current = false;
    setCurrentTemp(EXPERIMENTS[id].initialTemp);
  };

  const handleStartExperiment = () => {
    if (progress >= 1) {
      // Reset if completed
      setProgress(0);
      progressRef.current = 0;
    }
    const exp = EXPERIMENTS[selectedExp];
    if (exp.mode === 'heat') {
      sound.playHeat();
    } else {
      sound.playFreeze();
    }
    setIsRunning(true);
    isRunningRef.current = true;
  };

  const handleReset = () => {
    sound.playPop();
    setIsRunning(false);
    isRunningRef.current = false;
    setProgress(0);
    progressRef.current = 0;
    setCurrentTemp(EXPERIMENTS[selectedExp].initialTemp);
  };

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);
    camera.lookAt(0, 0.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lab Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const labKeyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    labKeyLight.position.set(4, 9, 6);
    labKeyLight.castShadow = true;
    scene.add(labKeyLight);

    const labFillLight = new THREE.PointLight(0x93c5fd, 0.8, 12);
    labFillLight.position.set(-4, 3, 2);
    scene.add(labFillLight);

    // Workbench Table
    const tableGeo = new THREE.BoxGeometry(6, 0.3, 3.5);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // White ceramic lab bench
      roughness: 0.3,
      metalness: 0.1,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, -1.2, 0);
    table.receiveShadow = true;
    scene.add(table);

    // Table edge trim
    const trimGeo = new THREE.BoxGeometry(6.1, 0.08, 0.08);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.set(0, -1.05, 1.76);
    scene.add(trim);

    // Main Lab Object Group
    const labGroup = new THREE.Group();
    scene.add(labGroup);
    labGroupRef.current = labGroup;

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

  // Build Scene based on selected experiment
  useEffect(() => {
    const group = labGroupRef.current;
    if (!group) return;

    // Clear previous children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }

    // Common Lab Beaker
    const beakerGeo = new THREE.CylinderGeometry(1.0, 0.95, 2.2, 32, 1, true);
    const beakerMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      roughness: 0.05,
      ior: 1.5,
      transparent: true,
      opacity: 0.4,
    });
    const beaker = new THREE.Mesh(beakerGeo, beakerMat);
    beaker.position.set(0, 0.1, 0);
    group.add(beaker);

    // Beaker Bottom
    const beakerBottom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.06, 32),
      beakerMat
    );
    beakerBottom.position.set(0, -0.98, 0);
    group.add(beakerBottom);

    // Beaker Stand / Tripod
    const tripodRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.06, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 })
    );
    tripodRing.rotation.x = Math.PI / 2;
    tripodRing.position.set(0, -1.02, 0);
    group.add(tripodRing);

    // Tripod Legs
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.1, 12),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
      );
      leg.position.set(Math.cos(angle) * 1.1, -1.55, Math.sin(angle) * 1.1);
      group.add(leg);
    }

    // Bunsen Burner underneath
    const burnerGroup = new THREE.Group();
    burnerGroup.name = 'burnerGroup';
    const burnerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.6, 0.15, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
    );
    burnerBase.position.set(0, -2.0, 0);
    burnerGroup.add(burnerBase);

    const burnerPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 })
    );
    burnerPipe.position.set(0, -1.65, 0);
    burnerGroup.add(burnerPipe);

    // Flame mesh
    const flameGeo = new THREE.ConeGeometry(0.25, 0.65, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b, // Warm orange/blue burner flame
      transparent: true,
      opacity: 0, // initially off
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(0, -1.15, 0);
    flameMesh.name = 'flameMesh';
    burnerGroup.add(flameMesh);

    // Blue inner core flame
    const innerFlameGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
    });
    const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlame.position.set(0, -1.22, 0);
    innerFlame.name = 'innerFlame';
    burnerGroup.add(innerFlame);

    group.add(burnerGroup);

    // Dynamic Substance Meshes depending on experiment
    if (selectedExp === 'melt') {
      // 1. Ice Cube melting into Water
      // Water level starts flat/zero and grows
      const waterMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.92, 0.9, 1.2, 32),
        new THREE.MeshPhysicalMaterial({
          color: 0x0ea5e9,
          transparent: true,
          opacity: 0.8,
          transmission: 0.6,
          roughness: 0.1,
        })
      );
      waterMesh.position.set(0, -0.95, 0);
      waterMesh.scale.set(1, 0.05, 1);
      waterMesh.name = 'waterMesh';
      group.add(waterMesh);

      // Ice Cube that will shrink
      const iceCubeGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
      const iceCubeMat = new THREE.MeshPhysicalMaterial({
        color: 0xbae6fd,
        transmission: 0.7,
        opacity: 0.9,
        roughness: 0.15,
        transparent: true,
      });
      const iceCube = new THREE.Mesh(iceCubeGeo, iceCubeMat);
      iceCube.position.set(0, -0.5, 0);
      iceCube.rotation.set(0.2, 0.4, 0.1);
      iceCube.name = 'iceCube';
      group.add(iceCube);
    } else if (selectedExp === 'evaporate') {
      // 2. Water Boiling and Evaporating into Rising Steam
      const waterMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.92, 0.9, 1.2, 32),
        new THREE.MeshPhysicalMaterial({
          color: 0x0ea5e9,
          transparent: true,
          opacity: 0.8,
          transmission: 0.6,
        })
      );
      waterMesh.position.set(0, -0.4, 0);
      waterMesh.name = 'waterMesh';
      group.add(waterMesh);

      // Steam Particle group
      const steamGroup = new THREE.Group();
      steamGroup.name = 'steamGroup';
      const puffGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const puffMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        roughness: 0.9,
      });
      for (let i = 0; i < 20; i++) {
        const puff = new THREE.Mesh(puffGeo, puffMat.clone());
        puff.position.set(
          (Math.random() - 0.5) * 0.6,
          0.3 + Math.random() * 1.5,
          (Math.random() - 0.5) * 0.6
        );
        puff.userData = { vy: 0.02 + Math.random() * 0.02, scale: 0.5 + Math.random() * 0.8 };
        steamGroup.add(puff);
      }
      group.add(steamGroup);
    } else if (selectedExp === 'condense') {
      // 3. Steam hitting cold watch glass lid and turning to droplets
      // Cold watch glass lid on top
      const lidGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, 0.5);
      const lidMat = new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        transmission: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
      });
      const lid = new THREE.Mesh(lidGeo, lidMat);
      lid.position.set(0, 1.15, 0);
      lid.rotation.x = Math.PI;
      group.add(lid);

      // Droplets group under the lid
      const dropGroup = new THREE.Group();
      dropGroup.name = 'dropGroup';
      const dropGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const dropMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });
      for (let i = 0; i < 12; i++) {
        const drop = new THREE.Mesh(dropGeo, dropMat);
        drop.position.set((Math.random() - 0.5) * 0.9, 0.9, (Math.random() - 0.5) * 0.9);
        drop.userData = { vy: 0.015 + Math.random() * 0.02, startY: 0.9 };
        dropGroup.add(drop);
      }
      group.add(dropGroup);

      // Warm water in bottom
      const waterMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.92, 0.9, 0.6, 32),
        new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.7 })
      );
      waterMesh.position.set(0, -0.68, 0);
      group.add(waterMesh);
    } else {
      // 4. Freezing into Ice Block
      const blockGeo = new THREE.CylinderGeometry(0.92, 0.9, 1.2, 32);
      const freezeMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9, // will transition to frosty ice cyan
        transparent: true,
        opacity: 0.75,
        roughness: 0.1,
      });
      const freezeBlock = new THREE.Mesh(blockGeo, freezeMat);
      freezeBlock.position.set(0, -0.4, 0);
      freezeBlock.name = 'freezeBlock';
      group.add(freezeBlock);

      // Cold frost particles / crystals around
      const frostGroup = new THREE.Group();
      frostGroup.name = 'frostGroup';
      const frostGeo = new THREE.OctahedronGeometry(0.08);
      const frostMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.1 });
      for (let i = 0; i < 16; i++) {
        const f = new THREE.Mesh(frostGeo, frostMat);
        const a = (i / 16) * Math.PI * 2;
        f.position.set(Math.cos(a) * 1.05, -0.9 + Math.random() * 1.1, Math.sin(a) * 1.05);
        f.scale.setScalar(0.01); // starts invisible
        frostGroup.add(f);
      }
      group.add(frostGroup);
    }
  }, [selectedExp]);

  // Animation Loop for Experiment Progression
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const group = labGroupRef.current;
      if (!group) return;

      const exp = EXPERIMENTS[selectedExp];

      // Update Experiment Progress
      if (isRunningRef.current && progressRef.current < 1) {
        progressRef.current = Math.min(progressRef.current + delta * 0.28, 1);
        setProgress(progressRef.current);

        // Update temperature dynamically
        const newTemp = Math.round(
          exp.initialTemp + (exp.targetTemp - exp.initialTemp) * progressRef.current
        );
        setCurrentTemp(newTemp);

        if (progressRef.current >= 1) {
          isRunningRef.current = false;
          setIsRunning(false);
          sound.playCorrect(); // Victory chime for finishing experiment
        }
      }

      const p = progressRef.current;

      // Burner Flame Animation
      const flameMesh = group.getObjectByName('flameMesh') as THREE.Mesh | undefined;
      const innerFlame = group.getObjectByName('innerFlame') as THREE.Mesh | undefined;
      if (flameMesh && innerFlame) {
        if (exp.mode === 'heat' && (isRunningRef.current || (p > 0 && p < 1))) {
          // Flame is ON
          const flameMat = flameMesh.material as THREE.MeshBasicMaterial;
          flameMat.opacity = 0.85;
          const innerMat = innerFlame.material as THREE.MeshBasicMaterial;
          innerMat.opacity = 0.95;

          // Flame flicker
          const flicker = 1 + Math.sin(clock.getElapsedTime() * 25) * 0.08;
          flameMesh.scale.set(flicker, flicker, flicker);
        } else {
          // Flame is OFF
          (flameMesh.material as THREE.MeshBasicMaterial).opacity = 0;
          (innerFlame.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      }

      // Experiment Specific Transformations
      if (selectedExp === 'melt') {
        const iceCube = group.getObjectByName('iceCube') as THREE.Mesh | undefined;
        const waterMesh = group.getObjectByName('waterMesh') as THREE.Mesh | undefined;

        if (iceCube && waterMesh) {
          // Ice cube shrinks
          const s = Math.max(1 - p * 0.88, 0.05);
          iceCube.scale.set(s, s, s);
          iceCube.position.y = -0.5 - p * 0.4;

          // Water expands
          waterMesh.scale.y = 0.05 + p * 0.95;
          waterMesh.position.y = -0.95 + (p * 1.2) / 2;
        }
      } else if (selectedExp === 'evaporate') {
        const steamGroup = group.getObjectByName('steamGroup') as THREE.Group | undefined;
        const waterMesh = group.getObjectByName('waterMesh') as THREE.Mesh | undefined;

        if (waterMesh) {
          // Water boils and reduces slightly
          waterMesh.scale.y = Math.max(1 - p * 0.45, 0.5);
          waterMesh.position.y = -0.4 - (p * 0.3) / 2;
        }

        if (steamGroup) {
          steamGroup.children.forEach(child => {
            if (!(child instanceof THREE.Mesh)) return;
            const puffMat = child.material as THREE.MeshStandardMaterial;
            puffMat.opacity = p * 0.65; // more steam as boiling occurs

            child.position.y += child.userData.vy * (1 + p * 2);
            if (child.position.y > 2.4) {
              child.position.y = 0.3;
              child.position.x = (Math.random() - 0.5) * 0.7;
              child.position.z = (Math.random() - 0.5) * 0.7;
            }
          });
        }
      } else if (selectedExp === 'condense') {
        const dropGroup = group.getObjectByName('dropGroup') as THREE.Group | undefined;
        if (dropGroup) {
          dropGroup.children.forEach(child => {
            if (!(child instanceof THREE.Mesh)) return;
            const dropMat = child.material as THREE.MeshStandardMaterial;
            dropMat.opacity = p > 0.1 ? 0.9 : 0;

            if (p > 0.2) {
              child.position.y -= child.userData.vy;
              if (child.position.y < -0.4) {
                child.position.y = child.userData.startY;
              }
            }
          });
        }
      } else if (selectedExp === 'freeze') {
        const freezeBlock = group.getObjectByName('freezeBlock') as THREE.Mesh | undefined;
        const frostGroup = group.getObjectByName('frostGroup') as THREE.Group | undefined;

        if (freezeBlock) {
          const mat = freezeBlock.material as THREE.MeshPhysicalMaterial;
          // Gradually turns from clear blue to frosted opaque white-cyan
          mat.roughness = 0.1 + p * 0.7;
          mat.transmission = Math.max(0.7 - p * 0.5, 0.15);
          mat.opacity = 0.75 + p * 0.2;
        }

        if (frostGroup) {
          frostGroup.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
              child.scale.setScalar(p * 1.2);
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
  }, [selectedExp]);

  const currentExpMeta = EXPERIMENTS[selectedExp];

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-6">
      {/* 4 Experiment Switcher Tabs - Compact on Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 p-1 bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs">
        {(Object.keys(EXPERIMENTS) as LabExperimentId[]).map(id => {
          const exp = EXPERIMENTS[id];
          const isSelected = selectedExp === id;
          return (
            <button
              key={id}
              onClick={() => handleSelectExp(id)}
              className={`py-1.5 px-2 sm:py-2 sm:px-2.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 text-[11px] sm:text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-xs shadow-sky-600/25 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs sm:text-sm">
                {id === 'melt' && '🧊'}
                {id === 'evaporate' && '💧'}
                {id === 'condense' && '☁️'}
                {id === 'freeze' && '❄️'}
              </span>
              <span className="truncate">
                {id === 'melt' && 'Es Mencair'}
                {id === 'evaporate' && 'Air Menguap'}
                {id === 'condense' && 'Uap Mengembun'}
                {id === 'freeze' && 'Air Membeku'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage & Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 items-start">
        {/* 3D Lab Simulation Canvas (7 cols on large) */}
        <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] lg:min-h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100/90 via-slate-50/60 to-indigo-100/80 border-2 border-sky-200/90 shadow-md backdrop-blur-xs flex flex-col">
          <div ref={mountRef} className="w-full h-full flex-1" />

          {/* Floating Status Banner */}
          <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-800">Lab Eksperimen 3D</span>
            </div>

            {/* Interactive Thermometer Gauge Display */}
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5">
              <Thermometer
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  currentTemp > 40 ? 'text-rose-500' : currentTemp < 10 ? 'text-sky-500' : 'text-amber-500'
                }`}
              />
              <span className="font-mono font-bold text-xs sm:text-sm text-slate-800 tabular-nums">
                {currentTemp}°C
              </span>
            </div>
          </div>

          {/* Bottom Progress Bar inside Canvas */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold text-slate-700">
                <span>Perubahan: {currentExpMeta.changeFormula}</span>
                <span className="font-mono text-sky-600">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 rounded-full ${
                    currentExpMeta.mode === 'heat' ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Controller & Step-by-Step Learning Card (5 cols on large) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3.5 bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
          {/* Header info */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                  currentExpMeta.mode === 'heat'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-sky-100 text-sky-800 border border-sky-300'
                }`}
              >
                {currentExpMeta.mode === 'heat' ? '🔥 Menerima Panas' : '❄️ Melepaskan Panas'}
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-slate-900 font-heading mt-0.5 sm:mt-1">
                {currentExpMeta.title}
              </h3>
            </div>
            <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
              {currentExpMeta.badge}
            </span>
          </div>

          {/* PRIMARY ACTION BUTTONS: Compact on mobile for better visibility */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200/70">
            <button
              onClick={handleStartExperiment}
              disabled={isRunning}
              className={`flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm text-white flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
                currentExpMeta.mode === 'heat'
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                  : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25'
              }`}
            >
              {currentExpMeta.mode === 'heat' ? (
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Snowflake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
              <span>{progress >= 1 ? 'Mulai Ulang' : currentExpMeta.actionText}</span>
            </button>

            <button
              onClick={handleReset}
              title="Reset Eksperimen"
              className="py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl font-semibold text-[11px] sm:text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Explanation card */}
          <div className="bg-sky-50/70 p-2.5 sm:p-3 rounded-xl border border-sky-100 flex items-start gap-2 sm:gap-2.5 text-xs">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sky-900 font-bold uppercase tracking-wide block text-[10px] sm:text-xs">
                Konsep Sains:
              </strong>
              <p className="font-medium text-slate-700 mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                {currentExpMeta.explanation}
              </p>
            </div>
          </div>

          {/* Step-by-step checklist */}
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="font-bold uppercase text-slate-400 text-[10px] tracking-wider">
              Alur Eksperimen:
            </div>

            <div
              className={`p-2 rounded-xl border flex items-center gap-2.5 transition-colors ${
                progress === 0
                  ? 'border-sky-500 bg-sky-50/50'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                1
              </div>
              <div className="font-medium">
                Amati zat pada suhu awal ({currentExpMeta.initialTemp}°C)
              </div>
            </div>

            <div
              className={`p-2 rounded-xl border flex items-center gap-2.5 transition-colors ${
                progress > 0 && progress < 1
                  ? 'border-amber-500 bg-amber-50/50'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                2
              </div>
              <div className="font-medium">
                {currentExpMeta.mode === 'heat'
                  ? 'Panas diberikan, suhu zat naik perlahan'
                  : 'Panas dilepaskan, suhu zat mendingin'}
              </div>
            </div>

            <div
              className={`p-2 rounded-xl border flex items-center gap-2.5 transition-colors ${
                progress >= 1
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                3
              </div>
              <div>
                Selesai! Wujud zat berubah menjadi {currentExpMeta.badge.toLowerCase()} sempurna.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
