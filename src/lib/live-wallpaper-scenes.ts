import * as THREE from "three";

/**
 * Scene library for the live wallpaper generator. All time-dependent terms are
 * of the form 2π·k·(t/T) with integer k, so update(0) and update(T) render
 * identically — a hard guarantee for seamless video loops. This module is
 * dynamically imported by the tool page (three.js stays out of common chunks).
 */

export type SceneKind =
  | "galaxy"
  | "waves"
  | "geometry"
  | "nebula"
  | "globe"
  | "tunnel"
  | "aurora"
  | "fireflies"
  | "snow"
  | "matrix"
  | "grid"
  | "rain";

export interface LiveScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Deterministic update: pass explicit t in seconds (never a clock). */
  update(t: number): void;
  dispose(): void;
}

export interface BuildSceneOptions {
  seed: string;
  colors: string[];
  loopSeconds: number;
  aspect?: number;
}

// ---------- Seeded PRNG ----------
export function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

export function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Shared presets ----------
export const PALETTES: { colors: string[] }[] = [
  { colors: ["#020617", "#1e3a8a", "#3b82f6", "#93c5fd"] },
  { colors: ["#0b1026", "#2b3a8f", "#7b5cff", "#38d3d3"] },
  { colors: ["#2b0f3a", "#7a2a8f", "#ff5e62", "#ffc371"] },
  { colors: ["#012433", "#02667d", "#00a5b5", "#8ee3ef"] },
  { colors: ["#0b2318", "#1d5c3a", "#4caf7d", "#c8e6a0"] },
  { colors: ["#3d1140", "#c934a5", "#ff8bd1", "#ffe3f5"] },
  { colors: ["#1a0b09", "#7c2d12", "#ea580c", "#fbbf24"] },
  { colors: ["#4a1d3f", "#a83c7d", "#f2a2c8", "#fde8ef"] },
  { colors: ["#2f2013", "#a16207", "#d6a756", "#f5e6c8"] },
  { colors: ["#052e2b", "#0f766e", "#2dd4bf", "#a7f3d0"] },
  { colors: ["#111827", "#374151", "#9ca3af", "#e5e7eb"] },
  { colors: ["#1e1b4b", "#6d28d9", "#a78bfa", "#ede9fe"] },
];

export const SIZE_PRESETS: { w: number; h: number; kind: "desktop" | "phone" | "tablet" }[] = [
  { w: 1920, h: 1080, kind: "desktop" },
  { w: 2560, h: 1440, kind: "desktop" },
  { w: 3840, h: 2160, kind: "desktop" },
  { w: 1170, h: 2532, kind: "phone" },
  { w: 1080, h: 2400, kind: "phone" },
  { w: 1440, h: 3200, kind: "phone" },
  { w: 2048, h: 2732, kind: "tablet" },
];

export const DURATIONS = [5, 10, 20];
export const FPS_OPTIONS = [30, 60];

/** Rough H.264 bitrate: 1080p30 ≈ 9.3 Mbps, 4K30 ≈ 37 Mbps, 4K60 ≈ 75 Mbps. */
export function estimateBitrate(w: number, h: number, fps: number): number {
  return Math.min(100e6, Math.max(5e6, Math.round(w * h * fps * 0.15)));
}

export function createRenderer(
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
  pixelRatio = 1
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: true,
    // Required so VideoFrame/toBlob/captureStream can read the WebGL buffer.
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

const TAU = Math.PI * 2;

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh & { geometry?: THREE.BufferGeometry; material?: THREE.Material };
    mesh.geometry?.dispose();
    if (mesh.material) mesh.material.dispose();
  });
}

// ---------- Galaxy ----------
function buildGalaxy(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 300);

  const group = new THREE.Group();
  group.rotation.x = 0.55;
  scene.add(group);

  const inner = new THREE.Color(colors[1]);
  const outer = new THREE.Color(colors[3]);
  const armCount = 2 + Math.floor(rand() * 3);
  const rings: { points: THREE.Points; k: number }[] = [];

  for (let r = 0; r < 3; r++) {
    const count = 8000;
    const rIn = 1.1 + r * 0.8;
    const rOut = 4.6 + r * 1.7;
    const positions = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const radius = rIn + (rOut - rIn) * Math.pow(rand(), 0.7);
      const arm = Math.floor(rand() * armCount);
      const spread = (1 - radius / rOut) * 0.55 + 0.12;
      const angle =
        (arm / armCount) * TAU + (radius / rOut) * (2.2 + rand() * 0.9) + (rand() - 0.5) * spread * 2;
      const y = (rand() + rand() + rand() - 1.5) * 0.32 * (1 - (0.7 * radius) / rOut);
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      tmp.copy(inner).lerp(outer, Math.min(1, Math.max(0, (radius - rIn) / (rOut - rIn))));
      const bright = 0.55 + rand() * 0.45;
      cols[i * 3] = tmp.r * bright;
      cols[i * 3 + 1] = tmp.g * bright;
      cols[i * 3 + 2] = tmp.b * bright;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    rings.push({ points, k: 1 + Math.floor(rand() * 3) });
    group.add(points);
  }

  // Soft core glow
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext("2d")!;
  const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.9)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.25)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(colors[2]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  glow.scale.setScalar(3.2);
  group.add(glow);

  const camY = 2.1 + rand() * 0.8;
  const camDist = 7.2 + rand() * 1.6;
  camera.position.set(0, camY, camDist);
  camera.lookAt(0, 0, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (const { points, k } of rings) points.rotation.y = TAU * k * p;
      camera.position.y = camY + 0.15 * Math.sin(TAU * p);
      camera.lookAt(0, 0, 0);
    },
    dispose() {
      disposeObject(scene);
      glowTex.dispose();
    },
  };
}

// ---------- Waves ----------
function buildWaves(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  scene.fog = new THREE.Fog(new THREE.Color(colors[0]), 16, 42);
  const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 200);

  const domain = 26;
  const geo = new THREE.PlaneGeometry(domain, domain, 140, 140);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const colArr = new Float32Array(pos.count * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.2 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(6, 10, 4);
  scene.add(key);

  // 3 wave components; temporal frequency f_j is an integer → periodic in T.
  // Wave numbers are integer cycles across the domain → spatially tileable too.
  type Comp = { amp: number; f: number; kx: number; kz: number; phase: number };
  const comps: Comp[] = [];
  for (let j = 0; j < 3; j++) {
    comps.push({
      amp: 0.62 - j * 0.16,
      f: 1 + Math.floor(rand() * 3),
      kx: ((1 + Math.floor(rand() * 4)) * TAU) / domain,
      kz: ((1 + Math.floor(rand() * 4)) * TAU) / domain,
      phase: rand() * TAU,
    });
  }
  const totalAmp = comps.reduce((s, c) => s + c.amp, 0);

  const c1 = new THREE.Color(colors[1]);
  const c2 = new THREE.Color(colors[2]);
  const c3 = new THREE.Color(colors[3]);
  const tmp = new THREE.Color();

  camera.position.set(0, 7.5, 13.5);
  camera.lookAt(0, 0, -1);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      const timeTerms = comps.map((c) => TAU * c.f * p + c.phase);
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        let y = 0;
        for (let j = 0; j < comps.length; j++) {
          const c = comps[j];
          y += c.amp * Math.sin(timeTerms[j] + c.kx * x + c.kz * z);
        }
        pos.setY(i, y);

        const norm = Math.min(1, Math.max(-1, y / totalAmp));
        if (norm < 0) tmp.copy(c1).lerp(c2, norm + 1);
        else tmp.copy(c2).lerp(c3, norm);
        colArr[i * 3] = tmp.r;
        colArr[i * 3 + 1] = tmp.g;
        colArr[i * 3 + 2] = tmp.b;
      }
      pos.needsUpdate = true;
      (geo.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
      // Slow integer-cycle camera sway
      camera.position.x = Math.sin(TAU * p) * 1.2;
      camera.lookAt(0, 0, -1);
    },
    dispose() {
      disposeObject(scene);
    },
  };
}

// ---------- Geometry field ----------
function buildGeometryField(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(6, 9, 7);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  fill.position.set(-7, -3, -5);
  scene.add(fill);

  const icoGeo = new THREE.IcosahedronGeometry(0.62, 0);
  const torusGeo = new THREE.TorusGeometry(0.46, 0.17, 12, 26);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.5 });

  const perMesh = 70;
  const icoMesh = new THREE.InstancedMesh(icoGeo, mat, perMesh);
  const torusMesh = new THREE.InstancedMesh(torusGeo, mat, perMesh);
  scene.add(icoMesh, torusMesh);

  const cA = new THREE.Color(colors[1]);
  const cB = new THREE.Color(colors[2]);
  const cC = new THREE.Color(colors[3]);
  const tmp = new THREE.Color();

  type Inst = { mesh: THREE.InstancedMesh; idx: number; base: THREE.Vector3; axis: THREE.Vector3; n: number; m: number; bob: number; phase: number };
  const insts: Inst[] = [];
  const meshes = [icoMesh, torusMesh];

  for (let i = 0; i < perMesh * 2; i++) {
    const mesh = meshes[i % 2];
    const idx = Math.floor(i / 2);
    insts.push({
      mesh,
      idx,
      base: new THREE.Vector3((rand() - 0.5) * 14, (rand() - 0.5) * 7.5, (rand() - 0.5) * 8),
      axis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
      n: 1 + Math.floor(rand() * 3),
      m: 1 + Math.floor(rand() * 2),
      bob: 0.25 + rand() * 0.45,
      phase: rand() * TAU,
    });
    tmp.copy(cA).lerp(rand() < 0.5 ? cB : cC, rand());
    mesh.setColorAt(idx, tmp);
  }
  icoMesh.instanceColor!.needsUpdate = true;
  torusMesh.instanceColor!.needsUpdate = true;

  camera.position.set(0, 0, 15);
  camera.lookAt(0, 0, 0);
  const dummy = new THREE.Object3D();
  const q = new THREE.Quaternion();

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (const s of insts) {
        q.setFromAxisAngle(s.axis, TAU * s.n * p);
        dummy.quaternion.copy(q);
        dummy.position.set(s.base.x, s.base.y + s.bob * Math.sin(TAU * s.m * p + s.phase), s.base.z);
        dummy.updateMatrix();
        s.mesh.setMatrixAt(s.idx, dummy.matrix);
      }
      icoMesh.instanceMatrix.needsUpdate = true;
      torusMesh.instanceMatrix.needsUpdate = true;
      camera.position.x = Math.sin(TAU * p) * 1.4;
      camera.position.y = Math.cos(TAU * p) * 0.8;
      camera.lookAt(0, 0, 0);
    },
    dispose() {
      disposeObject(scene);
    },
  };
}

// ---------- Nebula ----------
function buildNebula(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 300);

  const clusterCount = 3 + Math.floor(rand() * 2);
  const perCluster = 2200;
  const total = clusterCount * perCluster;

  const positions = new Float32Array(total * 3);
  const cols = new Float32Array(total * 3);
  const base = new Float32Array(total * 3);
  const dir = new Float32Array(total * 3);
  const amp = new Float32Array(total);
  const freq = new Float32Array(total);
  const phase = new Float32Array(total);

  const cA = new THREE.Color(colors[1]);
  const cB = new THREE.Color(colors[2]);
  const cC = new THREE.Color(colors[3]);
  const clusterPalette = [cA, cB, cC];
  const tmp = new THREE.Color();

  for (let c = 0; c < clusterCount; c++) {
    const cx = (rand() - 0.5) * 16;
    const cy = (rand() - 0.5) * 9;
    const cz = (rand() - 0.5) * 8 - 2;
    const spread = 2.2 + rand() * 2.4;
    const clusterColor = clusterPalette[c % 3];

    for (let i = 0; i < perCluster; i++) {
      const idx = c * perCluster + i;
      base[idx * 3] = cx + (rand() + rand() + rand() - 1.5) * spread;
      base[idx * 3 + 1] = cy + (rand() + rand() + rand() - 1.5) * spread * 0.7;
      base[idx * 3 + 2] = cz + (rand() + rand() + rand() - 1.5) * spread;

      const dx = rand() - 0.5;
      const dy = rand() - 0.5;
      const dz = rand() - 0.5;
      const len = Math.hypot(dx, dy, dz) || 1;
      dir[idx * 3] = dx / len;
      dir[idx * 3 + 1] = dy / len;
      dir[idx * 3 + 2] = dz / len;

      amp[idx] = 0.3 + rand() * 0.9;
      freq[idx] = 1 + Math.floor(rand() * 2);
      phase[idx] = rand() * TAU;

      tmp.copy(clusterColor).lerp(cC, rand() * 0.5);
      const bright = 0.5 + rand() * 0.5;
      cols[idx * 3] = tmp.r * bright;
      cols[idx * 3 + 1] = tmp.g * bright;
      cols[idx * 3 + 2] = tmp.b * bright;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(geo, mat));

  // Two large soft glows for depth
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext("2d")!;
  const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.14)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  for (let g = 0; g < 2; g++) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: new THREE.Color(colors[g === 0 ? 2 : 1]),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.5,
      })
    );
    sprite.position.set((rand() - 0.5) * 10, (rand() - 0.5) * 6, -4 - rand() * 3);
    sprite.scale.setScalar(6 + rand() * 5);
    scene.add(sprite);
  }

  const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;

  camera.position.set(0, 1.5, 11);
  camera.lookAt(0, 0, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (let i = 0; i < total; i++) {
        const s = amp[i] * Math.sin(TAU * freq[i] * p + phase[i]);
        arr[i * 3] = base[i * 3] + dir[i * 3] * s;
        arr[i * 3 + 1] = base[i * 3 + 1] + dir[i * 3 + 1] * s;
        arr[i * 3 + 2] = base[i * 3 + 2] + dir[i * 3 + 2] * s;
      }
      posAttr.needsUpdate = true;
      camera.position.x = Math.sin(TAU * p) * 0.8;
      camera.position.y = 1.5 + Math.cos(TAU * p) * 0.4;
      camera.lookAt(0, 0, 0);
    },
    dispose() {
      disposeObject(scene);
      glowTex.dispose();
    },
  };
}

// ---------- Globe ----------
function buildGlobe(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);

  const R = 2.6;
  const group = new THREE.Group();
  group.rotation.z = 0.4; // axial tilt
  scene.add(group);

  // Fibonacci sphere dot cloud, colored by latitude
  const count = 3500;
  const positions = new Float32Array(count * 3);
  const cols = new Float32Array(count * 3);
  const cTop = new THREE.Color(colors[2]);
  const cBottom = new THREE.Color(colors[1]);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * R;
    positions[i * 3 + 1] = y * R;
    positions[i * 3 + 2] = Math.sin(theta) * r * R;
    tmp.copy(cBottom).lerp(cTop, (y + 1) / 2);
    cols[i * 3] = tmp.r;
    cols[i * 3 + 1] = tmp.g;
    cols[i * 3 + 2] = tmp.b;
  }

  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  dotGeo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  group.add(
    new THREE.Points(
      dotGeo,
      new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true })
    )
  );

  const wire = new THREE.Mesh(
    new THREE.SphereGeometry(R, 24, 16),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(colors[3]), wireframe: true, transparent: true, opacity: 0.15 })
  );
  group.add(wire);

  // Atmosphere glow
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext("2d")!;
  const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.4)");
  grad.addColorStop(0.42, "rgba(255,255,255,0.1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(colors[3]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 })
  );
  glow.scale.setScalar(8.5);
  scene.add(glow);

  // Counter-rotating starfield shell
  const starCount = 800;
  const starPos = new Float32Array(starCount * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < starCount; i++) {
    v.set(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(20 + rand() * 20);
    starPos[i * 3] = v.x;
    starPos[i * 3 + 1] = v.y;
    starPos[i * 3 + 2] = v.z;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.7, sizeAttenuation: true })
  );
  scene.add(stars);

  camera.position.set(0, 0.6, 7.5);
  camera.lookAt(0, 0, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      group.rotation.y = TAU * p;
      stars.rotation.y = -TAU * p;
      camera.position.y = 0.6 + Math.sin(TAU * p) * 0.25;
      camera.lookAt(0, 0, 0);
    },
    dispose() {
      disposeObject(scene);
      glowTex.dispose();
    },
  };
}

// ---------- Tunnel ----------
function buildTunnel(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  scene.fog = new THREE.Fog(new THREE.Color(colors[0]), 6, 34);
  const camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 100);

  const N = 36;
  const d = 1.4;
  const L = N * d;
  const geo = new THREE.TorusGeometry(3.2, 0.05, 8, 64);

  const cNear = new THREE.Color(colors[3]);
  const cMid = new THREE.Color(colors[2]);
  const cFar = new THREE.Color(colors[1]);
  const tmp = new THREE.Color();

  type Ring = { mesh: THREE.Mesh; k: number };
  const rings: Ring[] = [];
  for (let i = 0; i < N; i++) {
    const f = i / N;
    tmp.copy(f < 0.5 ? cNear : cMid).lerp(f < 0.5 ? cMid : cFar, f < 0.5 ? f * 2 : (f - 0.5) * 2);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: tmp.clone(), transparent: true, opacity: 0.9 }));
    scene.add(mesh);
    rings.push({ mesh, k: 1 + Math.floor(rand() * 3) });
  }

  // Bright glow at the far end of the tunnel
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext("2d")!;
  const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.8)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.2)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(colors[3]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  glow.position.set(0, 0, -18);
  glow.scale.setScalar(10);
  scene.add(glow);

  camera.position.set(0, 0, 3.5);
  camera.lookAt(0, 0, -20);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (let i = 0; i < N; i++) {
        const ring = rings[i].mesh;
        // Rings stream toward the camera; mod keeps the loop seamless.
        ring.position.z = 3.5 - (((i * d + L * p) % L) + L) % L;
        ring.rotation.z = TAU * rings[i].k * p;
        ring.scale.setScalar(1 + 0.06 * Math.sin(TAU * 2 * p + i * 0.5));
      }
      camera.rotation.z = Math.sin(TAU * p) * 0.04;
    },
    dispose() {
      disposeObject(scene);
      glowTex.dispose();
    },
  };
}

// ---------- Aurora ----------
function buildAurora(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 200);

  // Static starfield, slow full-turn spin
  const starCount = 500;
  const starPos = new Float32Array(starCount * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < starCount; i++) {
    v.set(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize().multiplyScalar(30 + rand() * 30);
    starPos[i * 3] = v.x;
    starPos[i * 3 + 1] = v.y;
    starPos[i * 3 + 2] = v.z;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: new THREE.Color(colors[3]), size: 0.14, transparent: true, opacity: 0.7, sizeAttenuation: true })
  );
  scene.add(stars);

  // Luminous curtains: additive planes with vertex-colored vertical fade
  // (black adds nothing under AdditiveBlending, acting as free alpha).
  const curtainCount = 9 + Math.floor(rand() * 4); // 9-12 curtains
  const H = 13;
  type Curtain = {
    mesh: THREE.Mesh;
    geo: THREE.BufferGeometry;
    base: Float32Array;
    amp: number;
    k: number;
    ky: number;
    kx: number;
    phase: number;
    zamp: number;
    zphase: number;
    mat: THREE.MeshBasicMaterial;
  };
  const curtains: Curtain[] = [];
  const palette = [new THREE.Color(colors[1]), new THREE.Color(colors[2]), new THREE.Color(colors[3])];

  for (let c = 0; c < curtainCount; c++) {
    const geo = new THREE.PlaneGeometry(7, H, 12, 30);
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const base = new Float32Array(pos.array as Float32Array);
    const colArr = new Float32Array(pos.count * 3);
    const col = palette[c % 3];
    for (let i = 0; i < pos.count; i++) {
      const by = base[i * 3 + 1];
      const fade = Math.pow(1 - (by + H / 2) / H, 1.6); // bright at top, black at bottom
      colArr[i * 3] = col.r * fade;
      colArr[i * 3 + 1] = col.g * fade;
      colArr[i * 3 + 2] = col.b * fade;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));
    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((c / (curtainCount - 1) - 0.5) * 26 + (rand() - 0.5) * 2, 3.5, -2 - rand() * 8);
    mesh.rotation.y = (rand() - 0.5) * 0.9;
    mesh.rotation.z = (rand() - 0.5) * 0.25;
    scene.add(mesh);
    curtains.push({
      mesh,
      geo,
      base,
      amp: 0.7 + rand() * 0.9,
      k: 1 + Math.floor(rand() * 2),
      ky: ((1 + Math.floor(rand() * 2)) * TAU) / H,
      kx: rand() * 0.35,
      phase: rand() * TAU,
      zamp: 0.4 + rand() * 0.5,
      zphase: rand() * TAU,
      mat,
    });
  }

  camera.position.set(0, 2.5, 15);
  camera.lookAt(0, 4, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (let ci = 0; ci < curtains.length; ci++) {
        const c = curtains[ci];
        const pos = c.geo.getAttribute("position") as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        for (let i = 0; i < pos.count; i++) {
          const by = c.base[i * 3 + 1];
          const bx = c.base[i * 3];
          arr[i * 3] = bx + c.amp * Math.sin(TAU * c.k * p + c.ky * by + c.kx * bx + c.phase);
          arr[i * 3 + 2] = c.zamp * Math.sin(TAU * c.k * p + c.ky * by + c.zphase);
        }
        pos.needsUpdate = true;
        c.mat.opacity = 0.62 + 0.25 * Math.sin(TAU * p + ci * 1.7);
      }
      stars.rotation.y = TAU * p;
      camera.position.x = Math.sin(TAU * p) * 1.2;
      camera.position.y = 2.5 + Math.cos(TAU * p) * 0.3;
      camera.lookAt(0, 4, 0);
    },
    dispose() {
      disposeObject(scene);
    },
  };
}

// ---------- Fireflies ----------
function buildFireflies(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 200);

  const count = 180;
  const cx = new Float32Array(count);
  const cy = new Float32Array(count);
  const cz = new Float32Array(count);
  const ax = new Float32Array(count);
  const ay = new Float32Array(count);
  const az = new Float32Array(count);
  const nx = new Float32Array(count);
  const ny = new Float32Array(count);
  const nz = new Float32Array(count);
  const px = new Float32Array(count);
  const py = new Float32Array(count);
  const pz = new Float32Array(count);
  const pulse = new Float32Array(count);
  const cols = new Float32Array(count * 3);
  const baseCol = new Float32Array(count * 3);

  const cA = new THREE.Color(colors[2]);
  const cB = new THREE.Color(colors[3]);
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    cx[i] = (rand() - 0.5) * 18;
    cy[i] = (rand() - 0.5) * 8;
    cz[i] = (rand() - 0.5) * 10;
    ax[i] = 0.8 + rand() * 1.4;
    ay[i] = 0.4 + rand() * 0.9;
    az[i] = 0.8 + rand() * 1.2;
    nx[i] = 1 + Math.floor(rand() * 3);
    ny[i] = 1 + Math.floor(rand() * 3);
    nz[i] = 1 + Math.floor(rand() * 3);
    px[i] = rand() * TAU;
    py[i] = rand() * TAU;
    pz[i] = rand() * TAU;
    pulse[i] = rand() * TAU;
    tmp.copy(cA).lerp(cB, rand());
    baseCol[i * 3] = tmp.r;
    baseCol[i * 3 + 1] = tmp.g;
    baseCol[i * 3 + 2] = tmp.b;
  }

  // Soft round glow sprite texture
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 64;
  const gctx = glowCanvas.getContext("2d")!;
  const grad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.4)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 64, 64);
  const glowTex = new THREE.CanvasTexture(glowCanvas);

  const positions = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.55,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(geo, mat));

  const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
  const colAttr = geo.getAttribute("color") as THREE.BufferAttribute;

  camera.position.set(0, 0, 12);
  camera.lookAt(0, 0, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3] = cx[i] + ax[i] * Math.sin(TAU * nx[i] * p + px[i]);
        arr[i * 3 + 1] = cy[i] + ay[i] * Math.sin(TAU * ny[i] * p + py[i]);
        arr[i * 3 + 2] = cz[i] + az[i] * Math.sin(TAU * nz[i] * p + pz[i]);
        const b = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(TAU * 2 * p + pulse[i]));
        cols[i * 3] = baseCol[i * 3] * b;
        cols[i * 3 + 1] = baseCol[i * 3 + 1] * b;
        cols[i * 3 + 2] = baseCol[i * 3 + 2] * b;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      camera.position.x = Math.sin(TAU * p) * 0.8;
      camera.position.y = Math.cos(TAU * p) * 0.5;
      camera.lookAt(0, 0, 0);
    },
    dispose() {
      disposeObject(scene);
      glowTex.dispose();
    },
  };
}

// ---------- Snow ----------
function buildSnow(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  scene.fog = new THREE.Fog(new THREE.Color(colors[0]), 8, 30);
  const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 200);

  const count = 900;
  const rangeY = 24;
  const topY = 12;
  const x0 = new Float32Array(count);
  const y0 = new Float32Array(count);
  const z0 = new Float32Array(count);
  const amp = new Float32Array(count);
  const kf = new Float32Array(count);
  const ph = new Float32Array(count);
  const cycles = new Float32Array(count); // integer full falls per loop → seamless wrap

  for (let i = 0; i < count; i++) {
    x0[i] = (rand() - 0.5) * 30;
    y0[i] = rand() * rangeY;
    z0[i] = (rand() - 0.5) * 20;
    amp[i] = 0.3 + rand() * 0.9;
    kf[i] = 1 + Math.floor(rand() * 2);
    ph[i] = rand() * TAU;
    cycles[i] = 1 + Math.floor(rand() * 3);
  }

  const positions = new Float32Array(count * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const flakeColor = new THREE.Color(colors[3]).lerp(new THREE.Color(0xffffff), 0.5);
  scene.add(
    new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: flakeColor, size: 0.075, transparent: true, opacity: 0.9, depthWrite: false, sizeAttenuation: true })
    )
  );

  // Distant moon glow
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext("2d")!;
  const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,0.7)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.18)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  const moon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(colors[3]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8 })
  );
  moon.position.set(-6, 8, -16);
  moon.scale.setScalar(7);
  scene.add(moon);

  const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;

  camera.position.set(0, 2, 14);
  camera.lookAt(0, 1, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (let i = 0; i < count; i++) {
        // Each flake falls an integer number of wrap ranges per loop → seamless.
        arr[i * 3] = x0[i] + amp[i] * Math.sin(TAU * kf[i] * p + ph[i]);
        arr[i * 3 + 1] = topY - ((y0[i] + cycles[i] * rangeY * p) % rangeY);
        arr[i * 3 + 2] = z0[i];
      }
      posAttr.needsUpdate = true;
      camera.position.x = Math.sin(TAU * p) * 0.6;
      camera.lookAt(0, 1, 0);
    },
    dispose() {
      disposeObject(scene);
      glowTex.dispose();
    },
  };
}

// ---------- Code rain ----------
function buildMatrix(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  scene.fog = new THREE.Fog(new THREE.Color(colors[0]), 10, 32);
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);

  const trail = new THREE.Color(colors[2]);
  const head = new THREE.Color(colors[3]).lerp(new THREE.Color(0xffffff), 0.6);
  const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789";

  // 8 glyph-strip textures (bright head row + fading trail), cloned per column
  const baseTex: THREE.CanvasTexture[] = [];
  for (let v = 0; v < 8; v++) {
    const cv = document.createElement("canvas");
    cv.width = 64;
    cv.height = 512;
    const ctx = cv.getContext("2d")!;
    ctx.font = "bold 30px monospace";
    ctx.textAlign = "center";
    for (let r = 0; r < 16; r++) {
      const y = r * 32 + 24;
      if (r === 0) {
        ctx.fillStyle = `rgba(${(head.r * 255) | 0},${(head.g * 255) | 0},${(head.b * 255) | 0},1)`;
      } else {
        const a = Math.pow(1 - r / 16, 1.1) * (0.75 + rand() * 0.25);
        ctx.fillStyle = `rgba(${(trail.r * 255) | 0},${(trail.g * 255) | 0},${(trail.b * 255) | 0},${a.toFixed(2)})`;
      }
      ctx.fillText(CHARS[Math.floor(rand() * CHARS.length)], 32, y);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    baseTex.push(tex);
  }

  type Strip = { mat: THREE.MeshBasicMaterial; m: number };
  const strips: Strip[] = [];
  const colCount = 46;
  const geo = new THREE.PlaneGeometry(1.3, 12);
  for (let i = 0; i < colCount; i++) {
    const tex = baseTex[i % baseTex.length].clone();
    tex.needsUpdate = true;
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.45 + rand() * 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(-16 + (i / (colCount - 1)) * 32 + (rand() - 0.5), 5 - rand() * 2, -3 - rand() * 9);
    scene.add(mesh);
    strips.push({ mat, m: 1 + Math.floor(rand() * 3) });
  }

  camera.position.set(0, 4, 14);
  camera.lookAt(0, 4, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (const s of strips) {
        // Integer offset cycles per loop → seamless scroll.
        s.mat.map!.offset.y = (s.m * p) % 1;
      }
      camera.position.x = Math.sin(TAU * p) * 1.0;
      camera.lookAt(0, 4, 0);
    },
    dispose() {
      disposeObject(scene);
      for (const tex of baseTex) tex.dispose();
    },
  };
}

// ---------- Synth grid ----------
function buildGrid(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  scene.fog = new THREE.Fog(new THREE.Color(colors[0]), 24, 80);
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 200);

  // Neon grid tile; texture scroll races toward the camera.
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const ctx = cv.getContext("2d")!;
  const line = new THREE.Color(colors[2]);
  ctx.strokeStyle = `rgba(${(line.r * 255) | 0},${(line.g * 255) | 0},${(line.b * 255) | 0},1)`;
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, 128, 128);
  const gridTex = new THREE.CanvasTexture(cv);
  gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
  gridTex.repeat.set(24, 24);
  gridTex.colorSpace = THREE.SRGBColorSpace;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 160),
    new THREE.MeshBasicMaterial({ map: gridTex, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Glowing sun on the horizon
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 256;
  const gctx = glowCanvas.getContext("2d")!;
  const sunC = new THREE.Color(colors[3]);
  const midC = new THREE.Color(colors[2]);
  const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, `rgba(${(sunC.r * 255) | 0},${(sunC.g * 255) | 0},${(sunC.b * 255) | 0},0.95)`);
  grad.addColorStop(0.45, `rgba(${(midC.r * 255) | 0},${(midC.g * 255) | 0},${(midC.b * 255) | 0},0.55)`);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 256, 256);
  const sunTex = new THREE.CanvasTexture(glowCanvas);
  const sun = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: sunTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  sun.position.set(0, 3, -70);
  sun.scale.set(34, 34, 1);
  scene.add(sun);

  // Wide horizon haze
  const haze = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: sunTex, color: new THREE.Color(colors[2]), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  haze.position.set(0, 2, -68);
  haze.scale.set(120, 10, 1);
  scene.add(haze);

  camera.position.set(0, 3.2, 12);
  camera.lookAt(0, 2, -20);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      gridTex.offset.y = (2 * p) % 1;
      sun.material.opacity = 0.85 + 0.15 * Math.sin(TAU * p);
      camera.position.x = Math.sin(TAU * p) * 1.2;
      camera.position.y = 3.2 + Math.cos(TAU * p) * 0.25;
      camera.lookAt(0, 2, -20);
    },
    dispose() {
      disposeObject(scene);
      gridTex.dispose();
      sunTex.dispose();
    },
  };
}

// ---------- Rain ----------
function buildRain(rand: () => number, colors: string[], T: number, aspect: number): LiveScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[0]);
  scene.fog = new THREE.Fog(new THREE.Color(colors[0]), 10, 34);
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);

  const count = 650;
  const rangeY = 26;
  const topY = 13;
  const SLANT = -0.22; // wind tilt
  const x0 = new Float32Array(count);
  const y0 = new Float32Array(count);
  const z0 = new Float32Array(count);
  const len = new Float32Array(count);
  const m = new Float32Array(count); // integer wrap cycles per loop → seamless

  for (let i = 0; i < count; i++) {
    x0[i] = (rand() - 0.5) * 38;
    y0[i] = rand() * rangeY;
    z0[i] = (rand() - 0.5) * 22;
    len[i] = 0.7 + rand() * 0.9;
    m[i] = 2 + Math.floor(rand() * 3);
  }

  const positions = new Float32Array(count * 2 * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const rainColor = new THREE.Color(colors[3]).lerp(new THREE.Color(0xffffff), 0.35);
  scene.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: rainColor, transparent: true, opacity: 0.38 })));

  const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
  const arr = posAttr.array as Float32Array;

  camera.position.set(0, 1.5, 13);
  camera.lookAt(0, 3, 0);

  return {
    scene,
    camera,
    update(t: number) {
      const p = (t / T) % 1;
      for (let i = 0; i < count; i++) {
        const y = topY - ((y0[i] + m[i] * rangeY * p) % rangeY);
        arr[i * 6] = x0[i];
        arr[i * 6 + 1] = y;
        arr[i * 6 + 2] = z0[i];
        arr[i * 6 + 3] = x0[i] + SLANT * len[i];
        arr[i * 6 + 4] = y - len[i];
        arr[i * 6 + 5] = z0[i];
      }
      posAttr.needsUpdate = true;
      camera.position.x = Math.sin(TAU * p) * 0.5;
      camera.lookAt(0, 3, 0);
    },
    dispose() {
      disposeObject(scene);
    },
  };
}

// ---------- Factory ----------
export function buildScene(kind: SceneKind, opts: BuildSceneOptions): LiveScene {
  const rand = mulberry32(hashSeed(opts.seed + ":" + kind));
  const aspect = opts.aspect ?? 16 / 9;
  if (kind === "galaxy") return buildGalaxy(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "waves") return buildWaves(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "geometry") return buildGeometryField(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "nebula") return buildNebula(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "globe") return buildGlobe(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "tunnel") return buildTunnel(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "aurora") return buildAurora(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "fireflies") return buildFireflies(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "snow") return buildSnow(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "matrix") return buildMatrix(rand, opts.colors, opts.loopSeconds, aspect);
  if (kind === "grid") return buildGrid(rand, opts.colors, opts.loopSeconds, aspect);
  return buildRain(rand, opts.colors, opts.loopSeconds, aspect);
}
