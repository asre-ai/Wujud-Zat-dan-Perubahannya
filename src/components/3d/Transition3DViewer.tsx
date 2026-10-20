import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TransitionType } from '../../types';
import { TRANSITIONS_DATA } from '../../data/learningData';
import { Play, RotateCcw, Flame, Snowflake, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface Transition3DViewerProps {
  transitionType: TransitionType;
}

export const Transition3DViewer: React.FC<Transition3DViewerProps> = ({ transitionType }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<number>(0); // 0 (start state) to 1 (end state)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const currentTransition = TRANSITIONS_DATA[transitionType] || TRANSITIONS_DATA.melting;

  // Reset phase when transitionType changes
  useEffect(() => {
    setPhase(0);
    phaseRef.current = 0;
    setIsPlaying(true);
    isPlayingRef.current = true;
  }, [transitionType]);

  // Setup Three.js Stage
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 4.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(4, 6, 4);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xbae6fd, 0.6);
    fillLight.position.set(-3, -1, -2);
    scene.add(fillLight);

    // Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Soft pedestal plate
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.65, 0.08, 32),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
    );
    plate.position.y = -0.9;
    scene.add(plate);

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

  // Build 3D Models according to transition type
  useEffect(() => {
    const group = modelGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const c = group.children[0];
      group.remove(c);
      if (c instanceof THREE.Mesh) {
        c.geometry.dispose();
        if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
        else c.material.dispose();
      }
    }

    if (transitionType === 'melting') {
      // PADAT -> CAIR (Ice cube shrinking + water puddle expanding)
      const iceGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const iceMat = new THREE.MeshPhysicalMaterial({
        color: 0xbae6fd,
        transmission: 0.7,
        roughness: 0.1,
        transparent: true,
      });
      const ice = new THREE.Mesh(iceGeo, iceMat);
      ice.position.y = -0.2;
      ice.name = 'ice';
      group.add(ice);

      const waterGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.1, 32);
      const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.8,
      });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.position.y = -0.85;
      water.scale.set(0.1, 1, 0.1);
      water.name = 'water';
      group.add(water);
    } else if (transitionType === 'freezing') {
      // CAIR -> PADAT (Water pond freezing into solid ice crystals)
      const waterGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.25, 32);
      const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
      });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.position.y = -0.7;
      water.name = 'water';
      group.add(water);

      // Frost crystals growing on top
      const crystalGeo = new THREE.OctahedronGeometry(0.3);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        roughness: 0.1,
        metalness: 0.1,
      });
      const crystalGroup = new THREE.Group();
      crystalGroup.name = 'crystalGroup';
      for (let i = 0; i < 7; i++) {
        const c = new THREE.Mesh(crystalGeo, crystalMat);
        const a = (i / 7) * Math.PI * 2;
        c.position.set(Math.cos(a) * 0.7, -0.6, Math.sin(a) * 0.7);
        c.scale.setScalar(0.01);
        crystalGroup.add(c);
      }
      group.add(crystalGroup);
    } else if (transitionType === 'evaporation') {
      // CAIR -> GAS (Water in cup diminishing + steam rising)
      const cupGeo = new THREE.CylinderGeometry(0.9, 0.8, 1.4, 32, 1, true);
      const cupMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 0.5 });
      const cup = new THREE.Mesh(cupGeo, cupMat);
      cup.position.y = -0.2;
      group.add(cup);

      const waterGeo = new THREE.CylinderGeometry(0.85, 0.78, 1.0, 32);
      const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, opacity: 0.85, transparent: true });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.position.y = -0.4;
      water.name = 'water';
      group.add(water);

      // Rising steam puffs
      const steamGroup = new THREE.Group();
      steamGroup.name = 'steamGroup';
      const puffGeo = new THREE.SphereGeometry(0.16, 12, 12);
      const puffMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
      for (let i = 0; i < 16; i++) {
        const puff = new THREE.Mesh(puffGeo, puffMat);
        puff.position.set((Math.random() - 0.5) * 0.6, 0.4 + Math.random() * 1.2, (Math.random() - 0.5) * 0.6);
        puff.userData = { vy: 0.02 + Math.random() * 0.015 };
        steamGroup.add(puff);
      }
      group.add(steamGroup);
    } else if (transitionType === 'condensation') {
      // GAS -> CAIR (Cold surface with condensing water droplets)
      const glassSheet = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 1.6, 0.06),
        new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transmission: 0.85, opacity: 0.6, roughness: 0.1 })
      );
      glassSheet.position.set(0, 0, 0);
      glassSheet.name = 'glassSheet';
      group.add(glassSheet);

      // Condensation droplets
      const dropGroup = new THREE.Group();
      dropGroup.name = 'dropGroup';
      const dropGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const dropMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 });
      for (let i = 0; i < 22; i++) {
        const d = new THREE.Mesh(dropGeo, dropMat);
        d.position.set((Math.random() - 0.5) * 1.7, (Math.random() - 0.5) * 1.3, 0.04);
        d.scale.set(1, 1, 0.4);
        dropGroup.add(d);
      }
      group.add(dropGroup);
    } else if (transitionType === 'sublimation') {
      // PADAT -> GAS (Camphor / Dry Ice ball shrinking + gas fragrance vapor spreading)
      const ballGeo = new THREE.SphereGeometry(0.8, 32, 32);
      const ballMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      ball.position.y = -0.1;
      ball.name = 'ball';
      group.add(ball);

      // Vapor cloud expanding directly around it
      const vaporGroup = new THREE.Group();
      vaporGroup.name = 'vaporGroup';
      const vGeo = new THREE.DodecahedronGeometry(0.25, 1);
      const vMat = new THREE.MeshStandardMaterial({ color: 0xd8b4fe, transparent: true, opacity: 0.45 });
      for (let i = 0; i < 20; i++) {
        const v = new THREE.Mesh(vGeo, vMat);
        v.position.set((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.6);
        v.userData = { vr: 0.01 + Math.random() * 0.02 };
        vaporGroup.add(v);
      }
      group.add(vaporGroup);
    } else {
      // GAS -> PADAT (Deposition: Vapor turning into Ice Crystal needles)
      const branchGroup = new THREE.Group();
      branchGroup.name = 'branchGroup';

      const needleGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.8, 8);
      const needleMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.1 });

      for (let i = 0; i < 18; i++) {
        const needle = new THREE.Mesh(needleGeo, needleMat);
        const a = (i / 18) * Math.PI * 2;
        needle.position.set(Math.cos(a) * 0.5, -0.2 + (Math.random() - 0.5) * 0.6, Math.sin(a) * 0.5);
        needle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        needle.scale.setScalar(0.01); // starts invisible
        branchGroup.add(needle);
      }
      group.add(branchGroup);
    }
  }, [transitionType]);

  // Animation Loop
  useEffect(() => {
    const timer = new (THREE as any).Timer();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();
      const group = modelGroupRef.current;
      if (!group) return;

      if (isPlayingRef.current) {
        phaseRef.current = (phaseRef.current + delta * 0.3) % 1.0;
        setPhase(phaseRef.current);
      }

      const p = phaseRef.current;
      group.rotation.y += 0.005;

      if (transitionType === 'melting') {
        const ice = group.getObjectByName('ice') as THREE.Mesh | undefined;
        const water = group.getObjectByName('water') as THREE.Mesh | undefined;
        if (ice && water) {
          const s = Math.max(1 - p * 0.85, 0.1);
          ice.scale.set(s, s, s);
          ice.position.y = -0.2 - p * 0.5;

          const ws = 0.2 + p * 0.85;
          water.scale.set(ws, 1, ws);
        }
      } else if (transitionType === 'freezing') {
        const water = group.getObjectByName('water') as THREE.Mesh | undefined;
        const crystalGroup = group.getObjectByName('crystalGroup') as THREE.Group | undefined;
        if (water && crystalGroup) {
          (water.material as THREE.MeshPhysicalMaterial).roughness = 0.1 + p * 0.6;
          crystalGroup.children.forEach(c => {
            if (c instanceof THREE.Mesh) c.scale.setScalar(p * 1.1);
          });
        }
      } else if (transitionType === 'evaporation') {
        const water = group.getObjectByName('water') as THREE.Mesh | undefined;
        const steamGroup = group.getObjectByName('steamGroup') as THREE.Group | undefined;
        if (water) {
          water.scale.y = Math.max(1 - p * 0.6, 0.4);
        }
        if (steamGroup) {
          steamGroup.children.forEach(pMesh => {
            if (pMesh instanceof THREE.Mesh) {
              pMesh.position.y += pMesh.userData.vy;
              if (pMesh.position.y > 1.8) {
                pMesh.position.y = 0.3;
              }
            }
          });
        }
      } else if (transitionType === 'condensation') {
        const dropGroup = group.getObjectByName('dropGroup') as THREE.Group | undefined;
        if (dropGroup) {
          dropGroup.children.forEach(d => {
            if (d instanceof THREE.Mesh) {
              d.scale.setScalar(p * 1.2);
            }
          });
        }
      } else if (transitionType === 'sublimation') {
        const ball = group.getObjectByName('ball') as THREE.Mesh | undefined;
        const vaporGroup = group.getObjectByName('vaporGroup') as THREE.Group | undefined;
        if (ball) {
          const s = Math.max(1 - p * 0.75, 0.2);
          ball.scale.set(s, s, s);
        }
        if (vaporGroup) {
          vaporGroup.children.forEach(v => {
            if (v instanceof THREE.Mesh) {
              v.scale.setScalar(p * 1.4);
              (v.material as THREE.MeshStandardMaterial).opacity = Math.max((1 - p) * 0.6, 0.1);
            }
          });
        }
      } else {
        const branchGroup = group.getObjectByName('branchGroup') as THREE.Group | undefined;
        if (branchGroup) {
          branchGroup.children.forEach(n => {
            if (n instanceof THREE.Mesh) {
              n.scale.setScalar(p * 1.3);
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
      timer.dispose();
    };
  }, [transitionType]);

  const togglePlay = () => {
    sound.playPop();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    sound.playPop();
    setPhase(0);
    phaseRef.current = 0;
  };

  return (
    <div className="relative w-full h-[320px] rounded-3xl overflow-hidden bg-gradient-to-b from-sky-100/80 via-white/50 to-purple-100/70 border-2 border-indigo-200/90 shadow-md backdrop-blur-xs flex flex-col">
      <div ref={mountRef} className="w-full h-full flex-1" />

      {/* Floating Status & Formula */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
          {currentTransition.heatAction === 'absorb' ? (
            <Flame className="w-4 h-4 text-orange-500" />
          ) : (
            <Snowflake className="w-4 h-4 text-sky-500" />
          )}
          <span className="text-xs font-bold text-slate-800 font-mono">
            {currentTransition.simpleFormula}
          </span>
        </div>

        {/* Play / Pause / Reset button */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={togglePlay}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title={isPlaying ? 'Jeda' : 'Putar'}
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-slate-700' : ''}`} />
          </button>
          <button
            onClick={handleReset}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Reset Animasi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Timeline Indicator */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-xs font-semibold">
          <span className="text-slate-500">Mulai</span>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-75 rounded-full ${
                currentTransition.heatAction === 'absorb' ? 'bg-orange-500' : 'bg-sky-500'
              }`}
              style={{ width: `${phase * 100}%` }}
            />
          </div>
          <span className="text-slate-800 font-bold">{currentTransition.name} ✨</span>
        </div>
      </div>
    </div>
  );
};
