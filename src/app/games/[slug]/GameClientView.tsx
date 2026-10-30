"use client";

import { useState } from "react";
import Link from "next/link";
import { ArcadeGame } from "@/types/game";
import { useTickets } from "@/context/TicketContext";
import { SubwaySurfersGame } from "@/components/games/SubwaySurfersGame";

interface GameClientViewProps {
  game: ArcadeGame;
}

export function GameClientView({ game }: GameClientViewProps) {
  const { addTickets } = useTickets();
  const [ticketAwardMessage, setTicketAwardMessage] = useState<string | null>(null);

  const handleSimulateWin = () => {
    const reward = 35;
    addTickets(reward);
    setTicketAwardMessage(`+${reward} TICKETS EARNED! CHECK YOUR WALLET IN THE HEADER!`);
    setTimeout(() => {
      setTicketAwardMessage(null);
    }, 4000);
  };

  const isSubwaySurfers = game.id === "subway-surfers";

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-comic text-base text-lime-400 hover:text-white transition-colors py-1.5 px-4 rounded-xl border-3 border-black bg-black/80 shadow-[3px_3px_0_#ff0080]"
        >
          <span>←</span>
          <span>BACK TO ARCADE FLOOR</span>
        </Link>

        <span className="font-comic text-base px-4 py-1.5 rounded-xl border-3 border-black bg-pink-500 text-white shadow-[3px_3px_0_#a3e635]">
          DEV: {game.developer}
        </span>
      </div>

      {/* Arcade Cabinet Screen Simulation */}
      <div className="rounded-3xl border-5 border-black bg-[#0d0214] shadow-[10px_10px_0_#000] overflow-hidden">
        
        {/* Cabinet Marquee Header */}
        <div className="p-4 sm:p-6 bg-[#180525] border-b-4 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-pixel text-pink-400 mb-1">
              <span>CABINET: {game.genre.toUpperCase()}</span>
              <span>•</span>
              <span>SLUG: {game.id}</span>
              {isSubwaySurfers && (
                <span className="text-lime-400 font-bold ml-2">● LIVE READY</span>
              )}
            </div>
            <h1 className="font-comic text-4xl sm:text-5xl font-black text-lime-400 text-stroke-black leading-tight tracking-wide">
              {game.title}
            </h1>
            <p className="font-comic text-lg text-pink-300 mt-0.5">
              {game.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-comic text-xl text-yellow-300 border-3 border-black bg-yellow-400/20 px-4 py-2 rounded-xl flex items-center gap-2 shadow-[3px_3px_0_#000]">
              <span>🎟️</span>
              <span>{game.payout}</span>
            </span>
          </div>
        </div>

        {/* CRT Arcade Display Screen */}
        <div className="p-4 sm:p-8 bg-black crt-overlay min-h-[380px] flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Neon airbrush halo */}
          <div className="absolute inset-0 bg-radial from-pink-500/20 via-transparent to-transparent pointer-events-none" />

          {isSubwaySurfers ? (
            /* Fully Playable Subway Surfers Game */
            <div className="relative z-10 w-full flex justify-center py-2">
              <SubwaySurfersGame />
            </div>
          ) : (
            /* Coming Soon Placeholder for other unbuilt machines */
            <div className="relative z-10 max-w-lg space-y-6">
              
              {/* Animated Cabinet Icon */}
              <div className="text-5xl sm:text-6xl tracking-widest filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse">
                {game.cabinetArt}
              </div>

              {/* COMING SOON BANNER */}
              <div className="space-y-3">
                <div className="inline-block px-5 py-2 rounded-xl border-3 border-black bg-pink-500 text-white font-comic text-xl sm:text-2xl font-bold tracking-wider transform -rotate-2 shadow-[4px_4px_0_#a3e635] retro-blink">
                  ★ COMING SOON ★
                </div>
                <p className="font-comic text-2xl text-lime-400 text-stroke-black-sm">
                  STAGE 1 UNDER CONSTRUCTION
                </p>
                <p className="text-[11px] font-pixel text-gray-300 leading-relaxed max-w-md mx-auto">
                  {game.description}
                </p>
              </div>

              {/* Teammate instructions box inside cabinet */}
              <div className="p-4 rounded-xl border-3 border-black bg-[#150522] text-[10px] font-pixel text-gray-200 text-left space-y-2 shadow-[4px_4px_0_#000]">
                <div className="text-lime-400 font-comic text-base flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>FOR {game.developer.toUpperCase()}: BUILD YOUR GAME COMPONENT HERE</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Replace this placeholder with your game canvas, loop, or React UI inside:
                </p>
                <div className="p-2 rounded bg-black font-mono text-[9px] text-yellow-300 border border-gray-800 overflow-x-auto">
                  src/app/games/[slug]/GameClientView.tsx
                </div>
              </div>

              {/* Simulated Reward Button to test Ticket Wallet */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSimulateWin}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-comic text-lg font-bold border-3 border-black bg-lime-400 hover:bg-yellow-400 hover:text-black text-black transition-all duration-200 shadow-[4px_4px_0_#ff0080] active:translate-x-0.5 active:translate-y-0.5"
                >
                  🎮 TEST WIN: EARN +35 TICKETS
                </button>
                
                {ticketAwardMessage && (
                  <div className="p-2.5 rounded-xl border-2 border-black bg-lime-400 text-black font-comic text-sm animate-bounce shadow-[3px_3px_0_#000]">
                    ✨ {ticketAwardMessage}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Cabinet Bottom Control Panel */}
        <div className="p-4 bg-[#0a0110] border-t-4 border-black flex flex-wrap items-center justify-between gap-3 text-xs font-pixel">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">CONTROLS:</span>
            <span className="px-2 py-1 rounded border border-gray-800 bg-gray-900 text-gray-300">ARROWS / WASD</span>
            <span className="px-2 py-1 rounded border border-pink-700 bg-pink-950 text-pink-300">SPACEBAR</span>
            <span className="px-2 py-1 rounded border border-cyan-800 bg-cyan-950 text-cyan-300">SWIPE / TOUCH</span>
          </div>

          <Link
            href="/shop"
            className="font-comic text-base text-pink-400 hover:text-pink-300 flex items-center gap-1.5 transition-colors"
          >
            <span>CASH IN TICKETS AT PRIZE SHOP →</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
