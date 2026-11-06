"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTickets } from "@/context/TicketContext";

// --- IRKEN AUDIO SYNTHESIZER ---
class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  public init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playHop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(340, t);
      osc.frequency.exponentialRampToValueAtTime(720, t + 0.08);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch {
      // AudioContext unavailable
    }
  }

  playBonk() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

      gain.gain.setValueAtTime(0.32, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch {
      // ignore
    }
  }

  playGirSqueak() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1046, t);
      osc.frequency.linearRampToValueAtTime(2093, t + 0.1);
      osc.frequency.linearRampToValueAtTime(1567, t + 0.2);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // ignore
    }
  }

  playGirYay() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1046, t);
      osc.frequency.linearRampToValueAtTime(1318, t + 0.08);
      osc.frequency.linearRampToValueAtTime(1760, t + 0.16);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch {
      // ignore
    }
  }

  playCrash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(25, t + 0.38);

      gain.gain.setValueAtTime(0.38, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    } catch {
      // ignore
    }
  }

  playAcidSizzle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.45);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    } catch {
      // ignore
    }
  }

  playDoomPulse() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.setValueAtTime(95, t + 0.1);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch {
      // ignore
    }
  }

  playDroneSwoop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.linearRampToValueAtTime(260, t + 0.5);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    } catch {
      // ignore
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 sci-fi Irken march
      const startT = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = startT + i * 0.09;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.26, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {
      // ignore
    }
  }
}

// --- TYPES ---
type LaneType = "YARD" | "HIGHWAY" | "SLUDGE" | "DOOM_TUBE";

interface Vehicle {
  x: number;
  speed: number;
  width: number;
  type: "van" | "voot" | "car" | "truck";
  color: string;
}

interface FloatItem {
  x: number;
  speed: number;
  width: number;
  type: "piggy" | "cupcake" | "waffle";
}

interface TrainData {
  x: number;
  speed: number;
  length: number;
  active: boolean;
  warningTimer: number;
  cooldownTimer: number;
}

interface ObstacleData {
  type: "gnome" | "tree" | "mushroom" | "gir";
}

interface Lane {
  index: number;
  type: LaneType;
  topColor: string;
  sideColor: string;
  obstacles: boolean[];
  obstacleTypes: ObstacleData[];
  vehicles?: Vehicle[];
  floats?: FloatItem[];
  train?: TrainData;
  snackCol?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FloatingText {
  text: string;
  x: number;
  y: number;
  life: number;
  color: string;
}

// --- MINI ACHIEVEMENTS (PERSISTENT EXTRA TICKET REWARDS) ---
export interface AchievementStats {
  treesBonked: number;
  trainHits: number;
  dibVanHits: number;
  girHits: number;
  cupcakesCollected: number;
  piggiesRidden: number;
  sludgeMelts: number;
  maxSingleScore: number;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  statKey: keyof AchievementStats;
  reward: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "hit_tree_10",
    title: "TREE DESTROYER",
    description: "Bonk trees or yard obstacles 10 times",
    icon: "🌲",
    target: 10,
    statKey: "treesBonked",
    reward: 20,
  },
  {
    id: "train_vaporized",
    title: "DOOM TRAIN VICTIM",
    description: "Get vaporized by the Irken Doom Train",
    icon: "🚆",
    target: 1,
    statKey: "trainHits",
    reward: 25,
  },
  {
    id: "gir_squeak_5",
    title: "GIR'S BEST BUDDY",
    description: "Say hi / bump into GIR 5 times",
    icon: "🐶",
    target: 5,
    statKey: "girHits",
    reward: 15,
  },
  {
    id: "dib_van_smash",
    title: "PARANORMAL ROADKILL",
    description: "Get run over by Dib's Science Van",
    icon: "🚐",
    target: 1,
    statKey: "dibVanHits",
    reward: 20,
  },
  {
    id: "cupcake_hoarder_15",
    title: "CUPCAKE ATTACK!",
    description: "Harvest 15 frosted cupcakes",
    icon: "🧁",
    target: 15,
    statKey: "cupcakesCollected",
    reward: 30,
  },
  {
    id: "piggy_rider_10",
    title: "PIGGY NAVIGATOR",
    description: "Ride 10 rubber piggies across sludge",
    icon: "🐷",
    target: 10,
    statKey: "piggiesRidden",
    reward: 20,
  },
  {
    id: "sludge_melt_3",
    title: "TOXIC WASTE DIPPER",
    description: "Melt in toxic sewage sludge 3 times",
    icon: "🧪",
    target: 3,
    statKey: "sludgeMelts",
    reward: 15,
  },
  {
    id: "conquer_25_streets",
    title: "ALMIGHTY INVADER",
    description: "Conquer 25 streets in a single run",
    icon: "👽",
    target: 25,
    statKey: "maxSingleScore",
    reward: 35,
  },
];

export default function CrossyRoadClient() {
  const router = useRouter();
  const { tickets, addTickets } = useTickets();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const soundEngine = useRef<RetroSoundEngine | null>(null);
  const zimImgRef = useRef<HTMLImageElement | null>(null);

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });
  const [gameState, setGameState] = useState<"PLAYING" | "GAMEOVER">("PLAYING");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("retro_arcade_zim_highscore");
        if (saved) return parseInt(saved, 10) || 0;
      } catch {
        // ignore
      }
    }
    return 0;
  });
  const [coins, setCoins] = useState(0);
  const [ticketsEarned, setTicketsEarned] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [deathReason, setDeathReason] = useState<string>("");
  const [soundMuted, setSoundMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sizing refs
  const cellWRef = useRef(56);
  const cellHRef = useRef(50);
  const colsRef = useRef(15);

  // Touch tracking for swipes
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Game references
  const lanesRef = useRef<Map<number, Lane>>(new Map());
  const playerRef = useRef({
    col: 7,
    row: 0,
    targetCol: 7,
    targetRow: 0,
    facing: "UP" as "UP" | "DOWN" | "LEFT" | "RIGHT",
    isHopping: false,
    hopProgress: 0,
    dead: false,
    bonkShake: 0,
    bonkDirX: 0,
    bonkDirY: 0,
  });
  const cameraYRef = useRef(0);
  const maxRowReachedRef = useRef(0);
  const coinsCollectedRef = useRef(0);
  const idleTimerRef = useRef(0);
  const autoScrollActiveRef = useRef(false);
  const graceTimerRef = useRef(0);
  const droneStateRef = useRef({ active: false, y: -5 });
  const particlesRef = useRef<Particle[]>([]);
  const floatTextsRef = useRef<FloatingText[]>([]);
  const lastFloatLaneRef = useRef<number | null>(null);

  // --- PERSISTENT MINI ACHIEVEMENTS ---
  const [showMissions, setShowMissions] = useState(false);
  const [toastMission, setToastMission] = useState<{ title: string; reward: number; icon: string } | null>(null);

  const [achievementStats, setAchievementStats] = useState<AchievementStats>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("retro_arcade_zim_stats_v1");
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      treesBonked: 0,
      trainHits: 0,
      dibVanHits: 0,
      girHits: 0,
      cupcakesCollected: 0,
      piggiesRidden: 0,
      sludgeMelts: 0,
      maxSingleScore: 0,
    };
  });

  const [claimedAchievements, setClaimedAchievements] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("retro_arcade_zim_claimed_achievements_v1");
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {};
  });

  const achievementStatsRef = useRef(achievementStats);
  const claimedAchievementsRef = useRef(claimedAchievements);

  useEffect(() => {
    achievementStatsRef.current = achievementStats;
  }, [achievementStats]);

  useEffect(() => {
    claimedAchievementsRef.current = claimedAchievements;
  }, [claimedAchievements]);

  // Sound Engine & Character Sprite Setup
  useEffect(() => {
    soundEngine.current = new RetroSoundEngine();
    const img = new Image();
    img.src = "/zim-clean.png";
    img.onload = () => {
      zimImgRef.current = img;
    };
  }, []);

  const toggleSound = useCallback(() => {
    if (soundEngine.current) {
      soundEngine.current.enabled = !soundEngine.current.enabled;
      setSoundMuted(!soundEngine.current.enabled);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Resize Handler for Fullscreen Edge-to-Edge
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });

      const targetColWidth = Math.max(48, Math.min(68, Math.floor(w / 16)));
      const cols = Math.max(9, Math.floor(w / targetColWidth));
      const cellW = w / cols;
      const cellH = Math.max(44, Math.min(56, Math.floor(h / 14)));

      colsRef.current = cols;
      cellWRef.current = cellW;
      cellHRef.current = cellH;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Particle helper
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number, speed: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * speed + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.45,
        color,
        size: Math.random() * 5 + 3,
      });
    }
  }, []);

  // Record Achievement Progress (Persists to localStorage & Awards Tickets)
  const recordAchievementProgress = useCallback(
    (key: keyof AchievementStats, amount: number = 1, isAbsolute: boolean = false) => {
      const currentStats = achievementStatsRef.current;
      const currentClaimed = claimedAchievementsRef.current;

      const nextVal = isAbsolute ? Math.max(currentStats[key], amount) : currentStats[key] + amount;
      if (nextVal === currentStats[key]) return;

      const nextStats = { ...currentStats, [key]: nextVal };
      achievementStatsRef.current = nextStats;
      setAchievementStats(nextStats);

      try {
        localStorage.setItem("retro_arcade_zim_stats_v1", JSON.stringify(nextStats));
      } catch {
        // ignore
      }

      // Check newly unlocked achievements
      ACHIEVEMENTS.forEach((ach) => {
        if (!currentClaimed[ach.id]) {
          const val = nextStats[ach.statKey];
          if (val >= ach.target) {
            const nextClaimed = { ...claimedAchievementsRef.current, [ach.id]: true };
            claimedAchievementsRef.current = nextClaimed;
            setClaimedAchievements(nextClaimed);
            try {
              localStorage.setItem("retro_arcade_zim_claimed_achievements_v1", JSON.stringify(nextClaimed));
            } catch {
              // ignore
            }

            // Award extra tickets directly to Arcade Ticket Vault
            addTickets(ach.reward);
            soundEngine.current?.playFanfare();

            // Set toast popup
            setToastMission({ title: ach.title, reward: ach.reward, icon: ach.icon });

            // Spawn celebration particle burst
            const curCol = playerRef.current.col;
            const curRow = playerRef.current.row;
            const px = curCol * cellWRef.current + cellWRef.current / 2;
            const py = dimensions.height - (curRow - cameraYRef.current + 1) * cellHRef.current;
            spawnParticles(px, py, "#ffee58", 24, 6);
            spawnParticles(px, py, "#76ff03", 18, 5);
            spawnParticles(px, py, "#ff007f", 18, 5);

            floatTextsRef.current.push({
              text: `🏆 ${ach.title}! +${ach.reward}🎟️`,
              x: px,
              y: py - 25,
              life: 0,
              color: "#ffee58",
            });
          }
        }
      });
    },
    [addTickets, dimensions.height, spawnParticles]
  );

  useEffect(() => {
    if (toastMission) {
      const timer = setTimeout(() => setToastMission(null), 3600);
      return () => clearTimeout(timer);
    }
  }, [toastMission]);

  // Lane Generator Helper with Invader Zim Themes
  const generateLane = useCallback((rowIndex: number, totalCols: number): Lane => {
    const cycle = Math.abs(rowIndex) % 14;
    let type: LaneType = "YARD";
    if (rowIndex <= 2) {
      type = "YARD";
    } else if (cycle === 0 || cycle === 5 || cycle === 10) {
      type = "YARD";
    } else if (cycle === 4 || cycle === 9) {
      type = "DOOM_TUBE";
    } else if (cycle >= 6 && cycle <= 8) {
      type = "SLUDGE";
    } else {
      type = "HIGHWAY";
    }

    // Irken Color Palette
    let topColor = "#12081f";
    let sideColor = "#0a0412";
    if (type === "YARD") {
      topColor = rowIndex % 2 === 0 ? "#1f0f2b" : "#29153a"; // Eerie Gothic Alien Turf
      sideColor = "#12071a";
    } else if (type === "HIGHWAY") {
      topColor = rowIndex % 2 === 0 ? "#13141d" : "#1a1b26"; // Polluted Earth Highway
      sideColor = "#0b0c12";
    } else if (type === "SLUDGE") {
      topColor = rowIndex % 2 === 0 ? "#00e676" : "#00c853"; // Radioactive Toxic Slime
      sideColor = "#00701a";
    } else if (type === "DOOM_TUBE") {
      topColor = "#3c096c"; // Irken High-Speed Tube Conduit
      sideColor = "#240046";
    }

    // Obstacles Generation (Gnomes, Gothic Dead Trees, Mutated Mushrooms, GIR in Dog Suit)
    const obstacles = Array(totalCols).fill(false);
    const obstacleTypes: ObstacleData[] = [];
    for (let c = 0; c < totalCols; c++) {
      const rand = Math.random();
      const obsType: "gnome" | "tree" | "mushroom" | "gir" =
        rand < 0.28 ? "gnome" : rand < 0.58 ? "tree" : rand < 0.82 ? "mushroom" : "gir";
      obstacleTypes.push({ type: obsType });
    }

    if (type === "YARD") {
      obstacles[0] = true;
      obstacles[totalCols - 1] = true;

      for (let c = 1; c < totalCols - 1; c++) {
        if (Math.random() < 0.4) {
          obstacles[c] = true;
        }
      }

      if (rowIndex <= 2) {
        const mid = Math.floor(totalCols / 2);
        obstacles[mid - 1] = false;
        obstacles[mid] = false;
        obstacles[mid + 1] = false;
      } else {
        let hasOpenPath = false;
        for (let c = 1; c < totalCols - 2; c++) {
          if (!obstacles[c] && !obstacles[c + 1]) {
            hasOpenPath = true;
            break;
          }
        }
        if (!hasOpenPath) {
          const openCol = 1 + Math.floor(Math.random() * (totalCols - 3));
          obstacles[openCol] = false;
          obstacles[openCol + 1] = false;
        }
      }
    }

    // Vehicles (Dib's Van, Voot Cruiser, Smog Clunkers)
    let vehicles: Vehicle[] | undefined = undefined;
    if (type === "HIGHWAY") {
      const direction = rowIndex % 2 === 0 ? 1 : -1;
      const baseSpeed = (2.2 + Math.random() * 1.8) * direction;
      const carCount = Math.max(2, Math.floor(totalCols / 4.5));
      vehicles = [];
      const colors = ["#ff007f", "#76ff03", "#00f0ff", "#ffeb3b", "#9c27b0", "#ffffff"];
      const spacing = (totalCols + 4) / carCount;

      for (let i = 0; i < carCount; i++) {
        const rand = Math.random();
        const isDibVan = rand < 0.3;
        const isVoot = !isDibVan && rand < 0.55;
        const isTruck = !isDibVan && !isVoot && rand < 0.75;
        const vType = isDibVan ? "van" : isVoot ? "voot" : isTruck ? "truck" : "car";

        vehicles.push({
          x: i * spacing + (Math.random() * 0.4 - 0.2),
          speed: isVoot ? baseSpeed * 1.5 : isDibVan ? baseSpeed * 1.1 : isTruck ? baseSpeed * 0.8 : baseSpeed,
          width: isTruck ? 2.5 : isDibVan ? 2.0 : isVoot ? 1.6 : 1.5,
          type: vType,
          color: isDibVan ? "#212121" : isVoot ? "#e91e63" : colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    // Floats in Toxic Sludge (GIR's Rubber Piggies 🐷, Giant Cupcakes 🧁, Waffles 🧇)
    let floats: FloatItem[] | undefined = undefined;
    if (type === "SLUDGE") {
      const direction = rowIndex % 2 === 0 ? 1 : -1;
      const baseSpeed = (1.5 + Math.random() * 1.4) * direction;
      const floatCount = Math.max(2, Math.floor(totalCols / 3.8));
      floats = [];
      const spacing = (totalCols + 5) / floatCount;

      for (let i = 0; i < floatCount; i++) {
        const fRand = Math.random();
        const fType = fRand < 0.4 ? "piggy" : fRand < 0.7 ? "cupcake" : "waffle";
        const fWidth = fType === "piggy" ? 2.2 : fType === "cupcake" ? 2.0 : 2.4;

        floats.push({
          x: i * spacing - 2,
          speed: baseSpeed,
          width: fWidth,
          type: fType,
        });
      }
    }

    // The High-Speed Irken Doom Express Train
    let train: TrainData | undefined = undefined;
    if (type === "DOOM_TUBE") {
      train = {
        x: -totalCols - 6,
        speed: 25,
        length: Math.max(10, Math.floor(totalCols * 0.85)),
        active: false,
        warningTimer: 0,
        cooldownTimer: 3.2 + Math.random() * 4.0,
      };
    }

    // Earth Snacks (Cupcakes / Waffles)
    let snackCol: number | undefined = undefined;
    if (Math.random() < 0.32) {
      const candidateCols = [];
      for (let c = 0; c < totalCols; c++) {
        if (!obstacles[c] && type !== "SLUDGE") {
          candidateCols.push(c);
        }
      }
      if (candidateCols.length > 0) {
        snackCol = candidateCols[Math.floor(Math.random() * candidateCols.length)];
      }
    }

    return {
      index: rowIndex,
      type,
      topColor,
      sideColor,
      obstacles,
      obstacleTypes,
      vehicles,
      floats,
      train,
      snackCol,
    };
  }, []);

  const ensureLanes = useCallback(
    (toRow: number) => {
      const lanes = lanesRef.current;
      const minRow = Math.max(0, toRow - 5);
      const maxRow = toRow + 20;
      const totalCols = colsRef.current;

      for (const key of Array.from(lanes.keys())) {
        if (key < minRow - 8) {
          lanes.delete(key);
        }
      }

      for (let r = minRow; r <= maxRow; r++) {
        if (!lanes.has(r)) {
          lanes.set(r, generateLane(r, totalCols));
        }
      }
    },
    [generateLane]
  );

  useEffect(() => {
    ensureLanes(0);
  }, [ensureLanes]);

  // Restart / Init Game
  const startGame = useCallback(() => {
    lanesRef.current.clear();
    const mid = Math.floor(colsRef.current / 2);
    playerRef.current = {
      col: mid,
      row: 0,
      targetCol: mid,
      targetRow: 0,
      facing: "UP",
      isHopping: false,
      hopProgress: 0,
      dead: false,
      bonkShake: 0,
      bonkDirX: 0,
      bonkDirY: 0,
    };
    cameraYRef.current = 0;
    autoScrollActiveRef.current = false;
    graceTimerRef.current = 0;
    maxRowReachedRef.current = 0;
    coinsCollectedRef.current = 0;
    idleTimerRef.current = 0;
    droneStateRef.current = { active: false, y: -5 };
    particlesRef.current = [];
    floatTextsRef.current = [];

    ensureLanes(0);
    setScore(0);
    setCoins(0);
    setTicketsEarned(0);
    setIsNewHighScore(false);
    setDeathReason("");
    setGameState("PLAYING");
    soundEngine.current?.init();
  }, [ensureLanes]);

  // Handle Game Over
  const triggerGameOver = useCallback(
    (reason: string) => {
      if (playerRef.current.dead) return;
      playerRef.current.dead = true;
      setGameState("GAMEOVER");
      setDeathReason(reason);

      const finalScore = maxRowReachedRef.current;
      const finalCoins = coinsCollectedRef.current;
      const earned = Math.max(5, Math.floor(finalScore / 5) + finalCoins);
      setTicketsEarned(earned);

      addTickets(earned);
      soundEngine.current?.playFanfare();

      setHighScore((prev) => {
        const isNew = finalScore > prev;
        setIsNewHighScore(isNew);
        const nextHigh = Math.max(prev, finalScore);
        try {
          localStorage.setItem("retro_arcade_zim_highscore", nextHigh.toString());
        } catch {
          // ignore
        }
        return nextHigh;
      });
    },
    [addTickets]
  );

  // Trigger Movement with Tree / Gnome Bonk Response
  const movePlayer = useCallback(
    (dCol: number, dRow: number) => {
      soundEngine.current?.init();

      if (gameState === "GAMEOVER") {
        startGame();
        return;
      }

      const player = playerRef.current;
      if (player.isHopping || player.dead) return;

      const totalCols = colsRef.current;
      const cellW = cellWRef.current;
      const cellH = cellHRef.current;
      const viewH = dimensions.height;

      const newCol = Math.max(0, Math.min(totalCols - 1, player.col + dCol));
      const newRow = Math.max(Math.floor(cameraYRef.current), player.row + dRow);

      if (dRow > 0) {
        player.facing = "UP";
        autoScrollActiveRef.current = true;
      } else if (dRow < 0) {
        player.facing = "DOWN";
      } else if (dCol > 0) {
        player.facing = "RIGHT";
      } else if (dCol < 0) {
        player.facing = "LEFT";
      }

      // Cannot retreat off the bottom edge of the advancing screen!
      const minAllowedRow = Math.max(0, Math.floor(cameraYRef.current - 0.2));
      if (dRow < 0 && player.row <= minAllowedRow) {
        soundEngine.current?.playBonk();
        player.bonkShake = 0.14;
        player.bonkDirX = 0;
        player.bonkDirY = -1;
        return;
      }

      // Collision with Yard Obstacles
      ensureLanes(newRow);
      const targetLane = lanesRef.current.get(newRow);
      if (targetLane && targetLane.type === "YARD" && targetLane.obstacles[newCol]) {
        const obsType = targetLane.obstacleTypes[newCol]?.type;
        const obsX = newCol * cellW + cellW / 2;
        const obsY = viewH - (newRow - cameraYRef.current + 1) * cellH;

        if (obsType === "gir") {
          recordAchievementProgress("girHits", 1);
          soundEngine.current?.playGirYay();
          const girBounceQuotes = [
            "GIR: 'HI MASTER!'",
            "GIR: 'I MADE IT MYSELF!'",
            "GIR: 'I LIKE CHOCOLATE!'",
            "GIR: 'PIGGY! 🐷'",
            "GIR: 'YAAAY!'",
          ];
          const quote = girBounceQuotes[Math.floor(Math.random() * girBounceQuotes.length)];
          floatTextsRef.current.push({
            text: quote,
            x: obsX,
            y: obsY - 14,
            life: 0,
            color: "#76ff03",
          });
        } else {
          recordAchievementProgress("treesBonked", 1);
          soundEngine.current?.playBonk();
        }

        player.bonkShake = 0.16;
        player.bonkDirX = dCol;
        player.bonkDirY = dRow;

        spawnParticles(obsX, obsY + cellH / 2, "#ff007f", 10, 3.5);
        spawnParticles(obsX, obsY + cellH / 2, "#76ff03", 8, 2.5);
        return;
      }

      player.targetCol = newCol;
      player.targetRow = newRow;
      player.isHopping = true;
      player.hopProgress = 0;

      if (newRow > player.row) {
        idleTimerRef.current = 0;
      }

      soundEngine.current?.playHop();
    },
    [gameState, startGame, ensureLanes, dimensions.height, spawnParticles, recordAchievementProgress]
  );

  // 60FPS Fullscreen Render Loop
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(0.08, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) {
        animationId = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationId = requestAnimationFrame(loop);
        return;
      }

      const viewW = dimensions.width;
      const viewH = dimensions.height;
      const cellW = cellWRef.current;
      const cellH = cellHRef.current;
      const totalCols = colsRef.current;

      const player = playerRef.current;

      if (player.bonkShake > 0) {
        player.bonkShake = Math.max(0, player.bonkShake - dt);
      }

      // 1. UPDATE GAME STATE
      ensureLanes(Math.max(player.row, Math.floor(cameraYRef.current)));

      // Hopping Animation
      if (player.isHopping) {
        player.hopProgress += dt * 9.8;
        if (player.hopProgress >= 1) {
          player.hopProgress = 1;
          player.col = player.targetCol;
          player.row = player.targetRow;
          player.isHopping = false;

          const px = player.col * cellW + cellW / 2;
          const py = viewH - (player.row - cameraYRef.current + 1) * cellH + cellH / 2;
          spawnParticles(px, py + 14, "#ff007f", 6, 2.5);
          spawnParticles(px, py + 14, "#76ff03", 4, 2.0);

          if (player.row > maxRowReachedRef.current) {
            maxRowReachedRef.current = player.row;
            setScore(player.row);
            recordAchievementProgress("maxSingleScore", player.row, true);
          }

          // Snack pickup (Cupcake / Waffle)
          const currentLane = lanesRef.current.get(player.row);
          if (currentLane && currentLane.snackCol === player.col) {
            currentLane.snackCol = undefined;
            coinsCollectedRef.current += 1;
            setCoins(coinsCollectedRef.current);
            recordAchievementProgress("cupcakesCollected", 1);
            soundEngine.current?.playGirSqueak();

            spawnParticles(px, py, "#ff007f", 16, 5);
            spawnParticles(px, py, "#76ff03", 10, 4);
            const cupcakeQuotes = [
              "🧁 +1 CUPCAKE! YAY!",
              "🧁 I MADE IT MYSELF!",
              "🧁 CUPCAKE ATTACK!",
              "🧁 THE FROSTING!",
              "🌮 TACO TIME!",
              "🧇 WAFFLES!",
              "🐷 RUBBER PIGGY!",
            ];
            const chosenQuote = cupcakeQuotes[Math.floor(Math.random() * cupcakeQuotes.length)];
            floatTextsRef.current.push({
              text: chosenQuote,
              x: px,
              y: py - 15,
              life: 0,
              color: "#ff007f",
            });
          }
        }
      }

      // Camera Follow & Screen Auto-Advance (Crossy Road Mechanics)
      if (gameState === "PLAYING") {
        if (!autoScrollActiveRef.current) {
          graceTimerRef.current += dt;
          if (player.row > 0 || graceTimerRef.current > 1.8) {
            autoScrollActiveRef.current = true;
          }
        }

        if (autoScrollActiveRef.current) {
          // Slow steady auto-advance upwards
          const creepSpeed = 0.85 + Math.min(maxRowReachedRef.current * 0.008, 0.75);
          cameraYRef.current += creepSpeed * dt;
        }

        // Camera smoothly follows player when they push ahead
        const targetCamY = Math.max(0, player.row - 3.5);
        if (targetCamY > cameraYRef.current) {
          cameraYRef.current += (targetCamY - cameraYRef.current) * (dt * 5.5);
        }

        // Check if player is overtaken by the bottom of the advancing screen!
        const curPRow = player.isHopping
          ? player.row + (player.targetRow - player.row) * player.hopProgress
          : player.row;

        if (!player.dead && curPRow < cameraYRef.current - 0.42) {
          const curPCol = player.isHopping
            ? player.col + (player.targetCol - player.col) * player.hopProgress
            : player.col;
          const px = curPCol * cellW + cellW / 2;
          const py = viewH - (curPRow - cameraYRef.current + 1) * cellH + cellH / 2;

          soundEngine.current?.playCrash();
          spawnParticles(px, Math.min(viewH - 10, py), "#76ff03", 26, 6);
          spawnParticles(px, Math.min(viewH - 10, py), "#ff007f", 20, 5);
          triggerGameOver("CONSUMED BY THE ADVANCING SCREEN OF DOOM!");
        }

        // Dib's Drone Inaction Timer
        idleTimerRef.current += dt;
        if (idleTimerRef.current > 6.5 && !droneStateRef.current.active) {
          droneStateRef.current.active = true;
          droneStateRef.current.y = player.row + 9;
          soundEngine.current?.playDroneSwoop();
        }

        if (droneStateRef.current.active) {
          droneStateRef.current.y -= dt * 16;
          if (droneStateRef.current.y <= player.row + 0.3 && !player.dead) {
            triggerGameOver("CAPTURED BY DIB'S PARANORMAL DRONE!");
            soundEngine.current?.playCrash();
          }
        }
      }

      // Update Lanes (Traffic, Sludge Floats, Irken Express)
      const lanes = lanesRef.current;
      for (const lane of Array.from(lanes.values())) {
        // Highway Vehicles
        if (lane.type === "HIGHWAY" && lane.vehicles) {
          for (const v of lane.vehicles) {
            v.x += v.speed * dt;
            if (v.speed > 0 && v.x > totalCols + 2) v.x = -v.width - 1;
            if (v.speed < 0 && v.x < -v.width - 2) v.x = totalCols + 1;

            if (gameState === "PLAYING" && !player.dead) {
              const curPRow = player.isHopping
                ? player.row + (player.targetRow - player.row) * player.hopProgress
                : player.row;
              const curPCol = player.isHopping
                ? player.col + (player.targetCol - player.col) * player.hopProgress
                : player.col;

              if (Math.abs(curPRow - lane.index) < 0.45) {
                const vLeft = v.x;
                const vRight = v.x + v.width;
                const pLeft = curPCol + 0.2;
                const pRight = curPCol + 0.8;
                if (pRight > vLeft && pLeft < vRight) {
                  soundEngine.current?.playCrash();
                  const px = curPCol * cellW + cellW / 2;
                  const py = viewH - (curPRow - cameraYRef.current + 1) * cellH + cellH / 2;
                  spawnParticles(px, py, "#76ff03", 22, 6);
                  spawnParticles(px, py, "#ff007f", 16, 5);
                  spawnParticles(px, py, "#111111", 12, 4);

                  let crashReason = "FLATTENED BY INFERIOR HUMAN VEHICLE!";
                  if (v.type === "van") {
                    recordAchievementProgress("dibVanHits", 1);
                    crashReason = "OBLITERATED BY DIB'S SCIENCE VAN!";
                  } else if (v.type === "voot") {
                    crashReason = "HIT BY ROGUE VOOT CRUISER!";
                  } else if (v.type === "truck") {
                    crashReason = "MOWED DOWN BY A HUMAN SEMI TRUCK!";
                  }
                  triggerGameOver(crashReason);
                }
              }
            }
          }
        }

        // Sludge Floats (Rubber Piggies, Cupcakes, Waffles)
        if (lane.type === "SLUDGE" && lane.floats) {
          for (const f of lane.floats) {
            f.x += f.speed * dt;
            if (f.speed > 0 && f.x > totalCols + 3) f.x = -f.width - 1;
            if (f.speed < 0 && f.x < -f.width - 3) f.x = totalCols + 2;
          }

          if (gameState === "PLAYING" && !player.dead && player.row === lane.index && !player.isHopping) {
            let onFloat: FloatItem | null = null;
            for (const f of lane.floats) {
              if (player.col + 0.5 >= f.x && player.col + 0.5 <= f.x + f.width) {
                onFloat = f;
                break;
              }
            }

            if (onFloat) {
              if (onFloat.type === "piggy" && lastFloatLaneRef.current !== lane.index) {
                lastFloatLaneRef.current = lane.index;
                recordAchievementProgress("piggiesRidden", 1);
              }
              player.col += onFloat.speed * dt;
              player.targetCol = player.col;
              if (player.col < -0.5 || player.col > totalCols - 0.5) {
                soundEngine.current?.playAcidSizzle();
                triggerGameOver("SWEPT AWAY IN TOXIC SEWAGE RAPIDS!");
              }
            } else {
              recordAchievementProgress("sludgeMelts", 1);
              soundEngine.current?.playAcidSizzle();
              const px = player.col * cellW + cellW / 2;
              const py = viewH - (player.row - cameraYRef.current + 1) * cellH + cellH / 2;
              spawnParticles(px, py, "#76ff03", 24, 6);
              spawnParticles(px, py, "#ff007f", 14, 4);
              triggerGameOver("MELTED BY FILTHY TOXIC SLUDGE!");
            }
          }
        }

        // Irken Doom Express Train
        if (lane.type === "DOOM_TUBE" && lane.train) {
          const tr = lane.train;
          if (!tr.active) {
            tr.cooldownTimer -= dt;
            if (tr.cooldownTimer <= 1.4 && tr.cooldownTimer > 0) {
              tr.warningTimer += dt;
              if (Math.floor(tr.warningTimer * 8) % 2 === 0) {
                soundEngine.current?.playDoomPulse();
              }
            }
            if (tr.cooldownTimer <= 0) {
              tr.active = true;
              tr.x = -tr.length - 2;
            }
          } else {
            tr.x += tr.speed * dt;
            if (gameState === "PLAYING" && !player.dead && Math.abs(player.row - lane.index) < 0.45) {
              if (player.col >= tr.x - 0.5 && player.col <= tr.x + tr.length + 0.5) {
                recordAchievementProgress("trainHits", 1);
                soundEngine.current?.playCrash();
                const px = player.col * cellW + cellW / 2;
                const py = viewH - (player.row - cameraYRef.current + 1) * cellH + cellH / 2;
                spawnParticles(px, py, "#76ff03", 26, 7);
                spawnParticles(px, py, "#ff007f", 20, 5);
                triggerGameOver("VAPORIZED BY THE IRKEN DOOM TRAIN!");
              }
            }
            if (tr.x > totalCols + 12) {
              tr.active = false;
              tr.cooldownTimer = 4.0 + Math.random() * 5.0;
              tr.warningTimer = 0;
            }
          }
        }
      }

      // Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16;
        p.life += dt;
        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Update Floating Texts
      for (let i = floatTextsRef.current.length - 1; i >= 0; i--) {
        const ft = floatTextsRef.current[i];
        ft.y -= dt * 36;
        ft.life += dt;
        if (ft.life >= 1.2) {
          floatTextsRef.current.splice(i, 1);
        }
      }

      // 2. RENDER FULLSCREEN CANVAS
      ctx.clearRect(0, 0, viewW, viewH);

      const camY = cameraYRef.current;
      const startVisibleRow = Math.max(0, Math.floor(camY) - 2);
      const endVisibleRow = startVisibleRow + 20;

      // Draw Lanes & Ground Slabs
      for (let r = startVisibleRow; r <= endVisibleRow; r++) {
        const lane = lanesRef.current.get(r);
        if (!lane) continue;

        const screenY = viewH - (r - camY + 1) * cellH;

        // Ground slab front depth
        ctx.fillStyle = lane.sideColor;
        ctx.fillRect(0, screenY + cellH - 8, viewW, 8);

        // Ground Top Face
        ctx.fillStyle = lane.topColor;
        ctx.fillRect(0, screenY, viewW, cellH - 8);

        // Starting Ground Stencil: ROAD OF DOOM (Crossy Road Style)
        if (r === 0) {
          ctx.save();
          ctx.textAlign = "center";
          ctx.font = "bold 18px 'Press Start 2P', monospace";
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillText("★ ROAD OF DOOM ★", viewW / 2 + 2, screenY + (cellH - 8) / 2 + 6);
          ctx.fillStyle = "rgba(255, 0, 127, 0.65)";
          ctx.fillText("★ ROAD OF DOOM ★", viewW / 2, screenY + (cellH - 8) / 2 + 4);
          ctx.restore();
        }

        if (lane.type === "HIGHWAY") {
          // Hot-pink dashed lane divider
          ctx.fillStyle = "rgba(255, 0, 127, 0.45)";
          for (let d = 0; d < totalCols; d++) {
            ctx.fillRect(d * cellW + 12, screenY + (cellH - 8) / 2 - 2, 26, 4);
          }
        } else if (lane.type === "SLUDGE") {
          // Bubbling Toxic Sludge Animation
          ctx.fillStyle = "rgba(118, 255, 3, 0.35)";
          const bubbleCount = Math.max(6, Math.floor(viewW / 120));
          for (let b = 0; b < bubbleCount; b++) {
            const bx = ((b * 130 + currentTime * 0.06) % (viewW + 60)) - 30;
            const by = screenY + 8 + (b % 3) * 10;
            ctx.beginPath();
            ctx.arc(bx, by, 5 + (b % 3), 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (lane.type === "DOOM_TUBE") {
          // Irken Transit Rails & Hazard Stripes
          ctx.fillStyle = "#1f0033";
          for (let tc = 0; tc < totalCols * 2; tc++) {
            ctx.fillRect(tc * (cellW / 2) + 4, screenY + 4, 12, cellH - 16);
          }
          ctx.fillStyle = "#ff007f";
          ctx.fillRect(0, screenY + 8, viewW, 4);
          ctx.fillRect(0, screenY + cellH - 16, viewW, 4);

          // Glowing Magenta Scanner Beacons
          if (lane.train && lane.train.cooldownTimer <= 1.4 && !lane.train.active) {
            const blink = Math.floor(currentTime / 140) % 2 === 0;
            ctx.fillStyle = blink ? "#ff007f" : "#4a0026";
            ctx.shadowColor = blink ? "#ff007f" : "transparent";
            ctx.shadowBlur = 18;
            ctx.fillRect(16, screenY + 8, 14, 14);
            ctx.fillRect(viewW - 30, screenY + 8, 14, 14);
            ctx.shadowBlur = 0;
          }
        }

        // --- INVADER ZIM THEMED OBSTACLES (GNOMES, GOTHIC TREES, MUTATED MUSHROOMS) ---
        if (lane.type === "YARD") {
          for (let c = 0; c < totalCols; c++) {
            if (lane.obstacles[c]) {
              const ox = c * cellW;
              const oy = screenY;
              const obsData = lane.obstacleTypes[c];

              // Ground Shadow
              ctx.fillStyle = "rgba(0,0,0,0.45)";
              ctx.beginPath();
              ctx.ellipse(ox + cellW / 2, oy + 32, 22, 9, 0, 0, Math.PI * 2);
              ctx.fill();

              if (obsData.type === "gnome") {
                // Creepy Lawn Gnome with Pointy Red Hat
                const gx = ox + cellW / 2;
                // Hat
                ctx.fillStyle = "#ff007f";
                ctx.beginPath();
                ctx.moveTo(gx, oy - 26);
                ctx.lineTo(gx - 14, oy + 4);
                ctx.lineTo(gx + 14, oy + 4);
                ctx.closePath();
                ctx.fill();
                // Face & Beard
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(gx, oy + 12, 11, 0, Math.PI);
                ctx.fill();
                // Nose
                ctx.fillStyle = "#ffab91";
                ctx.beginPath();
                ctx.arc(gx, oy + 6, 4, 0, Math.PI * 2);
                ctx.fill();
                // Glowing Bead Eyes
                ctx.fillStyle = "#76ff03";
                ctx.fillRect(gx - 6, oy + 3, 3, 3);
                ctx.fillRect(gx + 3, oy + 3, 3, 3);
              } else if (obsData.type === "tree") {
                // Twisted Gothic Alien Tree
                const tx = ox + cellW / 2;
                ctx.fillStyle = "#260c38";
                ctx.fillRect(tx - 6, oy + 8, 12, 20);
                // Angular Alien Foliage
                ctx.fillStyle = "#3c096c";
                ctx.fillRect(tx - 20, oy - 4, 40, 16);
                ctx.fillStyle = "#ff007f";
                ctx.fillRect(tx - 20, oy - 16, 40, 12);
                ctx.fillStyle = "#76ff03";
                ctx.fillRect(tx - 12, oy - 28, 24, 12);
              } else if (obsData.type === "mushroom") {
                // Mutated Toxic Mushroom
                const mx = ox + cellW / 2;
                ctx.fillStyle = "#4a148c";
                ctx.fillRect(mx - 5, oy + 6, 10, 20);
                ctx.fillStyle = "#ff007f";
                ctx.beginPath();
                ctx.ellipse(mx, oy + 4, 20, 14, 0, Math.PI, 0);
                ctx.fill();
                // Toxic green spots
                ctx.fillStyle = "#76ff03";
                ctx.beginPath();
                ctx.arc(mx - 8, oy - 3, 3, 0, Math.PI * 2);
                ctx.arc(mx + 7, oy - 2, 4, 0, Math.PI * 2);
                ctx.arc(mx, oy - 7, 3, 0, Math.PI * 2);
                ctx.fill();
              } else if (obsData.type === "gir") {
                // GIR in Green Dog Disguise with Rubber Piggy 🐷
                const gx = ox + cellW / 2;
                const gy = oy + 6;
                const bounce = Math.sin(currentTime * 0.006 + ox) * 2.5;

                // Ground shadow
                ctx.fillStyle = "rgba(0,0,0,0.35)";
                ctx.beginPath();
                ctx.ellipse(gx, oy + 28, 16, 7, 0, 0, Math.PI * 2);
                ctx.fill();

                // Green Dog Suit body & head
                ctx.fillStyle = "#76ff03";
                ctx.beginPath();
                ctx.roundRect(gx - 13, gy + bounce + 4, 26, 22, 7);
                ctx.fill();

                // Black floppy dog ears
                ctx.fillStyle = "#111111";
                ctx.beginPath();
                ctx.ellipse(gx - 15, gy + bounce + 8, 4, 10, -0.25, 0, Math.PI * 2);
                ctx.ellipse(gx + 15, gy + bounce + 8, 4, 10, 0.25, 0, Math.PI * 2);
                ctx.fill();

                // White zipper down chest
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.5;
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(gx, gy + bounce + 12);
                ctx.lineTo(gx, gy + bounce + 25);
                ctx.stroke();
                ctx.setLineDash([]);

                // Giant cartoon eyes
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(gx - 6, gy + bounce + 6, 6, 0, Math.PI * 2);
                ctx.arc(gx + 6, gy + bounce + 6, 6, 0, Math.PI * 2);
                ctx.fill();

                // Black pupils
                ctx.fillStyle = "#111111";
                ctx.beginPath();
                ctx.arc(gx - 5, gy + bounce + 6, 2.5, 0, Math.PI * 2);
                ctx.arc(gx + 5, gy + bounce + 6, 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Pink tongue sticking out :P
                ctx.fillStyle = "#ff4081";
                ctx.beginPath();
                ctx.arc(gx + 2, gy + bounce + 13, 3.5, 0, Math.PI);
                ctx.fill();

                // Tiny Rubber Piggy beside GIR 🐷
                ctx.fillStyle = "#f48fb1";
                ctx.beginPath();
                ctx.ellipse(gx + 14, gy + bounce + 18, 5, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#d81b60";
                ctx.fillRect(gx + 13, gy + bounce + 17, 3, 2);
              }
            }
          }
        }

        // --- TOXIC SLUDGE FLOATS (GIR PIGGY, CUPCAKE, WAFFLE) ---
        if (lane.type === "SLUDGE" && lane.floats) {
          for (const f of lane.floats) {
            const fx = f.x * cellW;
            const fw = f.width * cellW;
            const fy = screenY + 4;
            const fMid = fx + fw / 2;

            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(fx + 2, fy + 22, fw - 4, 6);

            if (f.type === "piggy") {
              // GIR's Beloved Rubber Piggy 🐷
              ctx.fillStyle = "#f48fb1";
              ctx.beginPath();
              ctx.roundRect(fx + 4, fy + 4, fw - 8, cellH - 18, 12);
              ctx.fill();
              // Snout
              ctx.fillStyle = "#ec407a";
              ctx.beginPath();
              ctx.ellipse(fMid, fy + 14, 8, 5, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "#111111";
              ctx.fillRect(fMid - 4, fy + 13, 2, 3);
              ctx.fillRect(fMid + 2, fy + 13, 2, 3);
              // Ears & Eyes
              ctx.fillStyle = "#d81b60";
              ctx.fillRect(fx + 8, fy + 2, 6, 6);
              ctx.fillRect(fx + fw - 14, fy + 2, 6, 6);
              ctx.fillStyle = "#111111";
              ctx.fillRect(fMid - 10, fy + 9, 3, 3);
              ctx.fillRect(fMid + 7, fy + 9, 3, 3);
            } else if (f.type === "cupcake") {
              // Cupcake Attack! 🧁
              ctx.fillStyle = "#795548";
              ctx.fillRect(fx + 8, fy + 14, fw - 16, 12);
              // Hot-Pink Swirled Frosting
              ctx.fillStyle = "#ff007f";
              ctx.beginPath();
              ctx.roundRect(fx + 4, fy + 2, fw - 8, 14, 8);
              ctx.fill();
              // Neon green sprinkles
              ctx.fillStyle = "#76ff03";
              ctx.fillRect(fMid - 8, fy + 5, 4, 2);
              ctx.fillRect(fMid + 6, fy + 6, 3, 2);
              ctx.fillRect(fMid - 1, fy + 3, 3, 2);
            } else {
              // Giant Golden Waffle 🧇
              ctx.fillStyle = "#ffb74d";
              ctx.beginPath();
              ctx.roundRect(fx + 4, fy + 6, fw - 8, cellH - 20, 6);
              ctx.fill();
              // Butter pat
              ctx.fillStyle = "#fff59d";
              ctx.fillRect(fMid - 5, fy + 10, 10, 7);
            }
          }
        }

        // --- HIGHWAY VEHICLES (DIB'S VAN, VOOT CRUISER, EARTH CLUNKERS) ---
        if (lane.type === "HIGHWAY" && lane.vehicles) {
          for (const v of lane.vehicles) {
            const vx = v.x * cellW;
            const vw = v.width * cellW;
            const vy = screenY + 2;
            const isRight = v.speed > 0;

            ctx.fillStyle = "rgba(0,0,0,0.45)";
            ctx.fillRect(vx + 4, vy + 24, vw - 8, 8);

            if (v.type === "van") {
              // Dib's Paranormal Science Van
              ctx.fillStyle = "#212121";
              ctx.fillRect(vx + 2, vy + 10, vw - 4, 14);
              ctx.fillStyle = "#424242";
              ctx.fillRect(vx + 2, vy + 4, vw - 4, 8);
              // Paranormal Dish on Roof
              ctx.fillStyle = "#9c27b0";
              ctx.beginPath();
              ctx.arc(vx + vw / 2, vy + 2, 7, 0, Math.PI, true);
              ctx.fill();
              // Blue Headlights
              ctx.fillStyle = "#00f0ff";
              const headX = isRight ? vx + vw - 4 : vx + 2;
              ctx.fillRect(headX, vy + 12, 3, 5);
            } else if (v.type === "voot") {
              // Irken Voot Cruiser Scout Ship
              ctx.fillStyle = "#ff007f";
              ctx.beginPath();
              ctx.roundRect(vx + 2, vy + 6, vw - 4, 16, 8);
              ctx.fill();
              // Ruby Cockpit Dome
              ctx.fillStyle = "#f50057";
              ctx.beginPath();
              ctx.ellipse(vx + vw / 2, vy + 12, vw / 3, 6, 0, 0, Math.PI * 2);
              ctx.fill();
              // Cyan Thruster Trail
              ctx.fillStyle = "#00f0ff";
              const thX = isRight ? vx : vx + vw - 5;
              ctx.fillRect(thX, vy + 11, 5, 6);
            } else {
              // Standard Earth Clunker / Semi
              ctx.fillStyle = "#111111";
              ctx.fillRect(vx + 6, vy + 22, 10, 6);
              ctx.fillRect(vx + vw - 16, vy + 22, 10, 6);
              ctx.fillStyle = v.color;
              ctx.fillRect(vx + 2, vy + 12, vw - 4, 12);
              ctx.fillStyle = v.color;
              ctx.filter = "brightness(1.2)";
              ctx.fillRect(vx + 2, vy + 4, vw - 4, 8);
              ctx.filter = "none";
            }
          }
        }

        // --- THE IRKEN DOOM TRAIN ---
        if (lane.type === "DOOM_TUBE" && lane.train && lane.train.active) {
          const tr = lane.train;
          const tx = tr.x * cellW;
          const tw = tr.length * cellW;
          const ty = screenY + 2;

          ctx.fillStyle = "#240046";
          ctx.fillRect(tx, ty + 10, tw, 20);
          ctx.fillStyle = "#ff007f";
          ctx.fillRect(tx, ty, tw, 10);
          ctx.fillStyle = "#76ff03";
          ctx.fillRect(tx, ty + 12, tw, 4);

          // Glowing Ruby Irken Eyes on Train Front
          const eyeX = tr.speed > 0 ? tx + tw - 24 : tx + 10;
          ctx.fillStyle = "#ff007f";
          ctx.fillRect(eyeX, ty + 12, 12, 8);
        }

        // --- COLLECTIBLE SNACKS (CUPCAKES / WAFFLES) ---
        if (lane.snackCol !== undefined) {
          const cx = lane.snackCol * cellW + cellW / 2;
          const cy = screenY + cellH / 2 - 4;
          const bounce = Math.sin(currentTime * 0.007 + lane.index) * 4;

          // Shadow
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.beginPath();
          ctx.ellipse(cx, cy + 14, 10, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Glowing Cupcake Snack 🧁
          ctx.fillStyle = "#795548";
          ctx.fillRect(cx - 7, cy + bounce + 2, 14, 8);
          ctx.fillStyle = "#ff007f";
          ctx.shadowColor = "#ff007f";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(cx, cy + bounce, 9, Math.PI, 0);
          ctx.fill();
          ctx.shadowBlur = 0;
          // Cherry on top
          ctx.fillStyle = "#76ff03";
          ctx.beginPath();
          ctx.arc(cx, cy + bounce - 9, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- DRAW PLAYER INVADER ZIM 👽 ---
      const curCol = player.isHopping
        ? player.col + (player.targetCol - player.col) * player.hopProgress
        : player.col;
      const curRow = player.isHopping
        ? player.row + (player.targetRow - player.row) * player.hopProgress
        : player.row;

      let bonkOffX = 0;
      let bonkOffY = 0;
      if (player.bonkShake > 0) {
        const bonkRatio = Math.sin((player.bonkShake / 0.16) * Math.PI);
        bonkOffX = player.bonkDirX * bonkRatio * 8;
        bonkOffY = -player.bonkDirY * bonkRatio * 8;
      }

      const px = curCol * cellW + cellW / 2 + bonkOffX;
      const hopZ = player.isHopping ? Math.sin(player.hopProgress * Math.PI) * 22 : 0;
      const py = viewH - (curRow - camY + 1) * cellH + cellH / 2 - hopZ + bonkOffY;

      if (!player.dead) {
        const shadowScale = player.isHopping ? 1 - hopZ / 38 : 1;
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.beginPath();
        ctx.ellipse(
          px,
          viewH - (curRow - camY + 1) * cellH + cellH / 2 + 12,
          16 * shadowScale,
          7 * shadowScale,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.save();
        ctx.translate(px, py);

        if (player.bonkShake > 0) {
          const bonkAngle = Math.sin((player.bonkShake / 0.16) * Math.PI * 4) * 0.25;
          ctx.rotate(bonkAngle);
        }

        if (player.facing === "LEFT") {
          ctx.scale(-1, 1);
        }

        let scaleX = 1;
        let scaleY = 1;
        if (player.isHopping) {
          const jumpPhase = Math.sin(player.hopProgress * Math.PI);
          scaleY = 1 + jumpPhase * 0.22;
          scaleX = 1 - jumpPhase * 0.14;
        } else {
          const idlePhase = Math.sin(currentTime * 0.005) * 0.03;
          scaleY = 1 + idlePhase;
          scaleX = 1 - idlePhase;
        }
        ctx.scale(scaleX, scaleY);

        if (zimImgRef.current && zimImgRef.current.complete) {
          const targetW = cellW * 0.95;
          const targetH = targetW * 1.55;
          ctx.drawImage(
            zimImgRef.current,
            -targetW / 2,
            -targetH + 12,
            targetW,
            targetH
          );
        } else {
          ctx.fillStyle = "#76ff03";
          ctx.fillRect(-12, -26, 24, 26);
          ctx.fillStyle = "#e91e63";
          ctx.fillRect(-10, -22, 9, 13);
          ctx.fillRect(1, -22, 9, 13);
        }

        ctx.restore();
      }

      // Draw Dib's Drone Swoop
      if (droneStateRef.current.active) {
        const dY = viewH - (droneStateRef.current.y - camY + 1) * cellH;
        ctx.fillStyle = "rgba(255, 0, 127, 0.4)";
        ctx.beginPath();
        ctx.ellipse(px, py + 8, 60, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flying Drone Body
        ctx.fillStyle = "#212121";
        ctx.beginPath();
        ctx.arc(px, dY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#00f0ff";
        ctx.fillRect(px - 14, dY - 4, 28, 8);
        ctx.fillStyle = "#ff007f";
        ctx.fillRect(px - 4, dY + 6, 8, 8);
      }

      // Draw Particles
      for (const p of particlesRef.current) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      // Draw Floating In-Game Texts
      for (const ft of floatTextsRef.current) {
        ctx.fillStyle = ft.color;
        ctx.font = "bold 13px 'Press Start 2P', monospace";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 6;
        ctx.fillText(ft.text, ft.x - 48, ft.y);
        ctx.shadowBlur = 0;
      }

      // --- IN-GAME TOP HUD (IRKEN TERMINAL HUD) ---
      const hudGrad = ctx.createLinearGradient(0, 0, 0, 75);
      hudGrad.addColorStop(0, "rgba(20, 4, 30, 0.95)");
      hudGrad.addColorStop(1, "rgba(20, 4, 30, 0)");
      ctx.fillStyle = hudGrad;
      ctx.fillRect(0, 0, viewW, 75);

      // (A) Top-Left: Exit button
      ctx.fillStyle = "rgba(10, 4, 18, 0.8)";
      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(16, 16, 110, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ff007f";
      ctx.font = "bold 10px 'Press Start 2P', monospace";
      ctx.shadowColor = "#ff007f";
      ctx.shadowBlur = 6;
      ctx.fillText("← BASE", 32, 38);
      ctx.shadowBlur = 0;

      // (B) Score, High Score & Snacks Display
      ctx.fillStyle = "rgba(10, 4, 18, 0.85)";
      ctx.strokeStyle = "#76ff03";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(136, 14, 215, 42, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#b2ff59";
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.fillText("CONQUEST", 146, 28);
      ctx.fillStyle = "#76ff03";
      ctx.font = "bold 18px 'Press Start 2P', monospace";
      ctx.shadowColor = "#76ff03";
      ctx.shadowBlur = 8;
      ctx.fillText(`${score}`, 146, 48);
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#3c096c";
      ctx.fillRect(235, 20, 2, 30);

      ctx.fillStyle = "#00f0ff";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText("RECORD", 246, 28);
      ctx.fillStyle = "#00f0ff";
      ctx.font = "bold 11px 'Press Start 2P', monospace";
      ctx.fillText(`${highScore}`, 246, 45);

      ctx.fillStyle = "#ff007f";
      ctx.fillText(`🧁${coins}`, 302, 45);

      // (B2) Center Title Marquee: ROAD OF DOOM (Integrated into HUD)
      const centerTitleX = viewW / 2;
      if (viewW >= 840) {
        ctx.fillStyle = "rgba(10, 4, 18, 0.9)";
        ctx.strokeStyle = "#ff007f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(centerTitleX - 140, 14, 280, 42, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#76ff03";
        ctx.font = "bold 13px 'Press Start 2P', monospace";
        ctx.shadowColor = "#76ff03";
        ctx.shadowBlur = 10;
        ctx.textAlign = "center";
        ctx.fillText("ROAD OF DOOM", centerTitleX, 39);
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ff007f";
        ctx.font = "9px 'Press Start 2P', monospace";
        ctx.fillText("★", centerTitleX - 116, 38);
        ctx.fillText("★", centerTitleX + 116, 38);
        ctx.textAlign = "left";
      } else if (viewW >= 640) {
        ctx.fillStyle = "#76ff03";
        ctx.font = "bold 11px 'Press Start 2P', monospace";
        ctx.shadowColor = "#76ff03";
        ctx.shadowBlur = 8;
        ctx.textAlign = "center";
        ctx.fillText("ROAD OF DOOM", centerTitleX, 39);
        ctx.shadowBlur = 0;
        ctx.textAlign = "left";
      }

      // (C) Top-Right: Tickets Wallet
      const walletX = viewW - 270;
      ctx.fillStyle = "rgba(10, 4, 18, 0.85)";
      ctx.strokeStyle = "#ffeb3b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(walletX, 14, 130, 42, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fff59d";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText("WALLET", walletX + 10, 28);
      ctx.fillStyle = "#ffee58";
      ctx.font = "bold 11px 'Press Start 2P', monospace";
      ctx.shadowColor = "#ffee58";
      ctx.shadowBlur = 6;
      ctx.fillText(`🎟️ ${tickets}`, walletX + 10, 46);
      ctx.shadowBlur = 0;

      // Audio Toggle Button
      const audioBtnX = viewW - 130;
      ctx.fillStyle = "rgba(10, 4, 18, 0.8)";
      ctx.strokeStyle = "#76ff03";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(audioBtnX, 16, 54, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = soundMuted ? "#ff1744" : "#76ff03";
      ctx.font = "14px 'Press Start 2P', monospace";
      ctx.fillText(soundMuted ? "🔇" : "🔊", audioBtnX + 16, 40);

      // Fullscreen Toggle Button
      const fsBtnX = viewW - 68;
      ctx.fillStyle = "rgba(10, 4, 18, 0.8)";
      ctx.strokeStyle = "#ff007f";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(fsBtnX, 16, 52, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ff007f";
      ctx.font = "14px 'Press Start 2P', monospace";
      ctx.fillText(isFullscreen ? "🗗" : "⛶", fsBtnX + 15, 39);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState, dimensions, ensureLanes, triggerGameOver, isFullscreen, soundMuted, tickets, score, highScore, coins, spawnParticles, recordAchievementProgress]);

  // Canvas Click & Touch
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const viewW = dimensions.width;

    if (mx >= 16 && mx <= 126 && my >= 16 && my <= 52) {
      router.push("/");
      return;
    }

    const audioBtnX = viewW - 130;
    if (mx >= audioBtnX && mx <= audioBtnX + 54 && my >= 16 && my <= 52) {
      toggleSound();
      return;
    }

    const fsBtnX = viewW - 68;
    if (mx >= fsBtnX && mx <= fsBtnX + 52 && my >= 16 && my <= 52) {
      toggleFullscreen();
      return;
    }

    if (gameState === "PLAYING") {
      movePlayer(0, 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const viewW = dimensions.width;

    const isExitHover = mx >= 16 && mx <= 126 && my >= 16 && my <= 52;
    const isAudioHover = mx >= viewW - 130 && mx <= viewW - 76 && my >= 16 && my <= 52;
    const isFsHover = mx >= viewW - 68 && mx <= viewW - 16 && my >= 16 && my <= 52;

    if (canvasRef.current) {
      canvasRef.current.style.cursor = isExitHover || isAudioHover || isFsHover ? "pointer" : "default";
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 15) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = touch.clientX - rect.left;
      const my = touch.clientY - rect.top;
      const viewW = dimensions.width;
      const viewH = dimensions.height;

      if (mx >= 16 && mx <= 126 && my >= 16 && my <= 52) {
        router.push("/");
        return;
      }
      if (mx >= viewW - 130 && mx <= viewW - 76 && my >= 16 && my <= 52) {
        toggleSound();
        return;
      }
      if (mx >= viewW - 68 && mx <= viewW - 16 && my >= 16 && my <= 52) {
        toggleFullscreen();
        return;
      }

      if (gameState === "PLAYING") {
        if (my > viewH * 0.72) {
          if (mx < viewW * 0.35) movePlayer(-1, 0);
          else if (mx > viewW * 0.65) movePlayer(1, 0);
          else movePlayer(0, -1);
        } else {
          movePlayer(0, 1);
        }
      }
    } else {
      if (gameState === "PLAYING") {
        if (Math.abs(dy) > Math.abs(dx)) {
          if (dy < 0) movePlayer(0, 1);
          else movePlayer(0, -1);
        } else {
          if (dx < 0) movePlayer(-1, 0);
          else movePlayer(1, 0);
        }
      }
    }
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          "KeyW",
          "KeyS",
          "KeyA",
          "KeyD",
        ].includes(e.code)
      ) {
        e.preventDefault();
      }

      if (e.code === "Space" || e.code === "Enter") {
        if (gameState === "GAMEOVER") {
          startGame();
          return;
        }
        movePlayer(0, 1);
        return;
      }

      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          movePlayer(0, 1);
          break;
        case "ArrowDown":
        case "KeyS":
          movePlayer(0, -1);
          break;
        case "ArrowLeft":
        case "KeyA":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "KeyD":
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, movePlayer, startGame]);

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#07030d] overflow-hidden select-none font-pixel crt-overlay">
      {/* Fullscreen Canvas World */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {/* =========================================================================
          🏆 MISSION COMPLETE TOAST BANNER
         ========================================================================= */}
      {toastMission && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-yellow-400 bg-[#16062a]/95 text-yellow-300 shadow-[0_0_35px_rgba(255,235,59,0.85)] animate-bounce font-pixel text-xs backdrop-blur-md">
          <span className="text-3xl">{toastMission.icon}</span>
          <div className="text-left space-y-0.5">
            <div className="text-[9px] text-pink-400 font-extrabold tracking-widest uppercase">
              ★ MISSION COMPLETE! ★
            </div>
            <div className="text-white font-bold text-sm tracking-wide">{toastMission.title}</div>
            <div className="text-yellow-300 text-[10px] font-bold">
              +{toastMission.reward} 🎟️ ADDED TO ARCADE VAULT!
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MINI ACHIEVEMENTS SIDE PANEL (IRKEN CONQUEST MISSIONS)
         ========================================================================= */}
      {gameState === "PLAYING" && (
        <div className="fixed top-16 left-3 sm:left-4 z-40 select-none">
          {/* Toggle Button */}
          <button
            onClick={() => setShowMissions((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-pixel text-[10px] sm:text-xs font-bold transition-all border-2 shadow-[0_0_20px_rgba(255,0,127,0.5)] cursor-pointer active:scale-95 ${
              showMissions
                ? "border-green-400 bg-green-950/90 text-green-300 shadow-[0_0_25px_rgba(118,255,3,0.6)]"
                : "border-pink-500 bg-[#160424]/90 text-pink-300 hover:bg-pink-900/60"
            }`}
          >
            <span>🏆</span>
            <span className="mr-1">MISSIONS</span>
            <span
              suppressHydrationWarning
              className="px-1.5 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-400 text-[9px]"
            >
              {Object.keys(claimedAchievements).length}/{ACHIEVEMENTS.length}
            </span>
            <span className="text-[10px] ml-1">{showMissions ? "◀" : "▶"}</span>
          </button>

          {/* Expanded Mission Board Drawer */}
          {showMissions && (
            <div className="mt-2 w-72 sm:w-80 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border-2 border-pink-500 bg-[#12061f]/95 p-3.5 space-y-2.5 shadow-[0_0_35px_rgba(255,0,127,0.6)] backdrop-blur-md animate-fadeIn">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-purple-900 pb-2">
                <div>
                  <h3 className="text-xs font-bold text-green-400 neon-glow-green">★ IRKEN MISSIONS ★</h3>
                  <p className="text-[8px] text-pink-400 font-mono">NEVER RESETS • EARN EXTRA TICKETS!</p>
                </div>
                <button
                  onClick={() => setShowMissions(false)}
                  className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-black/50 border border-purple-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Mission List */}
              <div className="space-y-2 pr-1 max-h-[50vh] overflow-y-auto">
                {ACHIEVEMENTS.map((ach) => {
                  const isClaimed = !!claimedAchievements[ach.id];
                  const curVal = achievementStats[ach.statKey] || 0;
                  const progressPct = Math.min(100, Math.floor((curVal / ach.target) * 100));

                  return (
                    <div
                      key={ach.id}
                      className={`p-2.5 rounded-xl border text-[9px] font-pixel transition-all ${
                        isClaimed
                          ? "border-green-500/80 bg-green-950/40 text-gray-200"
                          : "border-purple-800/80 bg-black/60 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-base">{ach.icon}</span>
                          <span className={isClaimed ? "text-green-300" : "text-white"}>{ach.title}</span>
                        </div>
                        <span className="text-yellow-300 font-bold px-1.5 py-0.5 rounded bg-yellow-950/80 border border-yellow-600/50">
                          +{ach.reward} 🎟️
                        </span>
                      </div>

                      <div className="text-[8px] text-gray-400 mb-2 font-mono leading-tight">
                        {ach.description}
                      </div>

                      {isClaimed ? (
                        <div className="flex items-center justify-between text-[8px] text-green-400 font-bold">
                          <span>✓ COMPLETED!</span>
                          <span className="text-yellow-400">CLAIMED</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] text-gray-400 font-mono">
                            <span>PROGRESS:</span>
                            <span className="text-cyan-300 font-bold">
                              {curVal} / {ach.target}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-purple-900">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-green-400 transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          GAME OVER OVERLAY SCREEN - CATASTROPHIC FAILURE
         ========================================================================= */}
      {gameState === "GAMEOVER" && (() => {
        const tallest = (() => {
          if (deathReason.includes("VAN")) {
            return {
              speaker: "TALLEST RED",
              text: "HAHAHA! The big-headed Earth boy ran him over with a van! Magnificent!",
              snack: "🍿 EATING POPCORN",
            };
          }
          if (deathReason.includes("VOOT")) {
            return {
              speaker: "TALLEST PURPLE",
              text: "His own scout ship flattened him! Such supreme incompetence!",
              snack: "🍩 EATING JELLY DONUT",
            };
          }
          if (deathReason.includes("SLUDGE") || deathReason.includes("SEWAGE")) {
            return {
              speaker: "TALLEST RED",
              text: "Eww! He melted in Earth toilet grease! Pass the mega soda, Purple.",
              snack: "🥤 SIPPING SLURPEE",
            };
          }
          if (deathReason.includes("TRAIN")) {
            return {
              speaker: "TALLEST PURPLE",
              text: "Vaporized by the Irken Express! Can we play the instant replay in slow-mo?",
              snack: "🌮 EATING TACOS",
            };
          }
          if (deathReason.includes("DRONE")) {
            return {
              speaker: "TALLEST RED",
              text: "Captured by Dib's flying toy! We are definitely leaving him there forever.",
              snack: "🍫 EATING CHOCOLATE",
            };
          }
          if (deathReason.includes("ADVANCING") || deathReason.includes("SCREEN") || deathReason.includes("CONSUMED")) {
            return {
              speaker: "TALLEST RED",
              text: "HAHA! The screen caught up to him because he was standing still! Pathetic!",
              snack: "🍿 CRUNCHING POPCORN",
            };
          }
          return {
            speaker: "THE ALMIGHTY TALLEST",
            text: "He failed! As expected of Zim. Back to snack time!",
            snack: "🍩 MUNCHING DONUTS",
          };
        })();

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md rounded-3xl border-4 border-pink-500 bg-[#12061f]/95 p-6 sm:p-7 text-center space-y-4 shadow-[0_0_55px_rgba(255,0,127,0.75)]">
              {/* Metallic Corner Rivets */}
              <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-pink-500 border border-pink-200 shadow-[0_0_8px_#ff007f]" />
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-pink-500 border border-pink-200 shadow-[0_0_8px_#ff007f]" />
              <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-pink-500 border border-pink-200 shadow-[0_0_8px_#ff007f]" />
              <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-pink-500 border border-pink-200 shadow-[0_0_8px_#ff007f]" />

              {/* Header Badge */}
              <div className="space-y-1">
                <div className="inline-block px-4 py-1.5 rounded-full border-2 border-pink-500 bg-pink-950 text-pink-300 text-xs sm:text-sm font-extrabold tracking-widest animate-pulse shadow-[0_0_25px_rgba(255,0,127,0.8)]">
                  ★ CATASTROPHIC FAILURE! ★
                </div>
                <div className="text-xs sm:text-sm font-bold text-yellow-300 neon-glow-yellow pt-1">
                  {deathReason || "ZIM HAS FAILED!"}
                </div>
              </div>

              {/* The Almighty Tallest Live Surveillance Feed Reaction */}
              <div className="p-3 rounded-xl border border-pink-700/80 bg-[#0d0217] space-y-1 text-left">
                <div className="flex justify-between items-center text-[9px] text-pink-400 font-mono font-bold tracking-wider">
                  <span>📡 TRANSMISSION FROM THE MASSIVE</span>
                  <span className="text-yellow-300 font-bold">{tallest.snack}</span>
                </div>
                <div className="text-[10px] text-gray-200 leading-snug font-mono">
                  <span className="text-pink-400 font-bold">{tallest.speaker}: </span>
                  &quot;{tallest.text}&quot;
                </div>
              </div>

              {/* Core Stats Box: Score, Best Score, and Tickets Won */}
              <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-purple-600 bg-black/80 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">STREETS CONQUERED:</span>
                  <span className="text-green-400 font-extrabold text-base sm:text-lg">
                    {score}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">SUPREME RECORD:</span>
                  <div className="flex items-center gap-2">
                    {isNewHighScore && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 animate-bounce">
                        NEW RECORD!
                      </span>
                    )}
                    <span suppressHydrationWarning className="text-cyan-400 font-bold text-base">
                      {highScore}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-purple-950 pt-2">
                  <span className="text-gray-400">SNACKS HARVESTED:</span>
                  <span className="text-pink-400 font-bold text-sm">+{coins} 🧁</span>
                </div>

                <div className="border-t-2 border-pink-900/80 pt-2.5 flex justify-between items-center">
                  <span className="text-xs text-yellow-300 font-bold">CONQUEST TICKETS:</span>
                  <span className="text-lg sm:text-xl font-extrabold text-yellow-300 neon-glow-yellow animate-bounce">
                    +{ticketsEarned} 🎟️
                  </span>
                </div>
              </div>

              {/* Payout Notice */}
              <div className="text-[10px] text-green-300/90 bg-green-950/60 py-1.5 px-3 rounded-lg border border-green-800">
                🎉 +{ticketsEarned} tickets added to your Earth Arcade Vault!
              </div>

              {/* Classic GIR Comic Quote */}
              <div className="text-[9px] text-pink-400 font-mono italic">
                &quot;DOOM! DOOM! DOOM! DOOM! DOOM!&quot; — GIR 🐷
              </div>

              {/* Missions Summary Button */}
              <button
                onClick={() => setShowMissions(true)}
                className="w-full py-2 px-3 rounded-xl border border-purple-700 bg-purple-950/70 hover:bg-purple-900 text-yellow-300 text-[9px] font-pixel font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(255,235,59,0.2)]"
              >
                <span>🏆</span>
                <span>VIEW MISSIONS ({Object.keys(claimedAchievements).length}/{ACHIEVEMENTS.length} COMPLETED)</span>
              </button>

              {/* Interactive Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={startGame}
                  className="w-full py-3.5 px-6 rounded-xl font-pixel text-xs sm:text-sm font-bold border-2 border-green-400 bg-green-500 hover:bg-green-400 text-black transition-all shadow-[0_0_25px_rgba(118,255,3,0.6)] active:scale-95 cursor-pointer text-center"
                >
                  🔄 TRY AGAIN, INFERIOR WORM! [SPACE]
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href="/shop"
                    className="flex-1 py-2.5 px-3 rounded-xl font-pixel text-[10px] sm:text-xs font-bold border-2 border-pink-500 bg-pink-950/70 hover:bg-pink-600 hover:text-white text-pink-300 transition-all shadow-[0_0_15px_rgba(255,0,127,0.4)] active:scale-95 text-center"
                  >
                    🎁 PRIZE SHOP
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 py-2.5 px-3 rounded-xl font-pixel text-[10px] sm:text-xs font-bold border-2 border-gray-700 bg-gray-900/80 hover:bg-white hover:text-black text-gray-300 transition-all active:scale-95 text-center"
                  >
                    ← RETREAT TO BASE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
