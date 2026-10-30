"use client";

import Link from "next/link";
import { MinesweeperGame } from "./MinesweeperGame";

export function MinesweeperSection() {
  return (
    <section className="relative rounded-2xl border-4 border-emerald-400 bg-[#0a111a]/90 neon-border-green p-6 sm:p-8 space-y-8 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-emerald-900/60 pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/50 bg-emerald-950/60 text-emerald-300 text-[10px] tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ★ FEATURED CABINET • LIVE ON THE FLOOR ★
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide flex items-center gap-3">
            <span>💣</span>
            <span className="text-emerald-400 neon-glow-green">MINESWEEPER</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Engineered by <span className="text-emerald-400 font-bold">Letian</span>. Scan the retro danger zone, calculate blast radiuses, flag hidden explosives, and sweep the board to claim jackpot arcade tickets!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/games/minesweeper"
            className="px-4 py-2.5 rounded-lg font-pixel text-xs font-bold border-2 border-emerald-400 bg-emerald-500/20 hover:bg-emerald-400 hover:text-black text-emerald-300 transition-all duration-150 shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95 flex items-center gap-2"
          >
            <span>🕹️</span>
            <span>ENTER FULL CABINET</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area: Playable Game & Stats / Info */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Playable Game Column */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <MinesweeperGame />
        </div>

        {/* Tactical Info & Mission Briefing Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Mission Dossier Card */}
          <div className="p-4 rounded-xl border-2 border-gray-800 bg-[#060a12]/80 space-y-3">
            <div className="text-xs font-bold text-yellow-400 flex items-center gap-1.5 border-b border-gray-800 pb-2">
              <span>📋</span>
              <span>MISSION BRIEFING</span>
            </div>

            <div className="space-y-2 text-[10px] text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">1. Dig Safely:</strong> Click tiles to reveal terrain. The first click is guaranteed safe with an opening burst.
              </p>
              <p>
                <strong className="text-white">2. Read the Clues:</strong> Numbers display how many bombs touch that specific cell (diagonals count!).
              </p>
              <p>
                <strong className="text-white">3. Plant Flags:</strong> Right-click (or toggle Flag mode 🚩) to mark suspects and avoid accidental detonations.
              </p>
              <p>
                <strong className="text-white">4. Cash Out:</strong> Defuse all mines to instantly win tickets directly deposited to your header wallet!
              </p>
            </div>
          </div>

          {/* Ticket Rewards Table */}
          <div className="p-4 rounded-xl border-2 border-emerald-900/50 bg-[#060a12]/80 space-y-3">
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="flex items-center gap-1.5">
                <span>🎟️</span> REWARD TIERS
              </span>
              <span className="text-[9px] text-gray-500 font-mono">INSTANT PAYOUT</span>
            </div>

            <div className="space-y-2 text-[10px]">
              <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-gray-800">
                <span className="text-gray-300">EASY (8x8, 10 Mines)</span>
                <span className="text-yellow-400 font-bold">+30 🎟️</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-gray-800">
                <span className="text-gray-300">MEDIUM (10x10, 18 Mines)</span>
                <span className="text-yellow-400 font-bold">+50 🎟️</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-gray-800">
                <span className="text-gray-300">EXPERT (12x12, 30 Mines)</span>
                <span className="text-yellow-400 font-bold">+80 🎟️</span>
              </div>
            </div>
          </div>

          {/* Machine Specs */}
          <div className="p-3 rounded-lg border border-gray-800/80 bg-black/40 flex items-center justify-between text-[9px] text-gray-400">
            <span>DEVELOPER: <strong className="text-emerald-400">LETIAN</strong></span>
            <span>GENRE: <strong className="text-white">PUZZLE / LOGIC</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
