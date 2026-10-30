"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from "react";
import { useTickets } from "@/context/TicketContext";

export type Difficulty = "easy" | "medium" | "hard";

interface DifficultyConfig {
  name: string;
  rows: number;
  cols: number;
  mines: number;
  reward: number;
}

const CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { name: "EASY", rows: 8, cols: 8, mines: 10, reward: 30 },
  medium: { name: "MEDIUM", rows: 10, cols: 10, mines: 18, reward: 50 },
  hard: { name: "EXPERT", rows: 12, cols: 12, mines: 30, reward: 80 },
};

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

interface MinesweeperGameProps {
  compact?: boolean;
}

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

// Pure Helper: create empty grid
function createEmptyBoard(rows: number, cols: number): Cell[][] {
  const newBoard: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        r,
        c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }
    newBoard.push(row);
  }
  return newBoard;
}

// Pure Helper: generate random minefield ensuring first click & its surroundings are safe
function generateMines(startR: number, startC: number, cfg: DifficultyConfig): Cell[][] {
  const newBoard = createEmptyBoard(cfg.rows, cfg.cols);
  const positions: [number, number][] = [];

  for (let r = 0; r < cfg.rows; r++) {
    for (let c = 0; c < cfg.cols; c++) {
      if (Math.abs(r - startR) <= 1 && Math.abs(c - startC) <= 1) {
        continue;
      }
      positions.push([r, c]);
    }
  }

  // Fallback if needed
  if (positions.length < cfg.mines) {
    positions.length = 0;
    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        if (r === startR && c === startC) continue;
        positions.push([r, c]);
      }
    }
  }

  // Shuffle positions (Fisher-Yates)
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Assign mines
  for (let i = 0; i < cfg.mines; i++) {
    const [mr, mc] = positions[i];
    newBoard[mr][mc].isMine = true;
  }

  // Calculate neighbor counts
  for (let r = 0; r < cfg.rows; r++) {
    for (let c = 0; c < cfg.cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < cfg.rows && nc >= 0 && nc < cfg.cols && newBoard[nr][nc].isMine) {
          count++;
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

// Web Audio API Retro Sound FX Generator
function play8BitSound(type: "click" | "flag" | "explode" | "win" | "chord", isMuted: boolean) {
  if (isMuted || typeof window === "undefined") return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === "flag") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "chord") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "explode") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === "win") {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.12);
      });
    }
  } catch {
    // Ignore audio permission or context restrictions
  }
}

const BEST_TIMES_STORAGE_KEY = "minesweeper_best_times";
const BEST_TIMES_EVENT = "minesweeper_best_times_updated";

const DEFAULT_BEST_TIMES: Record<Difficulty, number | null> = {
  easy: null,
  medium: null,
  hard: null,
};

function subscribeBestTimes(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(BEST_TIMES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(BEST_TIMES_EVENT, callback);
  };
}

function getBestTimesSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(BEST_TIMES_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function getServerBestTimesSnapshot(): string {
  return "";
}

export function MinesweeperGame({ compact = false }: MinesweeperGameProps) {
  const { addTickets } = useTickets();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const config = CONFIGS[difficulty];

  const [board, setBoard] = useState<Cell[][]>(() => createEmptyBoard(CONFIGS.easy.rows, CONFIGS.easy.cols));
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [flagCount, setFlagCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [mode, setMode] = useState<"dig" | "flag">("dig");
  const [detonatedCell, setDetonatedCell] = useState<{ r: number; c: number } | null>(null);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const rawBestTimes = useSyncExternalStore(subscribeBestTimes, getBestTimesSnapshot, getServerBestTimesSnapshot);
  const bestTimes = useMemo<Record<Difficulty, number | null>>(() => {
    if (!rawBestTimes) return DEFAULT_BEST_TIMES;
    try {
      return JSON.parse(rawBestTimes) as Record<Difficulty, number | null>;
    } catch {
      return DEFAULT_BEST_TIMES;
    }
  }, [rawBestTimes]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saveBestTime = useCallback((diff: Difficulty, time: number) => {
    const current = (() => {
      try {
        const raw = localStorage.getItem(BEST_TIMES_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Record<Difficulty, number | null>) : DEFAULT_BEST_TIMES;
      } catch {
        return DEFAULT_BEST_TIMES;
      }
    })();

    const currentBest = current[diff];
    if (currentBest === null || time < currentBest) {
      const updated = { ...current, [diff]: time };
      try {
        localStorage.setItem(BEST_TIMES_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(BEST_TIMES_EVENT));
      } catch {
        // Ignore
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBoard(createEmptyBoard(config.rows, config.cols));
    setGameStatus("idle");
    setFlagCount(0);
    setTimer(0);
    setDetonatedCell(null);
    setRewardNotice(null);
    setIsPressing(false);
  }, [config.rows, config.cols]);

  const handleDifficultySelect = (d: Difficulty) => {
    setDifficulty(d);
    const cfg = CONFIGS[d];
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBoard(createEmptyBoard(cfg.rows, cfg.cols));
    setGameStatus("idle");
    setFlagCount(0);
    setTimer(0);
    setDetonatedCell(null);
    setRewardNotice(null);
    setIsPressing(false);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "r" || e.key === "R") {
        resetGame();
      } else if (e.key === "d" || e.key === "D") {
        setMode("dig");
      } else if (e.key === "f" || e.key === "F") {
        setMode("flag");
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted((m) => !m);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetGame]);

  // Timer interval handling
  useEffect(() => {
    if (gameStatus === "playing") {
      timerRef.current = setInterval(() => {
        setTimer((t) => (t >= 999 ? 999 : t + 1));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus]);

  // Check victory condition
  const checkVictory = (currentBoard: Cell[][], cfg: DifficultyConfig, currentTimer: number) => {
    let unrevealedSafeCount = 0;
    for (let r = 0; r < cfg.rows; r++) {
      for (let c = 0; c < cfg.cols; c++) {
        const cell = currentBoard[r][c];
        if (!cell.isMine && !cell.isRevealed) {
          unrevealedSafeCount++;
        }
      }
    }

    if (unrevealedSafeCount === 0) {
      setGameStatus("won");
      play8BitSound("win", isMuted);

      // Auto-flag all mines
      const finalBoard = currentBoard.map((row) =>
        row.map((cell) => (cell.isMine ? { ...cell, isFlagged: true } : cell))
      );
      setBoard(finalBoard);
      setFlagCount(cfg.mines);

      // Save Best Time
      saveBestTime(difficulty, currentTimer);

      // Add arcade tickets
      addTickets(cfg.reward);
      setRewardNotice(`JACKPOT! MINEFIELD DEFUSED IN ${currentTimer}s! +${cfg.reward} ARCADE TICKETS AWARDED! 🎟️`);
    }
  };

  // Reveal cell with flood fill
  const handleReveal = (r: number, c: number) => {
    if (gameStatus === "won" || gameStatus === "lost") return;

    let currentBoard = board;
    if (gameStatus === "idle") {
      currentBoard = generateMines(r, c, config);
      setGameStatus("playing");
    }

    const cell = currentBoard[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    // Hit a mine -> Game Over
    if (cell.isMine) {
      play8BitSound("explode", isMuted);
      setDetonatedCell({ r, c });
      setGameStatus("lost");
      const revealedMinesBoard = currentBoard.map((row) =>
        row.map((cl) => {
          if (cl.isMine) {
            return { ...cl, isRevealed: true };
          }
          return cl;
        })
      );
      setBoard(revealedMinesBoard);
      return;
    }

    play8BitSound("click", isMuted);

    // Flood fill
    const newBoard = currentBoard.map((row) => row.map((cl) => ({ ...cl })));
    const queue: [number, number][] = [[r, c]];
    newBoard[r][c].isRevealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const currCell = newBoard[currR][currC];

      if (currCell.neighborMines === 0) {
        for (const [dr, dc] of DIRECTIONS) {
          const nr = currR + dr;
          const nc = currC + dc;
          if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
            const neighbor = newBoard[nr][nc];
            if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
              neighbor.isRevealed = true;
              if (neighbor.neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);
    checkVictory(newBoard, config, timer);
  };

  // Chording: Clicking on an already revealed number when neighbors are flagged
  const handleChord = (r: number, c: number) => {
    if (gameStatus !== "playing") return;
    const cell = board[r]?.[c];
    if (!cell || !cell.isRevealed || cell.neighborMines === 0) return;

    // Count adjacent flags
    let adjacentFlags = 0;
    for (const [dr, dc] of DIRECTIONS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
        if (board[nr][nc].isFlagged) adjacentFlags++;
      }
    }

    if (adjacentFlags === cell.neighborMines) {
      play8BitSound("chord", isMuted);
      let hitMine = false;
      let explodedAt: { r: number; c: number } | null = null;
      const newBoard = board.map((row) => row.map((cl) => ({ ...cl })));
      const queue: [number, number][] = [];

      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          const neighbor = newBoard[nr][nc];
          if (!neighbor.isRevealed && !neighbor.isFlagged) {
            if (neighbor.isMine) {
              hitMine = true;
              explodedAt = { r: nr, c: nc };
            } else {
              neighbor.isRevealed = true;
              if (neighbor.neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }

      if (hitMine && explodedAt) {
        play8BitSound("explode", isMuted);
        setDetonatedCell(explodedAt);
        setGameStatus("lost");
        const revealedMines = newBoard.map((row) =>
          row.map((cl) => (cl.isMine ? { ...cl, isRevealed: true } : cl))
        );
        setBoard(revealedMines);
        return;
      }

      // Continue cascade for any 0s uncovered by chording
      while (queue.length > 0) {
        const [currR, currC] = queue.shift()!;
        const currCell = newBoard[currR][currC];
        if (currCell.neighborMines === 0) {
          for (const [dr, dc] of DIRECTIONS) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
              const neighbor = newBoard[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }

      setBoard(newBoard);
      checkVictory(newBoard, config, timer);
    }
  };

  // Toggle flag on cell
  const handleToggleFlag = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (gameStatus === "won" || gameStatus === "lost") return;

    const cell = board[r]?.[c];
    if (!cell || cell.isRevealed) return;

    const newBoard = board.map((row) => row.map((cl) => ({ ...cl })));
    const target = newBoard[r][c];

    if (!target.isFlagged) {
      target.isFlagged = true;
      setFlagCount((fc) => fc + 1);
      play8BitSound("flag", isMuted);
    } else {
      target.isFlagged = false;
      setFlagCount((fc) => Math.max(0, fc - 1));
      play8BitSound("flag", isMuted);
    }

    setBoard(newBoard);
  };

  const handleCellClick = (r: number, c: number) => {
    const cell = board[r]?.[c];
    if (!cell) return;

    if (cell.isRevealed) {
      // Trigger chording on already revealed numbered cells
      handleChord(r, c);
      return;
    }

    if (mode === "flag") {
      handleToggleFlag(r, c);
    } else {
      handleReveal(r, c);
    }
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1:
        return "text-cyan-400 font-bold";
      case 2:
        return "text-emerald-400 font-bold";
      case 3:
        return "text-red-400 font-bold";
      case 4:
        return "text-purple-400 font-bold";
      case 5:
        return "text-amber-500 font-bold";
      case 6:
        return "text-teal-300 font-bold";
      case 7:
        return "text-pink-400 font-bold";
      case 8:
        return "text-gray-300 font-bold";
      default:
        return "text-white";
    }
  };

  const getFaceIcon = () => {
    if (gameStatus === "won") return "😎";
    if (gameStatus === "lost") return "😵";
    if (isPressing) return "😮";
    return "🙂";
  };

  const remainingMines = Math.max(-99, config.mines - flagCount);
  const formattedMines = remainingMines < 0
    ? `-${Math.abs(remainingMines).toString().padStart(2, "0")}`
    : remainingMines.toString().padStart(3, "0");
  const formattedTimer = timer.toString().padStart(3, "0");

  const currentBest = bestTimes[difficulty];

  return (
    <div className="flex flex-col items-center select-none w-full max-w-full">
      {/* Reward Alert Banner */}
      {rewardNotice && (
        <div className="mb-4 w-full max-w-lg p-3 rounded-xl border-2 border-yellow-400 bg-yellow-950/95 text-yellow-300 text-xs font-pixel text-center shadow-[0_0_25px_rgba(255,230,0,0.6)] animate-bounce">
          {rewardNotice}
        </div>
      )}

      {/* Control Toolbar: Difficulty, Tool Mode, Sound Toggle, High Score */}
      <div className="w-full max-w-lg mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Difficulty buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-gray-800 bg-[#0e0e1f]">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleDifficultySelect(d)}
              className={`px-2.5 py-1 rounded text-[10px] font-pixel transition-all ${
                difficulty === d
                  ? "bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {CONFIGS[d].name}
            </button>
          ))}
        </div>

        {/* Input Mode Switcher & Sound Mute Toggle */}
        <div className="flex items-center gap-2">
          {/* Dig / Flag Mode */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-gray-800 bg-[#0e0e1f]">
            <button
              type="button"
              onClick={() => setMode("dig")}
              className={`px-2.5 py-1 rounded text-[10px] font-pixel flex items-center gap-1 transition-all ${
                mode === "dig"
                  ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Dig Mode [D]: Click reveals tiles"
            >
              <span>⛏️</span>
              <span>DIG</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("flag")}
              className={`px-2.5 py-1 rounded text-[10px] font-pixel flex items-center gap-1 transition-all ${
                mode === "flag"
                  ? "bg-pink-500 text-white font-bold shadow-[0_0_10px_rgba(255,0,127,0.5)]"
                  : "text-gray-400 hover:text-white"
              }`}
              title="Flag Mode [F]: Click marks suspected mines"
            >
              <span>🚩</span>
              <span>FLAG</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            className="p-1.5 rounded-lg border border-gray-800 bg-[#0e0e1f] text-gray-400 hover:text-white text-xs font-pixel"
            title={isMuted ? "Unmute 8-Bit Audio [M]" : "Mute 8-Bit Audio [M]"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Retro Classic Cabinet Console Container */}
      <div className="inline-block p-4 sm:p-6 rounded-2xl border-4 border-emerald-500/80 bg-[#101524] shadow-[0_0_35px_rgba(16,185,129,0.35)] relative overflow-hidden">
        
        {/* Top Status Bar (LED display + Smiley) */}
        <div className="mb-4 p-3 rounded-xl border-2 border-gray-800 bg-[#080b14] flex items-center justify-between gap-4 shadow-inner">
          {/* LED Mines Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black border border-red-950 font-mono text-red-500 text-lg sm:text-2xl font-bold tracking-widest shadow-[0_0_12px_rgba(239,68,68,0.4)]">
            <span className="text-xs text-red-700">💣</span>
            <span>{formattedMines}</span>
          </div>

          {/* Smiley Reset Button */}
          <button
            type="button"
            onClick={resetGame}
            className="w-11 h-11 rounded-lg border-2 border-yellow-400 bg-yellow-400/20 hover:bg-yellow-400 hover:scale-105 active:scale-95 flex items-center justify-center text-2xl transition-all shadow-[0_0_15px_rgba(255,230,0,0.3)]"
            title="Reset Game [R]"
          >
            {getFaceIcon()}
          </button>

          {/* LED Timer Display */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black border border-red-950 font-mono text-red-500 text-lg sm:text-2xl font-bold tracking-widest shadow-[0_0_12px_rgba(239,68,68,0.4)]">
            <span>{formattedTimer}</span>
            <span className="text-xs text-red-700">⏱️</span>
          </div>
        </div>

        {/* The Minefield Grid */}
        <div
          className="inline-grid gap-1 p-2.5 rounded-xl border-2 border-emerald-950 bg-black shadow-inner overflow-x-auto max-w-full"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          }}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => setIsPressing(false)}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isDetonated = detonatedCell?.r === r && detonatedCell?.c === c;
              const tileSize = compact ? "32px" : "38px";

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleToggleFlag(r, c, e)}
                  disabled={gameStatus === "won" || gameStatus === "lost"}
                  style={{
                    width: tileSize,
                    height: tileSize,
                    minWidth: tileSize,
                    minHeight: tileSize,
                  }}
                  className={`
                    flex items-center justify-center font-pixel text-xs sm:text-sm font-bold transition-transform duration-75 select-none rounded-sm
                    ${
                      cell.isRevealed
                        ? isDetonated
                          ? "bg-red-600 text-white border-2 border-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                          : cell.isMine
                          ? "bg-red-950/70 border border-red-800 text-red-400"
                          : "bg-[#181d2e] border border-gray-800 text-gray-200"
                        : "bg-[#252c42] hover:bg-[#313955] border-t-2 border-l-2 border-gray-400 border-b-2 border-r-2 border-gray-900 active:border-gray-700 active:bg-[#1a2033] shadow-sm"
                    }
                  `}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      <span className="text-sm">💣</span>
                    ) : cell.neighborMines > 0 ? (
                      <span className={getNumberColor(cell.neighborMines)}>
                        {cell.neighborMines}
                      </span>
                    ) : (
                      ""
                    )
                  ) : cell.isFlagged ? (
                    <span className="text-sm filter drop-shadow">🚩</span>
                  ) : (
                    ""
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info: Shortcuts, Personal Best, Reward Pot */}
        <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[9px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">●</span>
            <span>CHORDING: CLICK REVEALED NUMBER</span>
          </div>

          <div className="flex items-center gap-3">
            {currentBest !== null && (
              <span className="text-cyan-400">
                BEST: {currentBest}s 🏆
              </span>
            )}
            <span className="text-yellow-400 font-bold">
              POT: {config.reward} 🎟️
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
