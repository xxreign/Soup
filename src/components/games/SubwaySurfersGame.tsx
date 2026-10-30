"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTickets } from "@/context/TicketContext";

interface Item {
  lane: number; // 0, 1, 2
  z: number;
  type: "coin" | "train" | "barrier" | "sign";
  hit: boolean;
}

class ArcadeSound {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  playCoin() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playJump() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playSlide() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playMove() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playCrash() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(45, now + 0.45);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  playTicketWin() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.09, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.22);
    });
  }
}

export function SubwaySurfersGame() {
  const { addTickets } = useTickets();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<ArcadeSound | null>(null);
  const heroImageRef = useRef<HTMLImageElement | null>(null);

  // Game UI state
  const [gameState, setGameState] = useState<"ready" | "playing" | "paused" | "over">("ready");
  const [hudDistance, setHudDistance] = useState<number>(0);
  const [hudCoins, setHudCoins] = useState<number>(0);
  const [hudTickets, setHudTickets] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ticketAwardNotification, setTicketAwardNotification] = useState<string | null>(null);

  // Active game logic state refs to prevent re-render tearing
  const stateRef = useRef<"ready" | "playing" | "paused" | "over">("ready");
  const laneRef = useRef<number>(1);
  const smoothLaneRef = useRef<number>(1);
  const itemsRef = useRef<Item[]>([]);
  const distRef = useRef<number>(0);
  const coinsRef = useRef<number>(0);
  const clockRef = useRef<number>(0);
  const spawnRef = useRef<number>(0.45);
  const jumpRef = useRef<number>(0);
  const slideRef = useRef<number>(0);
  const speedRef = useRef<number>(0.47);
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Initialize audio and best score
  useEffect(() => {
    audioRef.current = new ArcadeSound();
    try {
      const savedBest = localStorage.getItem("subwaySurfersBest") || localStorage.getItem("alienRunnerBest");
      if (savedBest) {
        setHighScore(parseInt(savedBest, 10) || 0);
      }
    } catch {
      // localStorage unavailable
    }

    // Preload hero sprite
    const img = new Image();
    img.src = "/images/alien-runner.png";
    img.onload = () => {
      heroImageRef.current = img;
      if (stateRef.current === "ready") {
        renderScene();
      }
    };
    heroImageRef.current = img;

    // Initial render
    renderScene();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const calculateTickets = (dist: number, coins: number) => {
    return Math.floor(dist / 100) + Math.floor(coins / 10);
  };

  // 3D perspective projection
  const xy = (l: number, z: number) => {
    const t = Math.min(1.2, Math.max(0, z));
    const p = Math.pow(t, 1.34);
    return {
      x: 240 + (l - 1) * (39 + 124 * p),
      y: 122 + 478 * p,
      s: 0.24 + 1.25 * p,
    };
  };

  const fill = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    r = 0
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function" && r > 0) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.fill();
  };

  const linePath = (
    ctx: CanvasRenderingContext2D,
    ax: number,
    ay: number,
    bx: number,
    by: number,
    color: string,
    width: number
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  };

  const renderScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const dist = distRef.current;
    const clock = clockRef.current;
    const jump = jumpRef.current;
    const slide = slideRef.current;
    const hero = heroImageRef.current;

    // Background gradient sky (Alien cyberpunk sunset)
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#4a86e8");
    grad.addColorStop(0.24, "#b057b5");
    grad.addColorStop(0.75, "#3b2354");
    grad.addColorStop(1, "#180d28");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Skyline buildings with lit windows
    for (let i = 0; i < 16; i++) {
      const ht = 50 + ((i * 43) % 103);
      fill(
        ctx,
        i * 36 - 7,
        123 - ht,
        32,
        ht,
        i % 3 === 0 ? "#75487d" : "#5d4475"
      );
      for (let j = 0; j < 3; j++) {
        fill(
          ctx,
          i * 36 + 1 + j * 9,
          126 - ht + 15 + ((j * 21) % 35),
          5,
          10,
          "#facc15"
        );
      }
    }

    // Horizon line & ground bridge
    fill(ctx, 0, 120, W, 12, "#4b2e59");
    fill(ctx, 0, 132, W, 9, "#77537a");

    // Track bed perspective mesh
    ctx.beginPath();
    ctx.moveTo(197, 122);
    ctx.lineTo(283, 122);
    ctx.lineTo(565, H);
    ctx.lineTo(-85, H);
    ctx.closePath();
    ctx.fillStyle = "#2d1f36";
    ctx.fill();

    // Railway tracks (3 lanes with outer and inner metal sheen)
    for (let l = -0.5; l < 3; l++) {
      const a = xy(l, 0);
      const b = xy(l, 1);
      linePath(ctx, a.x, a.y, b.x, b.y, "#171923", 12);
      linePath(ctx, a.x, a.y, b.x, b.y, "#adb9d0", 5);
    }

    // Moving railroad ties
    for (let z = 0.015; z < 1; z += 0.06) {
      const t = (z + (dist % 8) / 120) % 1;
      const y = xy(1, t).y;
      const half = 60 + 218 * Math.pow(t, 1.3);
      linePath(ctx, 240 - half, y, 240 + half, y, "#5c4249", 2 + 3 * t);
    }

    // Side guard rails (neon orange & deep purple)
    for (const side of [-1, 1]) {
      const bx = 240 + side * 80;
      const ex = 240 + side * 360;
      linePath(ctx, bx, 122, ex, 600, "#00f0ff", 7);
      linePath(ctx, bx + side * 12, 122, ex + side * 12, 600, "#ff007f", 9);
    }

    // Draw obstacle and coin items sorted by distance z
    const items = [...itemsRef.current].sort((a, b) => a.z - b.z);
    for (const o of items) {
      const p = xy(o.lane, o.z);
      const s = p.s;
      const x = p.x;
      const y = p.y;

      if (o.type === "coin") {
        ctx.save();
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 18 * s;
        ctx.beginPath();
        ctx.ellipse(x, y - 21 * s, 11 * s, 15 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#facc15";
        ctx.fill();
        ctx.strokeStyle = "#fffbeb";
        ctx.lineWidth = 3 * s;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#b45309";
        ctx.font = `900 ${Math.max(8, 15 * s)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("★", x, y - 16 * s);
        ctx.restore();
      } else if (o.type === "train") {
        fill(ctx, x - 30 * s, y - 101 * s, 60 * s, 104 * s, "#221935", 7 * s);
        fill(ctx, x - 25 * s, y - 96 * s, 50 * s, 91 * s, "#ff007f", 5 * s);
        fill(ctx, x - 20 * s, y - 86 * s, 40 * s, 39 * s, "#1e293b", 4 * s);
        fill(ctx, x - 17 * s, y - 80 * s, 15 * s, 25 * s, "#38bdf8", 2 * s);
        fill(ctx, x + 3 * s, y - 80 * s, 14 * s, 25 * s, "#38bdf8", 2 * s);
        for (const a of [-17, 17]) {
          fill(ctx, x + a * s - 5 * s, y - 21 * s, 10 * s, 9 * s, "#fef08a", 4 * s);
        }
      } else if (o.type === "barrier") {
        fill(ctx, x - 31 * s, y - 34 * s, 62 * s, 34 * s, "#f3f4f6", 4 * s);
        for (let i = 0; i < 4; i++) {
          const xx = x - 31 * s + i * 17 * s;
          ctx.beginPath();
          ctx.moveTo(xx, y - 32 * s);
          ctx.lineTo(xx + 9 * s, y - 32 * s);
          ctx.lineTo(xx - 3 * s, y - 2 * s);
          ctx.lineTo(xx - 13 * s, y - 2 * s);
          ctx.fillStyle = "#ef4444";
          ctx.fill();
        }
      } else if (o.type === "sign") {
        fill(ctx, x - 35 * s, y - 82 * s, 70 * s, 16 * s, "#facc15", 4 * s);
        fill(ctx, x - 35 * s, y - 80 * s, 7 * s, 56 * s, "#94a3b8", 2 * s);
        fill(ctx, x + 28 * s, y - 80 * s, 7 * s, 56 * s, "#94a3b8", 2 * s);
        ctx.fillStyle = "#000";
        ctx.font = `bold ${Math.max(6, 9 * s)}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText("DANGER", x, y - 71 * s);
      }
    }

    // Smooth lane animation
    smoothLaneRef.current += (laneRef.current - smoothLaneRef.current) * 0.18;
    const px = xy(smoothLaneRef.current, 0.84).x;
    const j = jump > 0 ? Math.sin((1 - jump / 0.92) * Math.PI) * 90 : 0;
    const py = H - 106 - j + (slide > 0 ? 20 : 0);

    // Player shadow
    ctx.beginPath();
    ctx.ellipse(
      px,
      H - 45,
      Math.max(1, 28 * (1 - j / 180)),
      Math.max(1, 9 * (1 - j / 180)),
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(10, 5, 20, 0.6)";
    ctx.fill();

    // Player alien runner sprite
    ctx.save();
    ctx.translate(px, py);
    const scale = slide > 0 ? 0.65 : 1;
    ctx.scale(
      scale * (laneRef.current - smoothLaneRef.current > 0 ? 0.98 : 1),
      scale
    );
    ctx.rotate(Math.sin(clock * 15) * 0.045);

    if (hero && hero.complete && hero.naturalWidth > 0) {
      const hh = 155;
      ctx.drawImage(hero, -hh * 0.33, -hh * 0.67, hh * 0.66, hh);
    } else {
      // Fallback stylized alien runner graphic
      fill(ctx, -20, -54, 40, 72, "#a3e635", 12);
      fill(ctx, -14, -44, 29, 25, "#ff007f", 12);
    }
    ctx.restore();

    // Top subtle lane prompt
    ctx.textAlign = "center";
    ctx.font = "900 13px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("◀  SWITCH LANES  ▶", 240, 32);
  };

  const handleFail = useCallback(() => {
    stateRef.current = "over";
    setGameState("over");

    audioRef.current?.playCrash();

    const finalDist = Math.floor(distRef.current);
    const finalCoins = coinsRef.current;
    const earnedTickets = calculateTickets(finalDist, finalCoins);

    // Update and save best distance
    setHighScore((prev) => {
      const nextBest = Math.max(prev, finalDist);
      try {
        localStorage.setItem("subwaySurfersBest", nextBest.toString());
        localStorage.setItem("alienRunnerBest", nextBest.toString());
      } catch {
        // localStorage unavailable
      }
      return nextBest;
    });

    // Award real tickets to player wallet!
    if (earnedTickets > 0) {
      addTickets(earnedTickets);
      audioRef.current?.playTicketWin();
      setTicketAwardNotification(
        `🎉 +${earnedTickets} TICKETS DEPOSITED INTO YOUR WALLET!`
      );
    }
  }, [addTickets]);

  const gameLoop = useCallback(
    (now: number) => {
      if (stateRef.current !== "playing") return;

      const dt = Math.min(0.036, (now - lastTimeRef.current) / 1000 || 0);
      lastTimeRef.current = now;

      clockRef.current += dt;
      distRef.current += dt * speedRef.current * 112;
      speedRef.current = Math.min(0.93, 0.47 + clockRef.current * 0.004);
      jumpRef.current = Math.max(0, jumpRef.current - dt);
      slideRef.current = Math.max(0, slideRef.current - dt);
      spawnRef.current -= dt;

      // Spawning obstacles & coins
      if (spawnRef.current <= 0) {
        const l = Math.floor(Math.random() * 3);
        const r = Math.random();
        const type: Item["type"] =
          r < 0.38 ? "coin" : r < 0.6 ? "barrier" : r < 0.78 ? "sign" : "train";

        itemsRef.current.push({ lane: l, z: 0, type, hit: false });

        if (type !== "coin" && Math.random() < 0.65) {
          const others = [0, 1, 2].filter((x) => x !== l);
          itemsRef.current.push({
            lane: others[Math.floor(Math.random() * 2)],
            z: -0.08,
            type: "coin",
            hit: false,
          });
        }
        if (type === "coin" && Math.random() < 0.7) {
          itemsRef.current.push({
            lane: l,
            z: -0.11,
            type: "coin",
            hit: false,
          });
        }

        spawnRef.current = Math.max(0.57, 1.02 - clockRef.current * 0.0025);
      }

      // Movement & collision detection
      const currentLane = laneRef.current;
      const currentJump = jumpRef.current;
      const currentSlide = slideRef.current;

      for (const o of itemsRef.current) {
        o.z += speedRef.current * dt;

        if (o.z >= 0.85 && !o.hit) {
          o.hit = true;
          if (o.lane === currentLane) {
            if (o.type === "coin") {
              coinsRef.current += 1;
              audioRef.current?.playCoin();
            } else if (o.type === "barrier" && currentJump > 0.16) {
              // Successfully leaped over barrier!
            } else if (o.type === "sign" && currentSlide > 0.14) {
              // Successfully ducked under overhead sign!
            } else {
              // Collision!
              renderScene();
              setHudDistance(Math.floor(distRef.current));
              setHudCoins(coinsRef.current);
              setHudTickets(calculateTickets(distRef.current, coinsRef.current));
              handleFail();
              return;
            }
          }
        }
      }

      // Cleanup past items
      itemsRef.current = itemsRef.current.filter((x) => x.z < 1.16);

      // Render frame
      renderScene();

      // Update HUD state every few frames
      setHudDistance(Math.floor(distRef.current));
      setHudCoins(coinsRef.current);
      setHudTickets(calculateTickets(distRef.current, coinsRef.current));

      rafRef.current = requestAnimationFrame(gameLoop);
    },
    [handleFail]
  );

  const startGame = useCallback(() => {
    stateRef.current = "playing";
    setGameState("playing");
    setTicketAwardNotification(null);

    laneRef.current = 1;
    smoothLaneRef.current = 1;
    itemsRef.current = [];
    distRef.current = 0;
    coinsRef.current = 0;
    clockRef.current = 0;
    jumpRef.current = 0;
    slideRef.current = 0;
    speedRef.current = 0.47;
    spawnRef.current = 0.45;

    setHudDistance(0);
    setHudCoins(0);
    setHudTickets(0);

    lastTimeRef.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const pauseGame = useCallback(() => {
    if (stateRef.current === "playing") {
      stateRef.current = "paused";
      setGameState("paused");
      cancelAnimationFrame(rafRef.current);
    } else if (stateRef.current === "paused") {
      stateRef.current = "playing";
      setGameState("playing");
      lastTimeRef.current = performance.now();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  const moveLane = useCallback((dir: number) => {
    if (stateRef.current !== "playing") return;
    const nextLane = Math.max(0, Math.min(2, laneRef.current + dir));
    if (nextLane !== laneRef.current) {
      laneRef.current = nextLane;
      audioRef.current?.playMove();
    }
  }, []);

  const action = useCallback((type: "jump" | "slide") => {
    if (stateRef.current !== "playing") return;
    if (type === "jump" && jumpRef.current === 0 && slideRef.current === 0) {
      jumpRef.current = 0.92;
      audioRef.current?.playJump();
    }
    if (type === "slide" && slideRef.current === 0 && jumpRef.current === 0) {
      slideRef.current = 0.78;
      audioRef.current?.playSlide();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === "INPUT") return;

      const validKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Space",
        "KeyA",
        "KeyD",
        "KeyW",
        "KeyS",
        "KeyP",
      ];
      if (!validKeys.includes(e.code)) return;

      e.preventDefault();
      if (e.repeat) return;

      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          moveLane(-1);
          break;
        case "ArrowRight":
        case "KeyD":
          moveLane(1);
          break;
        case "ArrowUp":
        case "KeyW":
        case "Space":
          action("jump");
          break;
        case "ArrowDown":
        case "KeyS":
          action("slide");
          break;
        case "KeyP":
          pauseGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveLane, action, pauseGame]);

  // Touch and pointer swipe handlers
  const touchStartRef = useRef<[number, number] | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    touchStartRef.current = [e.clientX, e.clientY];
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current) return;
    const dx = e.clientX - touchStartRef.current[0];
    const dy = e.clientY - touchStartRef.current[1];

    if (Math.abs(dx) > 25 && Math.abs(dx) > Math.abs(dy)) {
      moveLane(dx > 0 ? 1 : -1);
    } else if (dy > 25) {
      action("slide");
    } else if (dy < -25 || (Math.abs(dx) <= 10 && Math.abs(dy) <= 10)) {
      action("jump");
    }
    touchStartRef.current = null;
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.enabled = next;
      }
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Game Outer Shell */}
      <div className="w-full max-w-[540px] bg-[#140d25] rounded-3xl border-4 border-[#00f0ff] shadow-[0_0_35px_rgba(0,240,255,0.45),0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden relative">
        
        {/* Top Header HUD Bar */}
        <div className="bg-[#100720] px-4 py-3 border-b-3 border-black flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">👽</span>
            <div>
              <div className="font-comic text-xl text-[#00f0ff] tracking-wide text-stroke-black-sm neon-glow-cyan leading-none">
                ALIEN SUBWAY RUNNER
              </div>
              <div className="text-[8px] font-pixel text-pink-400 mt-0.5">
                SUBWAY SURFERS EDITION
              </div>
            </div>
          </div>

          {/* Quick HUD Counters */}
          <div className="flex items-center gap-3 text-right font-comic text-sm sm:text-base">
            <div className="bg-black/70 px-2 py-1 rounded border border-cyan-400/40">
              <span className="text-[8px] font-pixel text-yellow-300 block -mb-1">
                DIST
              </span>
              <span className="text-white font-bold">{hudDistance}m</span>
            </div>

            <div className="bg-black/70 px-2 py-1 rounded border border-yellow-400/40">
              <span className="text-[8px] font-pixel text-yellow-300 block -mb-1">
                COINS
              </span>
              <span className="text-yellow-400 font-bold">{hudCoins}</span>
            </div>

            <div className="bg-black/70 px-2 py-1 rounded border border-lime-400/40">
              <span className="text-[8px] font-pixel text-lime-300 block -mb-1">
                TICKETS
              </span>
              <span className="text-lime-400 font-bold">🎟️ {hudTickets}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
              className="p-1.5 rounded-lg bg-black border border-pink-500/50 text-white hover:bg-pink-500/20 text-xs transition-colors"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>

        {/* Canvas & Overlay Display Container */}
        <div className="relative w-full aspect-[4/5] bg-[#25233e] flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={480}
            height={600}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="w-full h-full object-contain cursor-pointer touch-none block"
            aria-label="Subway Surfers Alien Runner Game Canvas"
          />

          {/* CRT scanline simulation */}
          <div className="absolute inset-0 pointer-events-none crt-overlay opacity-60" />

          {/* Interactive Modal Overlays (Ready / Paused / Game Over) */}
          {gameState !== "playing" && (
            <div className="absolute inset-0 bg-[#0c0716]/85 backdrop-blur-[2px] flex items-center justify-center p-4 z-20 text-center animate-in fade-in duration-150">
              <div className="max-w-[340px] w-full p-6 rounded-2xl border-4 border-black bg-[#160d29] shadow-[8px_8px_0_#000] space-y-4">
                
                {gameState === "ready" && (
                  <>
                    <div className="inline-block px-3 py-1 rounded-md border-2 border-black bg-yellow-400 text-black font-pixel text-[9px] uppercase tracking-widest font-bold">
                      RETRO ARCADE · SLOT #4
                    </div>

                    <div>
                      <h2 className="font-comic text-4xl sm:text-5xl font-black text-[#00f0ff] text-stroke-black leading-none neon-glow-cyan">
                        ALIEN RUNNER
                      </h2>
                      <p className="font-comic text-lg text-pink-400 mt-1">
                        SUBWAY SURFERS
                      </p>
                    </div>

                    <p className="text-[10px] font-pixel text-gray-300 leading-relaxed">
                      Switch lanes, dodge trains, jump barriers, slide under signs and collect golden coins!
                    </p>

                    {highScore > 0 && (
                      <div className="py-1 px-3 rounded-lg bg-black/80 border border-lime-400/50 font-pixel text-[10px] text-lime-400 flex items-center justify-center gap-1.5">
                        <span>🏆</span>
                        <span>BEST RUN: {highScore}m</span>
                      </div>
                    )}

                    <button
                      onClick={startGame}
                      className="w-full py-3 px-6 rounded-xl font-comic text-xl font-black border-3 border-black bg-yellow-400 hover:bg-lime-400 text-black shadow-[4px_4px_0_#ff007f] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5"
                    >
                      ▶ START GAME
                    </button>

                    <div className="text-[9px] font-pixel text-gray-400 leading-normal pt-1">
                      <div>← → A/D: Switch Lanes &nbsp;•&nbsp; ↑/W/Space: Jump</div>
                      <div>↓/S: Slide &nbsp;•&nbsp; Swipe on Mobile</div>
                    </div>
                  </>
                )}

                {gameState === "paused" && (
                  <>
                    <div className="inline-block px-3 py-1 rounded-md border-2 border-black bg-pink-500 text-white font-pixel text-[9px] uppercase tracking-widest font-bold">
                      GAME PAUSED
                    </div>

                    <h2 className="font-comic text-4xl font-black text-yellow-300 text-stroke-black">
                      TAKING A BREAK
                    </h2>

                    <p className="text-[10px] font-pixel text-gray-300 leading-relaxed">
                      Distance: <span className="text-white font-bold">{hudDistance}m</span> &nbsp;•&nbsp; Coins: <span className="text-yellow-400 font-bold">{hudCoins}</span>
                    </p>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={pauseGame}
                        className="w-full py-3 px-6 rounded-xl font-comic text-xl font-black border-3 border-black bg-lime-400 hover:bg-yellow-400 text-black shadow-[4px_4px_0_#ff007f] transition-all duration-150"
                      >
                        ▶ RESUME
                      </button>

                      <button
                        onClick={startGame}
                        className="w-full py-2 px-4 rounded-xl font-comic text-base font-bold border-2 border-black bg-black text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
                      >
                        ↻ RESTART RUN
                      </button>
                    </div>
                  </>
                )}

                {gameState === "over" && (
                  <>
                    <div className="inline-block px-3 py-1 rounded-md border-2 border-black bg-red-500 text-white font-pixel text-[9px] uppercase tracking-widest font-bold">
                      CRASHED!
                    </div>

                    <h2 className="font-comic text-4xl sm:text-5xl font-black text-pink-500 text-stroke-black leading-none">
                      GAME OVER
                    </h2>

                    <div className="bg-black/90 p-3 rounded-xl border-2 border-black space-y-1.5 text-xs font-pixel">
                      <div className="text-gray-300 flex justify-between">
                        <span>DISTANCE:</span>
                        <span className="text-white font-bold">{hudDistance}m</span>
                      </div>
                      <div className="text-gray-300 flex justify-between">
                        <span>COINS:</span>
                        <span className="text-yellow-400 font-bold">{hudCoins}</span>
                      </div>
                      <div className="text-gray-300 flex justify-between border-t border-gray-800 pt-1">
                        <span>TICKETS EARNED:</span>
                        <span className="text-lime-400 font-bold">🎟️ +{calculateTickets(hudDistance, hudCoins)}</span>
                      </div>
                      <div className="text-gray-300 flex justify-between">
                        <span>BEST RUN:</span>
                        <span className="text-pink-400 font-bold">{Math.max(highScore, hudDistance)}m</span>
                      </div>
                    </div>

                    {ticketAwardNotification && (
                      <div className="p-2.5 rounded-xl border-2 border-black bg-lime-400 text-black font-comic text-sm font-bold animate-bounce shadow-[3px_3px_0_#000]">
                        {ticketAwardNotification}
                      </div>
                    )}

                    <button
                      onClick={startGame}
                      className="w-full py-3 px-6 rounded-xl font-comic text-xl font-black border-3 border-black bg-lime-400 hover:bg-yellow-400 text-black shadow-[4px_4px_0_#ff007f] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5"
                    >
                      ↻ PLAY AGAIN
                    </button>
                  </>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Touch & On-Screen Arcade Controls */}
        <div className="bg-[#0f081c] p-3 border-t-3 border-black flex items-center justify-between gap-2">
          <button
            onClick={() => moveLane(-1)}
            aria-label="Move Left"
            className="flex-1 py-3 px-2 rounded-xl font-comic text-base font-bold bg-[#29233d] hover:bg-[#ff007f] hover:text-white text-gray-200 border-2 border-[#705a87] shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-colors"
          >
            ◀ LEFT
          </button>

          <button
            onClick={() => action("jump")}
            aria-label="Jump"
            className="flex-1 py-3 px-2 rounded-xl font-comic text-base font-bold bg-[#29233d] hover:bg-[#a3e635] hover:text-black text-gray-200 border-2 border-[#705a87] shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-colors"
          >
            ↑ JUMP
          </button>

          <button
            onClick={() => action("slide")}
            aria-label="Slide"
            className="flex-1 py-3 px-2 rounded-xl font-comic text-base font-bold bg-[#29233d] hover:bg-[#facc15] hover:text-black text-gray-200 border-2 border-[#705a87] shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-colors"
          >
            ↓ SLIDE
          </button>

          <button
            onClick={() => moveLane(1)}
            aria-label="Move Right"
            className="flex-1 py-3 px-2 rounded-xl font-comic text-base font-bold bg-[#29233d] hover:bg-[#00f0ff] hover:text-black text-gray-200 border-2 border-[#705a87] shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-colors"
          >
            RIGHT ▶
          </button>

          <button
            onClick={pauseGame}
            aria-label="Pause or Resume"
            className="w-12 py-3 rounded-xl font-comic text-base font-bold bg-[#3a1d47] hover:bg-yellow-400 hover:text-black text-yellow-300 border-2 border-[#86409e] shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-colors"
          >
            {gameState === "paused" ? "▶" : "Ⅱ"}
          </button>
        </div>

        {/* Footer payout guide */}
        <div className="bg-[#0b0515] py-2 px-3 border-t border-black text-center text-[9px] font-pixel text-gray-400">
          <span className="text-lime-400">100m = 1 Ticket</span> &nbsp;•&nbsp;{" "}
          <span className="text-yellow-400">10 Coins = 1 Ticket</span> &nbsp;•&nbsp;{" "}
          <span className="text-pink-400">Tickets add directly to your Header Wallet!</span>
        </div>

      </div>
    </div>
  );
}
