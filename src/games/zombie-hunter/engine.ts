import * as THREE from "three";

const ARENA = 40;
const EYE_HEIGHT = 1.65;
const PLAYER_RADIUS = 0.45;
const WALK_SPEED = 5.2;
const ADS_SPEED_SCALE = 0.55;
const HIP_FOV = 75;
const ADS_FOV = 42;
/** How quickly the view snaps into and out of aim-down-sights, per second. */
const ADS_RATE = 10;
const LOOK_SENSITIVITY = 0.0022;
const ADS_SENSITIVITY_SCALE = 0.55;
const MAG_SIZE = 30;
const FIRE_RATE = 9;
const RELOAD_TIME = 1.6;
const HIP_SPREAD = 0.035;
const MOVE_SPREAD = 0.025;
const ADS_SPREAD = 0.002;
const BODY_DAMAGE = 34;
const HEAD_DAMAGE = 100;
const HEADSHOT_BONUS = 50;
const MAX_HEALTH = 100;
const REGEN_DELAY = 4;
const REGEN_RATE = 6;
const BEST_KEY = "zombie-hunter-best";

/** Viewmodel offsets from the camera. At ADS the red dot (SIGHT_HEIGHT above the gun origin) sits dead centre. */
const SIGHT_HEIGHT = 0.09;
const HIP_GUN = new THREE.Vector3(0.2, -0.2, -0.42);
const ADS_GUN = new THREE.Vector3(0, -SIGHT_HEIGHT, -0.4);

export type GameState = "title" | "playing" | "paused" | "over";
type ZombieKind = "walker" | "runner" | "brute";

export interface ZombieHunterHud {
  state: GameState;
  health: number;
  ammo: number;
  magSize: number;
  reloading: boolean;
  aiming: boolean;
  wave: number;
  kills: number;
  score: number;
  best: number;
  zombiesLeft: number;
  message: string | null;
}

export interface ZombieHunterResult {
  score: number;
  kills: number;
  wave: number;
}

export interface ZombieHunterOptions {
  onHud: (hud: ZombieHunterHud) => void;
  onHit?: (kind: "body" | "head" | "kill") => void;
  onHurt?: () => void;
  onGameOver?: (result: ZombieHunterResult) => void;
}

export interface ZombieHunterHandle {
  /** Starts a new run (or resumes a paused one). Must be called from a user gesture for pointer lock. */
  start: () => void;
  destroy: () => void;
}

const KINDS: Record<ZombieKind, { hp: number; speed: number; damage: number; scale: number; score: number; skin: number; tunic: number }> = {
  walker: { hp: 100, speed: 1.4, damage: 12, scale: 1.05, score: 100, skin: 0x9cc46a, tunic: 0xd0306a },
  runner: { hp: 60, speed: 3.8, damage: 8, scale: 0.85, score: 150, skin: 0xb2d27a, tunic: 0xe8508a },
  brute: { hp: 380, speed: 1.05, damage: 25, scale: 1.5, score: 400, skin: 0x7fa652, tunic: 0x9c1f52 },
};

interface Zombie {
  kind: ZombieKind;
  group: THREE.Group;
  rig: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  parts: THREE.Mesh[];
  mats: THREE.MeshStandardMaterial[];
  hp: number;
  speed: number;
  damage: number;
  radius: number;
  dying: boolean;
  deadT: number;
  flashT: number;
  attackCd: number;
  phase: number;
  groanT: number;
  /** Which way to sidestep when blocked by an obstacle. */
  side: number;
}

interface Particle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

interface Tracer {
  line: THREE.Line;
  mat: THREE.LineBasicMaterial;
  life: number;
}

interface Barrel {
  light: THREE.PointLight;
  flame: THREE.Mesh;
  seed: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeBest = (value: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage unavailable; the best score just won't persist.
  }
};

function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function createAudio() {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;

  const ensure = () => {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.45;
      master.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") void ctx.resume();
  };

  const envelope = (gain: GainNode, t: number, peak: number, attack: number, decay: number) => {
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  };

  const burst = (type: BiquadFilterType, freq: number, peak: number, decay: number) => {
    if (!ctx || !master || !noise) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    const gain = ctx.createGain();
    envelope(gain, t, peak, 0.002, decay);
    src.connect(filter).connect(gain).connect(master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + decay + 0.05);
  };

  const tone = (type: OscillatorType, from: number, to: number, peak: number, attack: number, decay: number, lowpass?: number) => {
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + attack + decay);
    const gain = ctx.createGain();
    envelope(gain, t, peak, attack, decay);
    let node: AudioNode = osc;
    if (lowpass) {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = lowpass;
      filter.Q.value = 3;
      node = node.connect(filter);
    }
    node.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + attack + decay + 0.05);
  };

  return {
    ensure,
    shot: () => {
      burst("lowpass", 3200, 0.9, 0.16);
      tone("sine", 150, 45, 0.7, 0.002, 0.14);
    },
    dry: () => burst("highpass", 3000, 0.25, 0.03),
    click: () => burst("bandpass", 1800, 0.35, 0.05),
    hit: (head: boolean) => tone("triangle", head ? 1600 : 950, head ? 1400 : 800, 0.18, 0.001, 0.06),
    hurt: () => tone("sawtooth", 110, 50, 0.5, 0.01, 0.3, 600),
    groan: (volume: number) => {
      if (!ctx || !master || volume < 0.02) return;
      const t = ctx.currentTime;
      const base = 55 + Math.random() * 35;
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(base * 1.2, t);
      osc.frequency.linearRampToValueAtTime(base * 0.8, t + 1.3);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 4 + Math.random() * 3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = base * 0.1;
      lfo.connect(lfoGain).connect(osc.frequency);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 420;
      filter.Q.value = 5;
      const gain = ctx.createGain();
      envelope(gain, t, volume, 0.25, 1.1);
      osc.connect(filter).connect(gain).connect(master);
      osc.start(t);
      lfo.start(t);
      osc.stop(t + 1.45);
      lfo.stop(t + 1.45);
    },
    close: () => void ctx?.close(),
  };
}

export function mountZombieHunter(host: HTMLElement, options: ZombieHunterOptions): ZombieHunterHandle {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const skyColor = new THREE.Color(0x0a0f1c);
  scene.background = skyColor;
  scene.fog = new THREE.FogExp2(skyColor, 0.034);

  const camera = new THREE.PerspectiveCamera(HIP_FOV, 1, 0.03, 220);
  camera.rotation.order = "YXZ";
  scene.add(camera);

  const audio = createAudio();

  // ---------- Lighting ----------
  scene.add(new THREE.HemisphereLight(0x5a6a99, 0x1a1408, 0.85));
  const moon = new THREE.DirectionalLight(0x9fb4ff, 1.1);
  moon.position.set(-24, 38, -44);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.left = -46;
  moon.shadow.camera.right = 46;
  moon.shadow.camera.top = 46;
  moon.shadow.camera.bottom = -46;
  moon.shadow.camera.far = 140;
  moon.shadow.bias = -0.0005;
  moon.shadow.normalBias = 0.03;
  scene.add(moon);

  // Flashlight so the fog-shrouded horde is readable up close. It sits past the muzzle so it
  // doesn't blow out the viewmodel, which gets its own soft fill light instead.
  const flashlight = new THREE.SpotLight(0xfff1d6, 60, 34, Math.PI / 7, 0.55, 1.6);
  flashlight.position.set(0.1, -0.05, -1.3);
  const flashTarget = new THREE.Object3D();
  flashTarget.position.set(0, 0, -10);
  const gunFill = new THREE.PointLight(0xc8d2ff, 1.6, 1.5, 2);
  gunFill.position.set(-0.1, 0.25, 0.05);
  camera.add(flashlight, flashTarget, gunFill);
  flashlight.target = flashTarget;

  const muzzleLight = new THREE.PointLight(0xffb34d, 0, 9, 2);
  muzzleLight.position.set(0.2, -0.12, -0.9);
  camera.add(muzzleLight);

  // ---------- Sky ----------
  const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(6, 24, 16), new THREE.MeshBasicMaterial({ color: 0xe4ebff, fog: false }));
  moonMesh.position.set(-70, 80, -130);
  scene.add(moonMesh);
  {
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * 180;
      positions[i * 3 + 1] = Math.cos(phi) * 180;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * 180;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xc8d4ff, size: 1.5, sizeAttenuation: false, fog: false })));
  }

  // ---------- Level ----------
  const boxes: THREE.Box3[] = [];
  const solids: THREE.Object3D[] = [];
  const barrels: Barrel[] = [];
  const rng = mulberry32(1337);

  const groundTex = canvasTexture(256, (g) => {
    g.fillStyle = "#2b3121";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5000; i++) {
      const v = Math.random();
      g.fillStyle = v < 0.45 ? "rgba(18,24,12,0.55)" : v < 0.8 ? "rgba(62,64,40,0.5)" : "rgba(84,72,52,0.45)";
      const s = 1 + Math.random() * 3;
      g.fillRect(Math.random() * 256, Math.random() * 256, s, s);
    }
  });
  groundTex.repeat.set(30, 30);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(ARENA * 3, ARENA * 3),
    new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  solids.push(ground);

  const crateTex = canvasTexture(128, (g) => {
    g.fillStyle = "#6b4a2b";
    g.fillRect(0, 0, 128, 128);
    g.fillStyle = "rgba(0,0,0,0.25)";
    for (let y = 0; y < 128; y += 21) g.fillRect(0, y, 128, 2);
    g.strokeStyle = "#3a2614";
    g.lineWidth = 12;
    g.strokeRect(6, 6, 116, 116);
    g.beginPath();
    g.moveTo(10, 10);
    g.lineTo(118, 118);
    g.stroke();
  });

  const mats = {
    concrete: new THREE.MeshStandardMaterial({ color: 0x55585c, roughness: 0.95 }),
    crate: new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.9 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x6d6f72, roughness: 1 }),
    bark: new THREE.MeshStandardMaterial({ color: 0x2b231c, roughness: 1 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x0d1114, roughness: 0.15, metalness: 0.6 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.9 }),
    rust: new THREE.MeshStandardMaterial({ color: 0x5a3320, roughness: 0.8, metalness: 0.4 }),
    flame: new THREE.MeshBasicMaterial({ color: 0xff8a2a, fog: false, toneMapped: false }),
  };

  const placed: { x: number; z: number; r: number }[] = [];
  /** Finds a spot clear of the spawn area and other props; `sample` returns a candidate [x, z]. */
  const freeSpot = (radius: number, sample: () => [number, number]) => {
    for (let i = 0; i < 60; i++) {
      const [x, z] = sample();
      if (Math.hypot(x, z) < 7 + radius) continue;
      if (placed.every((p) => Math.hypot(p.x - x, p.z - z) > p.r + radius + 1.4)) {
        placed.push({ x, z, r: radius });
        return { x, z };
      }
    }
    return null;
  };
  const anywhere = (): [number, number] => [(rng() * 2 - 1) * (ARENA - 4), (rng() * 2 - 1) * (ARENA - 4)];

  const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  /** Registers props for bullet hits, and optionally for movement collision. Call after the prop is placed. */
  const solidify = (collide: THREE.Object3D[], hittable: THREE.Object3D[] = collide) => {
    for (const obj of collide) {
      obj.updateWorldMatrix(true, false);
      boxes.push(new THREE.Box3().setFromObject(obj));
    }
    solids.push(...hittable);
  };

  // Perimeter walls
  {
    const len = ARENA * 2 + 1.2;
    const geo = new THREE.BoxGeometry(len, 3.4, 0.6);
    for (let i = 0; i < 4; i++) {
      const wall = mesh(geo, mats.concrete, scene, 0, 1.7, 0);
      const side = i % 2 === 0 ? 1 : -1;
      if (i < 2) wall.position.z = side * (ARENA + 0.3);
      else {
        wall.position.x = side * (ARENA + 0.3);
        wall.rotation.y = Math.PI / 2;
      }
      solidify([wall]);
    }
  }

  // Wrecked cars
  const carColors = [0x5a2320, 0x3b4a5a, 0x5c5a3a, 0x444444];
  const bodyGeo = new THREE.BoxGeometry(4.2, 0.75, 1.9);
  const cabinGeo = new THREE.BoxGeometry(2.2, 0.62, 1.72);
  const roofGeo = new THREE.BoxGeometry(2.3, 0.08, 1.8);
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 14).rotateX(Math.PI / 2);
  for (let i = 0; i < 4; i++) {
    const spot = freeSpot(2.6, anywhere);
    if (!spot) continue;
    const car = new THREE.Group();
    car.position.set(spot.x, 0, spot.z);
    car.rotation.y = Math.floor(rng() * 4) * (Math.PI / 2) + (rng() - 0.5) * 0.25;
    scene.add(car);
    const paint = new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length], roughness: 0.7, metalness: 0.3 });
    const body = mesh(bodyGeo, paint, car, 0, 0.68, 0);
    const cabin = mesh(cabinGeo, mats.glass, car, -0.25, 1.36, 0);
    const roof = mesh(roofGeo, paint, car, -0.25, 1.7, 0);
    const wheels = [-1.35, 1.35].flatMap((wx) => [-0.88, 0.88].map((wz) => mesh(wheelGeo, mats.rubber, car, wx, 0.38, wz)));
    car.rotation.z = (rng() - 0.5) * 0.06;
    solidify([body], [body, cabin, roof, ...wheels]);
  }

  // Crate stacks
  const crateGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 11; i++) {
    const spot = freeSpot(1.6, anywhere);
    if (!spot) continue;
    const count = 1 + Math.floor(rng() * 3);
    for (let c = 0; c < count; c++) {
      const s = 1.05 + rng() * 0.3;
      const stacked = c === 2;
      const crate = mesh(crateGeo, mats.crate, scene, spot.x + (stacked ? 0.3 : c * 1.25 - 0.6), stacked ? s * 1.5 : s / 2, spot.z + (rng() - 0.5) * 0.4);
      crate.scale.setScalar(s);
      crate.rotation.y = (rng() - 0.5) * 0.3;
      solidify([crate]);
    }
  }

  // Graveyard in one corner
  const slabGeo = new THREE.BoxGeometry(0.7, 0.9, 0.18);
  const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.18, 16).rotateX(Math.PI / 2);
  const crossGeo = new THREE.BoxGeometry(0.14, 1.3, 0.14);
  const crossBarGeo = new THREE.BoxGeometry(0.6, 0.13, 0.13);
  const graveyard = (): [number, number] => [10 + rng() * 26, -(10 + rng() * 26)];
  for (let i = 0; i < 24; i++) {
    const spot = freeSpot(0.5, graveyard);
    if (!spot) continue;
    const stone = new THREE.Group();
    stone.position.set(spot.x, 0, spot.z);
    stone.rotation.set((rng() - 0.5) * 0.2, (rng() - 0.5) * 0.3, (rng() - 0.5) * 0.2);
    scene.add(stone);
    if (rng() < 0.75) {
      const slab = mesh(slabGeo, mats.stone, stone, 0, 0.45, 0);
      const cap = mesh(capGeo, mats.stone, stone, 0, 0.9, 0);
      solidify([slab], [slab, cap]);
    } else {
      const post = mesh(crossGeo, mats.stone, stone, 0, 0.65, 0);
      const bar = mesh(crossBarGeo, mats.stone, stone, 0, 0.95, 0);
      solidify([post], [post, bar]);
    }
  }

  // Dead trees
  const trunkGeo = new THREE.CylinderGeometry(0.12, 0.26, 4.2, 7);
  const branchGeo = new THREE.CylinderGeometry(0.035, 0.09, 1.7, 5).translate(0, 0.85, 0);
  for (let i = 0; i < 13; i++) {
    const spot = freeSpot(0.6, anywhere);
    if (!spot) continue;
    const tree = new THREE.Group();
    tree.position.set(spot.x, 0, spot.z);
    tree.scale.setScalar(0.85 + rng() * 0.5);
    scene.add(tree);
    const trunk = mesh(trunkGeo, mats.bark, tree, 0, 2.1, 0);
    trunk.rotation.z = (rng() - 0.5) * 0.12;
    const branches = Array.from({ length: 3 + Math.floor(rng() * 3) }, () => {
      const b = mesh(branchGeo, mats.bark, tree, 0, 2 + rng() * 1.8, 0);
      b.rotation.set(0, rng() * Math.PI * 2, (rng() < 0.5 ? -1 : 1) * (0.5 + rng() * 0.6));
      return b;
    });
    solidify([trunk], [trunk, ...branches]);
  }

  // Burning barrels around the centre give warm pools of light to fight in.
  const barrelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.95, 14);
  const flameGeo = new THREE.ConeGeometry(0.26, 0.6, 8);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    const r = 13 + rng() * 4;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    placed.push({ x, z, r: 0.5 });
    const barrel = mesh(barrelGeo, mats.rust, scene, x, 0.475, z);
    const flame = mesh(flameGeo, mats.flame, scene, x, 1.22, z);
    flame.castShadow = false;
    const light = new THREE.PointLight(0xff7a2a, 26, 16, 2);
    light.position.set(x, 1.6, z);
    scene.add(light);
    barrels.push({ light, flame, seed: rng() * 100 });
    solidify([barrel]);
  }

  // ---------- Viewmodel ----------
  const gun = new THREE.Group();
  camera.add(gun);
  {
    const metal = new THREE.MeshStandardMaterial({ color: 0x2c3035, roughness: 0.45, metalness: 0.7 });
    const polymer = new THREE.MeshStandardMaterial({ color: 0x1b1c1e, roughness: 0.8 });
    const tan = new THREE.MeshStandardMaterial({ color: 0x8a7550, roughness: 0.85 });
    const glove = new THREE.MeshStandardMaterial({ color: 0x2f2a22, roughness: 0.95 });
    const sleeve = new THREE.MeshStandardMaterial({ color: 0x3c4630, roughness: 1 });
    const part = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, 0);
      gun.add(m);
      return m;
    };
    part(0.07, 0.08, 0.34, metal, 0, 0, 0); // receiver
    part(0.066, 0.07, 0.26, tan, 0, -0.002, -0.29); // handguard
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.17, 10).rotateX(Math.PI / 2), metal);
    barrel.position.set(0, 0.004, -0.5);
    gun.add(barrel);
    part(0.028, 0.028, 0.05, metal, 0, 0.004, -0.6); // muzzle brake
    part(0.05, 0.085, 0.24, tan, 0, -0.018, 0.28); // stock
    part(0.045, 0.16, 0.07, polymer, 0, -0.1, -0.07, 0.15); // magazine
    part(0.045, 0.11, 0.06, polymer, 0, -0.085, 0.1, -0.3); // grip
    part(0.032, 0.012, 0.32, metal, 0, 0.046, -0.06); // top rail
    // Red-dot sight: a hollow frame with the dot hanging at its centre.
    part(0.046, 0.016, 0.07, metal, 0, 0.058, 0); // mount
    part(0.056, 0.008, 0.05, polymer, 0, SIGHT_HEIGHT + 0.028, 0); // frame top
    part(0.008, 0.06, 0.05, polymer, -0.028, SIGHT_HEIGHT, 0); // frame left
    part(0.008, 0.06, 0.05, polymer, 0.028, SIGHT_HEIGHT, 0); // frame right
    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.048, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x66ffcc, transparent: true, opacity: 0.1, depthWrite: false }),
    );
    lens.position.set(0, SIGHT_HEIGHT, -0.024);
    gun.add(lens);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.0019, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff2a2a, fog: false }));
    dot.position.set(0, SIGHT_HEIGHT, -0.025);
    gun.add(dot);
    // Hands and forearms
    part(0.075, 0.06, 0.12, glove, 0, -0.06, -0.3); // left hand under the handguard
    part(0.08, 0.08, 0.36, sleeve, -0.07, -0.13, -0.13, 0.35, 0.45); // left forearm
    part(0.065, 0.075, 0.085, glove, 0.008, -0.075, 0.09, -0.3); // right hand on the grip
    part(0.085, 0.085, 0.34, sleeve, 0.04, -0.14, 0.27, 0.45, -0.15); // right forearm
  }
  const flashTex = canvasTexture(64, (g) => {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,250,220,1)");
    grad.addColorStop(0.3, "rgba(255,190,80,0.9)");
    grad.addColorStop(1, "rgba(255,120,20,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  });
  const muzzleFlash = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.22),
    new THREE.MeshBasicMaterial({ map: flashTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
  );
  muzzleFlash.position.set(0, 0.004, -0.66);
  muzzleFlash.visible = false;
  gun.add(muzzleFlash);

  // ---------- Effects ----------
  const particleGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
  const bloodMat = new THREE.MeshStandardMaterial({ color: 0x6a0a0a, roughness: 0.6 });
  const dustMat = new THREE.MeshStandardMaterial({ color: 0x8a8070, roughness: 1 });
  const particles: Particle[] = Array.from({ length: 160 }, () => {
    const m = new THREE.Mesh(particleGeo, bloodMat);
    m.visible = false;
    scene.add(m);
    return { mesh: m, vel: new THREE.Vector3(), life: 0, maxLife: 1 };
  });
  let particleCursor = 0;
  const spawnParticles = (point: THREE.Vector3, normal: THREE.Vector3, mat: THREE.Material, count: number, speed: number) => {
    for (let i = 0; i < count; i++) {
      const p = particles[particleCursor];
      particleCursor = (particleCursor + 1) % particles.length;
      p.mesh.material = mat;
      p.mesh.position.copy(point);
      p.mesh.visible = true;
      p.vel
        .copy(normal)
        .multiplyScalar(speed * (0.4 + Math.random()))
        .add(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.8, Math.random() - 0.5).multiplyScalar(speed));
      p.maxLife = p.life = 0.5 + Math.random() * 0.6;
    }
  };

  const tracers: Tracer[] = Array.from({ length: 8 }, () => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const mat = new THREE.LineBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0, fog: false });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    scene.add(line);
    return { line, mat, life: 0 };
  });
  let tracerCursor = 0;

  // ---------- Zombies ----------
  // Invaders are built from a few shared geometries; only the skin and tunic materials are per-zombie
  // so hit flashes don't bleed onto the rest of the horde.
  const squareFrustum = (top: number, bottom: number, height: number) =>
    new THREE.CylinderGeometry(top, bottom, height, 4, 1).rotateY(Math.PI / 4);
  const zGeo = {
    leg: new THREE.BoxGeometry(0.09, 0.72, 0.09).translate(0, -0.36, 0),
    boot: new THREE.BoxGeometry(0.14, 0.12, 0.24),
    tunic: squareFrustum(0.15, 0.34, 0.68),
    stripes: [0.25, 0.5, 0.75].map((f) => squareFrustum(lerp(0.34, 0.15, f) + 0.01, lerp(0.34, 0.15, f) + 0.01, 0.035)),
    collar: squareFrustum(0.06, 0.17, 0.1),
    arm: new THREE.BoxGeometry(0.06, 0.6, 0.06).translate(0, -0.3, 0),
    sleeve: new THREE.BoxGeometry(0.1, 0.24, 0.1),
    hand: new THREE.BoxGeometry(0.11, 0.1, 0.06),
    neck: new THREE.BoxGeometry(0.07, 0.14, 0.07),
    cranium: new THREE.BoxGeometry(0.5, 0.42, 0.5),
    jaw: new THREE.BoxGeometry(0.36, 0.14, 0.34),
    mouth: new THREE.BoxGeometry(0.34, 0.1, 0.3),
    tooth: new THREE.ConeGeometry(0.024, 0.05, 4),
    sphere: new THREE.SphereGeometry(1, 20, 14),
    antenna: new THREE.CylinderGeometry(0.012, 0.012, 0.35, 5).translate(0, 0.175, 0),
  };
  const zMat = {
    black: new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.7 }),
    stripe: new THREE.MeshStandardMaterial({ color: 0x7a1238, roughness: 0.8 }),
    collar: new THREE.MeshStandardMaterial({ color: 0xe07a9a, roughness: 0.8 }),
    mouth: new THREE.MeshBasicMaterial({ color: 0x050205 }),
    tooth: new THREE.MeshStandardMaterial({ color: 0xf4eef2, roughness: 0.5 }),
    eye: new THREE.MeshStandardMaterial({ color: 0xd0246a, emissive: 0x4a0020, roughness: 0.15, metalness: 0.1 }),
    shine: new THREE.MeshBasicMaterial({ color: 0xf5a8c8 }),
    pack: new THREE.MeshStandardMaterial({ color: 0x9a9aa8, roughness: 0.35, metalness: 0.6 }),
    spot: new THREE.MeshStandardMaterial({ color: 0xe0558a, emissive: 0x30000f, roughness: 0.4 }),
  };
  const zombies: Zombie[] = [];
  let hitTargets: THREE.Object3D[] = [];
  let targetsDirty = true;
  let alive = 0;

  const buildZombie = (kind: ZombieKind): Zombie => {
    const spec = KINDS[kind];
    const skinColor = new THREE.Color(spec.skin).offsetHSL((Math.random() - 0.5) * 0.03, 0, (Math.random() - 0.5) * 0.06);
    const skin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.75 });
    const tunic = new THREE.MeshStandardMaterial({ color: spec.tunic, roughness: 0.8 });
    const group = new THREE.Group();
    const rig = new THREE.Group();
    rig.scale.setScalar(spec.scale);
    group.add(rig);
    const blob = (parent: THREE.Object3D, mat: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
      const m = mesh(zGeo.sphere, mat, parent, x, y, z);
      m.scale.set(sx, sy, sz);
      return m;
    };

    // Legs and boots
    const legL = mesh(zGeo.leg, zMat.black, rig, -0.1, 0.72, 0);
    const legR = mesh(zGeo.leg, zMat.black, rig, 0.1, 0.72, 0);
    for (const leg of [legL, legR]) mesh(zGeo.boot, zMat.black, leg, 0, -0.68, 0.05);

    // Striped tunic, collar, and the spotted backpack
    const torso = mesh(zGeo.tunic, tunic, rig, 0, 1.06, 0);
    zGeo.stripes.forEach((g, i) => mesh(g, zMat.stripe, torso, 0, -0.34 + 0.68 * [0.25, 0.5, 0.75][i], 0));
    mesh(zGeo.collar, zMat.collar, rig, 0, 1.43, 0);
    const pack = blob(rig, zMat.pack, 0, 1.15, -0.2, 0.2, 0.24, 0.12);
    blob(rig, zMat.spot, 0, 1.26, -0.31, 0.05, 0.05, 0.02);
    blob(rig, zMat.spot, -0.09, 1.08, -0.29, 0.045, 0.045, 0.02);
    blob(rig, zMat.spot, 0.09, 1.08, -0.29, 0.045, 0.045, 0.02);

    // Skinny arms splayed out wide, with pink sleeves and blocky gloves
    const armL = mesh(zGeo.arm, zMat.black, rig, -0.17, 1.38, 0);
    const armR = mesh(zGeo.arm, zMat.black, rig, 0.17, 1.38, 0);
    armL.rotation.z = -0.55;
    armR.rotation.z = 0.55;
    for (const arm of [armL, armR]) {
      mesh(zGeo.sleeve, zMat.collar, arm, 0, -0.1, 0);
      mesh(zGeo.hand, zMat.black, arm, 0, -0.63, 0);
    }

    // Big head: open, toothy mouth, huge glossy eyes, and antennae swept back
    mesh(zGeo.neck, skin, rig, 0, 1.52, 0);
    const head = mesh(zGeo.cranium, skin, rig, 0, 1.86, 0.04);
    head.rotation.set(-0.12, 0, (Math.random() - 0.5) * 0.3);
    const jaw = mesh(zGeo.jaw, skin, head, 0, -0.32, 0.05);
    mesh(zGeo.mouth, zMat.mouth, head, 0, -0.24, 0.03);
    for (let i = 0; i < 5; i++) {
      const tooth = mesh(zGeo.tooth, zMat.tooth, head, -0.14 + i * 0.07, -0.235, 0.21);
      tooth.rotation.x = Math.PI;
    }
    for (let i = 0; i < 4; i++) mesh(zGeo.tooth, zMat.tooth, jaw, -0.105 + i * 0.07, 0.085, 0.13);
    const eyes = [-1, 1].map((side) => {
      const eye = blob(head, zMat.eye, side * 0.15, 0.05, 0.25, 0.115, 0.155, 0.07);
      eye.rotation.z = side * -0.35;
      blob(head, zMat.shine, side * 0.13, 0.1, 0.315, 0.035, 0.05, 0.01);
      return eye;
    });
    for (const side of [-1, 1]) {
      const stalk = mesh(zGeo.antenna, zMat.black, head, side * 0.11, 0.2, -0.14);
      stalk.rotation.set(-0.7, 0, side * -0.15);
      const tip = mesh(zGeo.antenna, zMat.black, stalk, 0, 0.35, 0);
      tip.rotation.x = -1.5;
    }
    for (const m of [head, jaw, ...eyes]) m.userData.head = true;
    if (kind === "runner") rig.rotation.x = 0.25;

    const z: Zombie = {
      kind,
      group,
      rig,
      legL,
      legR,
      armL,
      armR,
      parts: [legL, legR, torso, pack, armL, armR, head, jaw, ...eyes],
      mats: [skin, tunic],
      hp: spec.hp,
      speed: spec.speed * (kind === "walker" ? Math.min(1.6, 1 + wave * 0.06) : 1) * (0.85 + Math.random() * 0.3),
      damage: spec.damage,
      radius: 0.34 * spec.scale,
      dying: false,
      deadT: 0,
      flashT: 0,
      attackCd: 0.5,
      phase: Math.random() * Math.PI * 2,
      groanT: 1 + Math.random() * 6,
      side: Math.random() < 0.5 ? -1 : 1,
    };
    for (const p of z.parts) p.userData.zombie = z;
    return z;
  };

  const removeZombie = (z: Zombie) => {
    scene.remove(z.group);
    for (const m of z.mats) m.dispose();
    zombies.splice(zombies.indexOf(z), 1);
  };

  // ---------- Collision ----------
  const collide = (p: THREE.Vector3, r: number) => {
    for (const b of boxes) {
      if (b.max.y < 0.3) continue;
      if (p.x + r < b.min.x || p.x - r > b.max.x || p.z + r < b.min.z || p.z - r > b.max.z) continue;
      const cx = clamp(p.x, b.min.x, b.max.x);
      const cz = clamp(p.z, b.min.z, b.max.z);
      const dx = p.x - cx;
      const dz = p.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 > r * r) continue;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        p.x = cx + (dx / d) * r;
        p.z = cz + (dz / d) * r;
      } else {
        // Centre is inside the box: leave by the nearest face.
        const exits = [p.x - b.min.x, b.max.x - p.x, p.z - b.min.z, b.max.z - p.z];
        const m = Math.min(...exits);
        if (m === exits[0]) p.x = b.min.x - r;
        else if (m === exits[1]) p.x = b.max.x + r;
        else if (m === exits[2]) p.z = b.min.z - r;
        else p.z = b.max.z + r;
      }
    }
    p.x = clamp(p.x, -ARENA + r, ARENA - r);
    p.z = clamp(p.z, -ARENA + r, ARENA - r);
  };

  // ---------- Game state ----------
  let state: GameState = "title";
  let pendingReset = false;
  const player = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  let yaw = 0;
  let pitch = 0;
  let health = MAX_HEALTH;
  let lastHurt = -Infinity;
  let ammo = MAG_SIZE;
  let reloadT = 0;
  let fireCd = 0;
  let aimT = 0;
  let recoil = 0;
  let flashT = 0;
  let shake = 0;
  let bobPhase = 0;
  let wave = 0;
  let toSpawn = 0;
  let spawnT = 0;
  let intermission = 0;
  let kills = 0;
  let score = 0;
  let best = readBest();
  let message: string | null = null;
  let messageT = 0;
  let clock = 0;
  const keys = new Set<string>();
  let triggerHeld = false;
  let aimMouse = false;

  const showMessage = (text: string, seconds: number) => {
    message = text;
    messageT = seconds;
  };

  const resetGame = () => {
    while (zombies.length) removeZombie(zombies[0]);
    alive = 0;
    targetsDirty = true;
    for (const p of particles) p.mesh.visible = false;
    player.set(0, 0, 0);
    velocity.set(0, 0, 0);
    yaw = 0;
    pitch = 0;
    health = MAX_HEALTH;
    lastHurt = -Infinity;
    ammo = MAG_SIZE;
    reloadT = 0;
    fireCd = 0;
    aimT = 0;
    recoil = 0;
    wave = 0;
    toSpawn = 0;
    intermission = 2.5;
    kills = 0;
    score = 0;
    showMessage("SURVIVE THE NIGHT", 2.5);
  };

  const startWave = (n: number) => {
    wave = n;
    toSpawn = 4 + n * 3;
    spawnT = 0.5;
    showMessage(`WAVE ${n}`, 2.5);
  };

  const spawnZombie = () => {
    const r = Math.random();
    const kind: ZombieKind =
      wave >= 4 && r < 0.12 ? "brute" : wave >= 2 && r < 0.12 + Math.min(0.35, wave * 0.06) ? "runner" : "walker";
    const z = buildZombie(kind);
    const pos = z.group.position;
    for (let i = 0; i < 25; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 26 + Math.random() * 12;
      pos.set(clamp(Math.cos(a) * d, -ARENA + 2, ARENA - 2), 0, clamp(Math.sin(a) * d, -ARENA + 2, ARENA - 2));
      if (pos.distanceTo(player) > 16) break;
    }
    collide(pos, z.radius);
    scene.add(z.group);
    zombies.push(z);
    alive++;
    targetsDirty = true;
  };

  const gameOver = () => {
    state = "over";
    triggerHeld = false;
    aimMouse = false;
    keys.clear();
    if (score > best) {
      best = score;
      writeBest(best);
    }
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    options.onGameOver?.({ score, kills, wave });
  };

  const hurtPlayer = (amount: number) => {
    health -= amount;
    lastHurt = clock;
    shake = 0.25;
    audio.hurt();
    options.onHurt?.();
    if (health <= 0) {
      health = 0;
      gameOver();
    }
  };

  const startReload = () => {
    if (reloadT > 0 || ammo === MAG_SIZE) return;
    reloadT = RELOAD_TIME;
    audio.click();
  };

  // ---------- Shooting ----------
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const muzzleWorld = new THREE.Vector3();
  const endPoint = new THREE.Vector3();
  const normal = new THREE.Vector3();

  const killZombie = (z: Zombie, headshot: boolean) => {
    z.dying = true;
    z.deadT = 0;
    alive--;
    kills++;
    score += KINDS[z.kind].score + (headshot ? HEADSHOT_BONUS : 0);
    targetsDirty = true;
  };

  const shoot = (moveAmount: number) => {
    ammo--;
    fireCd = 1 / FIRE_RATE;
    recoil = 1;
    flashT = 0.05;
    pitch = clamp(pitch + lerp(0.014, 0.005, aimT), -1.45, 1.45);
    yaw += (Math.random() - 0.5) * lerp(0.008, 0.003, aimT);
    audio.shot();

    const spread = lerp(HIP_SPREAD + moveAmount * MOVE_SPREAD, ADS_SPREAD, aimT);
    camera.updateMatrixWorld();
    camera.getWorldPosition(origin);
    dir
      .set((Math.random() - 0.5) * 2 * spread, (Math.random() - 0.5) * 2 * spread, -1)
      .normalize()
      .applyQuaternion(camera.quaternion);
    raycaster.set(origin, dir);
    raycaster.far = 120;

    if (targetsDirty) {
      hitTargets = [...zombies.filter((z) => !z.dying).flatMap((z) => z.parts), ...solids];
      targetsDirty = false;
    }
    const hit = raycaster.intersectObjects(hitTargets, false)[0];
    if (hit) endPoint.copy(hit.point);
    else endPoint.copy(origin).addScaledVector(dir, 80);

    if (hit) {
      const z = hit.object.userData.zombie as Zombie | undefined;
      normal.copy(dir).negate();
      if (z && !z.dying) {
        const head = Boolean(hit.object.userData.head);
        z.hp -= head ? HEAD_DAMAGE : BODY_DAMAGE;
        z.flashT = 0.08;
        z.group.position.addScaledVector(dir.clone().setY(0).normalize(), z.kind === "brute" ? 0.04 : 0.14);
        spawnParticles(hit.point, normal, bloodMat, head ? 16 : 9, 2.5);
        audio.hit(head);
        if (z.hp <= 0) {
          killZombie(z, head);
          options.onHit?.("kill");
        } else options.onHit?.(head ? "head" : "body");
      } else {
        if (hit.face) normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
        spawnParticles(hit.point, normal, dustMat, 5, 2);
      }
    }

    muzzleFlash.getWorldPosition(muzzleWorld);
    const tracer = tracers[tracerCursor];
    tracerCursor = (tracerCursor + 1) % tracers.length;
    const attr = tracer.line.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.setXYZ(0, muzzleWorld.x, muzzleWorld.y, muzzleWorld.z);
    attr.setXYZ(1, endPoint.x, endPoint.y, endPoint.z);
    attr.needsUpdate = true;
    tracer.life = 0.06;
  };

  // ---------- Input ----------
  const isLocked = () => document.pointerLockElement === canvas;
  const GAME_KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight", "KeyR", "Space"]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (state !== "playing") return;
    if (GAME_KEYS.has(e.code)) e.preventDefault();
    keys.add(e.code);
    if (e.code === "KeyR") startReload();
  };
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
  const onMouseMove = (e: MouseEvent) => {
    if (!isLocked() || state !== "playing") return;
    const sens = LOOK_SENSITIVITY * lerp(1, ADS_SENSITIVITY_SCALE, aimT);
    yaw -= e.movementX * sens;
    pitch = clamp(pitch - e.movementY * sens, -1.45, 1.45);
  };
  const onMouseDown = (e: MouseEvent) => {
    if (!isLocked() || state !== "playing") return;
    if (e.button === 0) triggerHeld = true;
    if (e.button === 2) aimMouse = true;
  };
  const onMouseUp = (e: MouseEvent) => {
    if (e.button === 0) triggerHeld = false;
    if (e.button === 2) aimMouse = false;
  };
  const onContextMenu = (e: Event) => e.preventDefault();
  const releaseInput = () => {
    keys.clear();
    triggerHeld = false;
    aimMouse = false;
  };
  const onLockChange = () => {
    if (isLocked()) {
      if (pendingReset) resetGame();
      pendingReset = false;
      state = "playing";
    } else if (state === "playing") {
      state = "paused";
      releaseInput();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", releaseInput);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("pointerlockchange", onLockChange);
  canvas.addEventListener("contextmenu", onContextMenu);

  const resize = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  // ---------- Simulation ----------
  const updatePlayer = (dt: number) => {
    const ix = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
    const iz = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
    const len = Math.hypot(ix, iz) || 1;
    const speed = WALK_SPEED * lerp(1, ADS_SPEED_SCALE, aimT);
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    const tx = ((cos * ix - sin * iz) / len) * speed;
    const tz = ((-sin * ix - cos * iz) / len) * speed;
    const accel = Math.min(1, dt * 12);
    velocity.x += (tx - velocity.x) * accel;
    velocity.z += (tz - velocity.z) * accel;
    player.x += velocity.x * dt;
    player.z += velocity.z * dt;
    collide(player, PLAYER_RADIUS);

    if (clock - lastHurt > REGEN_DELAY) health = Math.min(MAX_HEALTH, health + REGEN_RATE * dt);

    if (reloadT > 0) {
      reloadT -= dt;
      if (reloadT <= 0) {
        reloadT = 0;
        ammo = MAG_SIZE;
        audio.click();
      }
    }
    fireCd -= dt;
    if (triggerHeld && fireCd <= 0 && reloadT <= 0) {
      if (ammo > 0) shoot(Math.hypot(velocity.x, velocity.z) / WALK_SPEED);
      else {
        audio.dry();
        fireCd = 0.3;
        startReload();
      }
    }
  };

  const updateZombies = (dt: number) => {
    for (let i = zombies.length - 1; i >= 0; i--) {
      const z = zombies[i];
      const pos = z.group.position;
      if (z.dying) {
        z.deadT += dt;
        const fall = Math.min(1, z.deadT / 0.6);
        z.rig.rotation.x = -fall * fall * (Math.PI / 2);
        if (z.deadT > 3) pos.y -= dt * 0.5;
        if (z.deadT > 4.5) removeZombie(z);
        continue;
      }

      if (z.flashT > 0) {
        z.flashT -= dt;
        const glow = z.flashT > 0 ? 0.8 : 0;
        for (const m of z.mats) m.emissive.setRGB(glow, 0, 0);
      }

      const dx = player.x - pos.x;
      const dz = player.z - pos.z;
      const dist = Math.hypot(dx, dz) || 0.001;
      z.group.rotation.y = Math.atan2(dx, dz);
      const reach = PLAYER_RADIUS + z.radius + 0.4;

      if (dist > reach) {
        const step = z.speed * dt;
        const bx = pos.x;
        const bz = pos.z;
        pos.x += (dx / dist) * step;
        pos.z += (dz / dist) * step;
        collide(pos, z.radius);
        // Slide sideways when an obstacle soaks up most of the step.
        if (Math.hypot(pos.x - bx, pos.z - bz) < step * 0.3) {
          pos.x += (-dz / dist) * z.side * step;
          pos.z += (dx / dist) * z.side * step;
          collide(pos, z.radius);
        }
        z.phase += dt * z.speed * 3.4;
        const swing = Math.sin(z.phase) * 0.6;
        z.legL.rotation.x = swing;
        z.legR.rotation.x = -swing;
        z.armL.rotation.x = -Math.PI / 2 + Math.sin(z.phase * 0.5) * 0.15;
        z.armR.rotation.x = -Math.PI / 2 - Math.sin(z.phase * 0.5 + 1) * 0.15;
        pos.y = Math.abs(Math.sin(z.phase)) * 0.05;
        z.attackCd = Math.min(z.attackCd, 0.45);
      } else {
        z.legL.rotation.x *= 0.9;
        z.legR.rotation.x *= 0.9;
        const claw = Math.sin(clock * 12);
        z.armL.rotation.x = -Math.PI / 2 + claw * 0.5;
        z.armR.rotation.x = -Math.PI / 2 - claw * 0.5;
        z.attackCd -= dt;
        if (z.attackCd <= 0) {
          z.attackCd = 1.1;
          hurtPlayer(z.damage);
          if (state !== "playing") return;
        }
      }

      z.groanT -= dt;
      if (z.groanT <= 0) {
        z.groanT = 4 + Math.random() * 7;
        audio.groan(Math.max(0, 1 - dist / 26) * 0.22);
      }
    }

    // Keep the horde from stacking into one blob, and keep the player out of them.
    for (let i = 0; i < zombies.length; i++) {
      const a = zombies[i];
      if (a.dying) continue;
      for (let j = i + 1; j < zombies.length; j++) {
        const b = zombies[j];
        if (b.dying) continue;
        const dx = b.group.position.x - a.group.position.x;
        const dz = b.group.position.z - a.group.position.z;
        const min = a.radius + b.radius;
        const d = Math.hypot(dx, dz);
        if (d > 0.0001 && d < min) {
          const push = (min - d) / 2;
          a.group.position.x -= (dx / d) * push;
          a.group.position.z -= (dz / d) * push;
          b.group.position.x += (dx / d) * push;
          b.group.position.z += (dz / d) * push;
        }
      }
      const dx = player.x - a.group.position.x;
      const dz = player.z - a.group.position.z;
      const min = a.radius + PLAYER_RADIUS;
      const d = Math.hypot(dx, dz);
      if (d > 0.0001 && d < min) {
        player.x += (dx / d) * (min - d);
        player.z += (dz / d) * (min - d);
      }
    }
    collide(player, PLAYER_RADIUS);
  };

  const updateWaves = (dt: number) => {
    if (intermission > 0) {
      intermission -= dt;
      if (intermission <= 0) startWave(wave + 1);
    } else if (toSpawn > 0) {
      spawnT -= dt;
      if (spawnT <= 0 && alive < 8 + wave * 2) {
        spawnZombie();
        toSpawn--;
        spawnT = Math.max(0.4, 1.5 - wave * 0.1);
      }
    } else if (alive === 0) {
      intermission = 5;
      showMessage(`WAVE ${wave} CLEARED`, 3);
    }
  };

  const updateEffects = (dt: number) => {
    for (const p of particles) {
      if (!p.mesh.visible) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        continue;
      }
      p.vel.y -= 12 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.mesh.position.y < 0.03) {
        p.mesh.position.y = 0.03;
        p.vel.multiplyScalar(0.3);
      }
      p.mesh.scale.setScalar(Math.max(0.2, p.life / p.maxLife));
    }
    for (const t of tracers) {
      t.life -= dt;
      t.mat.opacity = Math.max(0, t.life / 0.06) * 0.8;
      t.line.visible = t.life > 0;
    }
    for (const b of barrels) {
      const f = Math.sin(clock * 13 + b.seed) * 0.5 + Math.sin(clock * 7.3 + b.seed * 2) * 0.5;
      b.light.intensity = 24 + f * 6;
      b.flame.scale.set(1 + f * 0.08, 1 + f * 0.2, 1 + f * 0.08);
      b.flame.rotation.y = clock * 2 + b.seed;
    }
    flashT -= dt;
    muzzleFlash.visible = flashT > 0;
    muzzleLight.intensity = flashT > 0 ? 6 : 0;
    if (muzzleFlash.visible) {
      muzzleFlash.rotation.z = Math.random() * Math.PI;
      muzzleFlash.scale.setScalar(0.8 + Math.random() * 0.5);
    }
  };

  const updateView = (dt: number) => {
    const aiming = state === "playing" && (keys.has("ShiftLeft") || keys.has("ShiftRight") || aimMouse) && reloadT <= 0;
    aimT += ((aiming ? 1 : 0) - aimT) * Math.min(1, dt * ADS_RATE);
    camera.fov = lerp(HIP_FOV, ADS_FOV, aimT);
    camera.updateProjectionMatrix();

    const moveAmount = state === "playing" ? Math.min(1, Math.hypot(velocity.x, velocity.z) / WALK_SPEED) : 0;
    bobPhase += dt * 9 * moveAmount;
    const bob = moveAmount * (1 - aimT * 0.85);
    shake = Math.max(0, shake - dt);
    const shakeAmt = shake * 0.12;

    camera.position.set(
      player.x + (Math.random() - 0.5) * shakeAmt,
      EYE_HEIGHT + Math.sin(bobPhase * 2) * 0.035 * bob + (Math.random() - 0.5) * shakeAmt,
      player.z + (Math.random() - 0.5) * shakeAmt,
    );
    camera.rotation.set(pitch, yaw, 0);

    recoil = Math.max(0, recoil - dt * 10);
    const reload = reloadT > 0 ? Math.sin(Math.PI * (1 - reloadT / RELOAD_TIME)) : 0;
    gun.position.lerpVectors(HIP_GUN, ADS_GUN, aimT);
    gun.position.x += Math.sin(bobPhase) * 0.012 * bob;
    gun.position.y += -Math.abs(Math.cos(bobPhase)) * 0.012 * bob - reload * 0.14;
    gun.position.z += recoil * lerp(0.06, 0.022, aimT);
    gun.rotation.set(recoil * lerp(0.16, 0.035, aimT) - reload * 0.6, lerp(0.04, 0, aimT), reload * 0.5);
    gun.visible = state !== "title";
  };

  // ---------- HUD ----------
  let lastHudKey = "";
  const emitHud = () => {
    const hud: ZombieHunterHud = {
      state,
      health: Math.ceil(health),
      ammo,
      magSize: MAG_SIZE,
      reloading: reloadT > 0,
      aiming: aimT > 0.6,
      wave,
      kills,
      score,
      best,
      zombiesLeft: toSpawn + alive,
      message: messageT > 0 ? message : null,
    };
    const key = Object.values(hud).join("|");
    if (key === lastHudKey) return;
    lastHudKey = key;
    options.onHud(hud);
  };

  // ---------- Loop ----------
  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;
    if (state === "playing") {
      messageT -= dt;
      updatePlayer(dt);
      if (state === "playing") updateZombies(dt);
      if (state === "playing") updateWaves(dt);
    } else if (state === "title") {
      yaw += dt * 0.06;
      pitch = 0.04;
    }
    updateEffects(dt);
    updateView(dt);
    renderer.render(scene, camera);
    emitHud();
  };
  raf = requestAnimationFrame(frame);

  return {
    start: () => {
      audio.ensure();
      pendingReset = state === "title" || state === "over";
      const request = canvas.requestPointerLock?.() as Promise<void> | undefined;
      // Browsers refuse a re-lock right after Esc; the player can just click again.
      request?.catch?.(() => {});
    },
    destroy: () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseInput);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("pointerlockchange", onLockChange);
      canvas.removeEventListener("contextmenu", onContextMenu);
      if (isLocked()) document.exitPointerLock();
      while (zombies.length) removeZombie(zombies[0]);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose();
        const material = m.material as THREE.Material | THREE.Material[] | undefined;
        for (const mat of Array.isArray(material) ? material : material ? [material] : []) {
          (mat as THREE.MeshStandardMaterial).map?.dispose();
          mat.dispose();
        }
      });
      Object.values(zGeo).flat().forEach((g) => g.dispose());
      Object.values(zMat).forEach((m) => m.dispose());
      renderer.dispose();
      audio.close();
      canvas.remove();
    },
  };
}
