"use client";

import { useState } from "react";
import Link from "next/link";
import { ArcadeGame } from "@/types/game";
import { useTickets } from "@/context/TicketContext";
import { MinesweeperGame } from "@/components/MinesweeperGame";

interface GameClientViewProps {
  game: ArcadeGame;
}

export function GameClientView({ game }: GameClientViewProps) {
  const { addTickets } = useTickets();
  const [ticketAwardMessage, setTicketAwardMessage] = useState<string | null>(null);

  const handleSimulateWin = () => {
    const reward = 30;
    addTickets(reward);
    setTicketAwardMessage(`+${reward} TICKETS EARNED! CHECK YOUR WALLET IN THE HEADER!`);
    setTimeout(() => {
      setTicketAwardMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors py-1 px-3 rounded border border-gray-800 bg-gray-900/60"
        >
          <span>←</span>
          <span>BACK TO ARCADE FLOOR</span>
        </Link>

        <span className={`text-[10px] px-3 py-1 rounded border ${game.themeColor.border} ${game.themeColor.text} bg-black/50`}>
          ASSIGNED TO: {game.developer}
        </span>
      </div>

      {/* Arcade Cabinet Screen Simulation */}
      <div className={`rounded-2xl border-4 ${game.themeColor.border} bg-[#0a0a18] ${game.themeColor.shadow} overflow-hidden`}>
        
        {/* Cabinet Marquee Header */}
        <div className="p-4 sm:p-6 bg-[#121228] border-b-2 border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
              <span>CABINET: {game.genre}</span>
              <span>•</span>
              <span>SLUG: {game.id}</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-wider ${game.themeColor.text}`}>
              {game.title}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {game.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-yellow-400 border border-yellow-400/40 bg-yellow-950/40 px-3 py-1.5 rounded flex items-center gap-1.5">
              <span>🎟️</span>
              <span>REWARD: {game.payout}</span>
            </span>
          </div>
        </div>

        {/* CRT Arcade Display Screen */}
        <div className="p-6 sm:p-12 bg-black crt-overlay min-h-[380px] flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Subtle grid in cabinet */}
          <div className="absolute inset-0 arcade-grid-bg opacity-30 pointer-events-none" />

          {game.id === "minesweeper" ? (
            <div className="relative z-10 w-full py-2 flex flex-col items-center">
              <MinesweeperGame />
            </div>
          ) : (
            <div className="relative z-10 max-w-lg space-y-6">
              {/* Animated Cabinet Icon */}
              <div className="text-5xl sm:text-6xl tracking-widest filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse">
                {game.cabinetArt}
              </div>

              {/* COMING SOON BANNER */}
              <div className="space-y-3">
                <div className="inline-block px-4 py-2 rounded-lg border-2 border-pink-500 bg-pink-950/90 text-pink-300 text-sm sm:text-base font-bold tracking-widest retro-blink shadow-[0_0_20px_rgba(255,0,127,0.6)]">
                  ★ COMING SOON ★
                </div>
                <p className="text-xs sm:text-sm text-yellow-300 neon-glow-yellow">
                  STAGE 1 UNDER CONSTRUCTION
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-md mx-auto">
                  {game.description}
                </p>
              </div>

              {/* Teammate instructions box inside cabinet */}
              <div className="p-4 rounded-lg border border-gray-800 bg-gray-950/80 text-[10px] text-gray-300 text-left space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>FOR {game.developer.toUpperCase()}: READY FOR YOUR GAME CODE</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  When you are ready to build this game, replace this Coming Soon placeholder in:
                </p>
                <div className="p-2 rounded bg-black font-mono text-[9px] text-yellow-300 border border-gray-800 overflow-x-auto">
                  src/app/games/[slug]/GameClientView.tsx
                </div>
              </div>

              {/* Simulated Reward Button to test Ticket Wallet */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSimulateWin}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg font-pixel text-xs font-bold border-2 border-yellow-400 bg-yellow-400/10 hover:bg-yellow-400 hover:text-black text-yellow-300 transition-all duration-200 shadow-[0_0_15px_rgba(255,230,0,0.3)] active:scale-95"
                >
                  🎮 TEST WIN: EARN +30 TICKETS
                </button>
                
                {ticketAwardMessage && (
                  <div className="p-2 rounded border border-green-500 bg-green-950/80 text-green-300 text-[10px] animate-bounce">
                    ✨ {ticketAwardMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cabinet Bottom Control Panel */}
        <div className="p-4 bg-[#0c0c1b] border-t-2 border-gray-800 flex flex-wrap items-center justify-between gap-3 text-[10px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-500">CONTROLS:</span>
            {game.id === "minesweeper" ? (
              <>
                <span className="px-2 py-1 rounded bg-gray-800 text-gray-300">CLICK [DIG]</span>
                <span className="px-2 py-1 rounded bg-pink-900/60 text-pink-300 border border-pink-700">RIGHT-CLICK / F [FLAG]</span>
                <span className="px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">R [RESET]</span>
                <span className="px-2 py-1 rounded bg-yellow-900/60 text-yellow-300 border border-yellow-700">M [MUTE]</span>
              </>
            ) : (
              <>
                <span className="px-2 py-1 rounded bg-gray-800 text-gray-300">JOYSTICK [ARROWS]</span>
                <span className="px-2 py-1 rounded bg-pink-900/60 text-pink-300 border border-pink-700">BUTTON A [SPACE]</span>
              </>
            )}
          </div>

          <Link
            href="/shop"
            className="text-pink-400 hover:text-pink-300 flex items-center gap-1.5 transition-colors"
          >
            <span>CASH IN TICKETS AT PRIZE SHOP</span>
            <span>→</span>
          </Link>
        </div>

      </div>

      {/* Minesweeper Additional Cabinet Dossier */}
      {game.id === "minesweeper" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px]">
          <div className="p-4 rounded-xl border-2 border-emerald-900/60 bg-[#070d18] space-y-2">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span>🎯</span>
              <span>TACTICAL CHORDING</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Once you reveal a number, flag all suspected bombs around it. Click the revealed number again to instantly reveal all other adjacent tiles!
            </p>
          </div>

          <div className="p-4 rounded-xl border-2 border-yellow-900/60 bg-[#141005] space-y-2">
            <div className="text-yellow-400 font-bold flex items-center gap-1.5">
              <span>🎟️</span>
              <span>JACKPOT PAYOUTS</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Defusing the minefield awards tickets directly to your header wallet: <strong className="text-white">Easy +30 🎟️</strong>, <strong className="text-white">Medium +50 🎟️</strong>, <strong className="text-white">Expert +80 🎟️</strong>!
            </p>
          </div>

          <div className="p-4 rounded-xl border-2 border-cyan-900/60 bg-[#051118] space-y-2">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span>🕹️</span>
              <span>8-BIT SYNTH AUDIO</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Features real-time synthesized retro audio blips, flags, sweeps, explosions, and victory fanfares. Press <strong className="text-white">M</strong> anytime to mute.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
