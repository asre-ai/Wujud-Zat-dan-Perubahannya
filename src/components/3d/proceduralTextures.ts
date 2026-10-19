import * as THREE from 'three';

/**
 * Procedural Wood Grain Texture Generator
 * Produces warm timber with organic annular rings and fine grain fibers
 */
export function createWoodTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base wood color
  ctx.fillStyle = '#9e6738';
  ctx.fillRect(0, 0, size, size);

  // Wavy grain rings
  const numRings = 40;
  for (let r = 0; r < numRings; r++) {
    const yCenter = size * 0.45;
    const xCenter = size * 0.5;
    const radius = 15 + r * 14;

    ctx.beginPath();
    ctx.strokeStyle = r % 2 === 0 ? 'rgba(92, 53, 22, 0.4)' : 'rgba(182, 126, 75, 0.35)';
    ctx.lineWidth = 3 + (r % 3) * 2;

    for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
      // Add Perlin-like distortion to rings
      const wobble = Math.sin(angle * 6) * 6 + Math.cos(angle * 12) * 3;
      const x = xCenter + (radius + wobble) * Math.cos(angle);
      const y = yCenter + (radius + wobble) * 0.6 * Math.sin(angle);
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Fine longitudinal fiber streaks
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const length = 30 + Math.random() * 80;
    const alpha = 0.05 + Math.random() * 0.12;

    ctx.beginPath();
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(60, 32, 10, ${alpha})` : `rgba(220, 160, 100, ${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y + length);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural Natural Stone / Granite Texture Generator
 * Produces tactile stone diffuse map and bump map
 */
export function createStoneTextures(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext('2d');

  if (!ctx || !bumpCtx) {
    const t = new THREE.CanvasTexture(canvas);
    return { map: t, bumpMap: t };
  }

  // Base stone grey
  ctx.fillStyle = '#52616b';
  ctx.fillRect(0, 0, size, size);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, size, size);

  // Large mineral patches
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rad = 20 + Math.random() * 50;
    const dark = Math.random() > 0.5;

    ctx.beginPath();
    ctx.fillStyle = dark ? 'rgba(30, 41, 59, 0.25)' : 'rgba(203, 213, 225, 0.22)';
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();

    bumpCtx.beginPath();
    bumpCtx.fillStyle = dark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
    bumpCtx.arc(x, y, rad, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  // Micro quartz & feldspar specks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = 1 + Math.random() * 2.5;
    const rand = Math.random();

    let color = 'rgba(255, 255, 255, 0.4)';
    let bumpVal = 'rgba(255, 255, 255, 0.5)';
    if (rand < 0.4) {
      color = 'rgba(15, 23, 42, 0.45)';
      bumpVal = 'rgba(0, 0, 0, 0.5)';
    } else if (rand < 0.7) {
      color = 'rgba(148, 163, 184, 0.35)';
      bumpVal = 'rgba(180, 180, 180, 0.3)';
    }

    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, w);

    bumpCtx.fillStyle = bumpVal;
    bumpCtx.fillRect(x, y, w, w);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

/**
 * Procedural Sparkle Particle Glow Texture
 */
export function createSparkleTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, size, size);

    // Radial gradient glow
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(253, 224, 71, 0.9)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // 4-point cross glint
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(size / 2, 8);
    ctx.lineTo(size / 2, size - 8);
    ctx.moveTo(8, size / 2);
    ctx.lineTo(size - 8, size / 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
