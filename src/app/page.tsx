"use client";

import { useState } from "react";
import Link from "next/link";
import { GAMES } from "@/data/games";
import { MinesweeperSection } from "@/components/MinesweeperSection";
import { CupcakeAttackPoster } from "@/components/CupcakeAttackPoster";
import { ArcadeHome } from "@/components/arcade/ArcadeHome";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"poster" | "3d">("poster");

  if (viewMode === "3d") {
    return (
      <div className="relative">
        {/* Floating toggle back to poster view */}
        <div className="absolute top-4 left-4 z-50">
          <button
            type="button"
            onClick={() => setViewMode("poster")}
            className="px-4 py-2 rounded-xl border-3 border-black bg-lime-400 text-black font-comic text-base font-bold shadow-[3px_3px_0_#ff0080] hover:bg-lime-300 transition-transform active:scale-95 cursor-pointer"
          >
            ← BACK TO CUPCAKE ATTACK POSTER
          </button>
        </div>
        <ArcadeHome />
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      
      {/* ============================================================ */}
      {/* 🧁 CUPCAKE ATTACK HERO POSTER (EXACT LAYOUT FROM PICTURE) */}
      {/* ============================================================ */}
      <section className="relative flex flex-col items-center">
        
        {/* Top Floating Badge & View Switcher */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-block transform -rotate-1 hover:rotate-0 transition-transform">
            <span className="px-4 py-1.5 rounded-xl border-3 border-black bg-yellow-400 text-black font-comic text-base sm:text-lg font-bold shadow-[4px_4px_0_#ff0080] tracking-wider uppercase">
              ★ SOUP RETRO ARCADE FLOOR • CUPCAKE ATTACK ★
            </span>
          </div>

          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className="px-4 py-1.5 rounded-xl border-3 border-black bg-cyan-400 text-black font-comic text-base font-bold shadow-[3px_3px_0_#ff0080] hover:bg-cyan-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            🕹️ VIEW IN 3D CABINET ROOM →
          </button>
        </div>

        {/* The Exact Poster Composition (Text + Layout matching the photo) */}
        <div className="w-full">
          <CupcakeAttackPoster />
        </div>

        {/* Quick Action Bar Under Poster */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#cabinets"
            className="px-6 py-2.5 rounded-xl border-3 border-black bg-lime-400 text-black font-comic text-lg font-bold shadow-[4px_4px_0_#ff0080] hover:bg-lime-300 transition-all hover:scale-105 active:scale-95"
          >
            🕹️ JUMP TO GAME CABINETS ↓
          </a>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-xl border-3 border-black bg-pink-500 text-white font-comic text-lg font-bold shadow-[4px_4px_0_#a3e635] hover:bg-pink-400 transition-all hover:scale-105 active:scale-95"
          >
            🎁 VISIT PRIZE REDEMPTION SHOP →
          </Link>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 🕹️ ARCADE CABINET FLOOR */}
      {/* ============================================================ */}
      <section id="cabinets" className="space-y-8 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-4 border-black pb-4">
          <div>
            <div className="inline-block px-3 py-1 bg-lime-400 text-black border-2 border-black font-comic text-sm uppercase font-bold shadow-[2px_2px_0_#ff0080] -rotate-1 mb-2">
              SELECT YOUR MACHINE
            </div>
            <h2 className="font-comic text-4xl sm:text-6xl font-black text-white tracking-wide text-stroke-black">
              ARCADE <span className="text-lime-400 neon-glow-lime">CABINETS</span>
            </h2>
            <p className="text-xs font-pixel text-gray-400">
              Crossy Road • Flappy Bird • Minesweeper • Subway Surfers • Balloon Pup
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-comic text-base px-3 py-1.5 rounded-xl border-2 border-black bg-black text-yellow-300 shadow-[2px_2px_0_#ff0080]">
              🎟️ {GAMES.length} CABINETS STANDING BY
            </span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GAMES.map((game, index) => (
            <div
              key={game.id}
              className={`group relative flex flex-col justify-between rounded-2xl border-4 border-black bg-[#0d0213] shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#ff0080] transition-all duration-200 hover:-translate-y-1.5 overflow-hidden ${
                index % 2 === 0 ? "hover:-rotate-0.5" : "hover:rotate-0.5"
              }`}
            >
              {/* Card Top Marquee */}
              <div className="p-3.5 bg-[#170524] border-b-3 border-black flex items-center justify-between">
                <span className="font-comic text-sm text-lime-400 tracking-wide px-2 py-0.5 rounded bg-black border border-lime-400/50">
                  CABINET #{index + 1}
                </span>
                <span className="text-[9px] font-pixel font-bold px-2 py-0.5 rounded border border-pink-500 bg-pink-950/70 text-pink-300">
                  {game.developer}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col space-y-4">
                
                {/* CRT Monitor Simulation */}
                <div className="relative aspect-video rounded-xl border-3 border-black bg-black flex flex-col items-center justify-center crt-overlay overflow-hidden shadow-inner p-3 text-center">
                  
                  {/* Subtle color flare */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 via-transparent to-lime-500/10 pointer-events-none" />

                  {/* Pixel / Emoji Art */}
                  <div className="text-3xl sm:text-4xl tracking-widest py-2 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group-hover:scale-110 transition-transform">
                    {game.cabinetArt}
                  </div>

                  {/* Status Badge */}
                  {game.comingSoon ? (
                    <div className="mt-1 inline-block px-3 py-1 rounded border-2 border-black bg-pink-500 text-white font-comic text-xs tracking-wider uppercase transform -rotate-3 shadow-[2px_2px_0_#000] retro-blink">
                      ★ COMING SOON ★
                    </div>
                  ) : (
                    <div className="mt-1 inline-block px-3 py-1 rounded border-2 border-black bg-lime-400 text-black font-comic text-xs tracking-wider uppercase transform -rotate-3 shadow-[2px_2px_0_#000]">
                      ● PLAYABLE NOW ●
                    </div>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                  <h3 className="font-comic text-2xl sm:text-3xl font-extrabold text-lime-400 tracking-wide leading-none text-stroke-black-sm group-hover:text-pink-400 transition-colors">
                    {game.title}
                  </h3>
                  <div className="text-[9px] font-pixel text-yellow-300 font-bold">
                    {game.genre}
                  </div>
                  <p className="text-[10px] font-pixel text-gray-400 leading-relaxed min-h-[44px] pt-1">
                    {game.description}
                  </p>
                </div>

                {/* Ticket payout estimate */}
                <div className="pt-2 flex items-center justify-between text-[10px] font-pixel border-t-2 border-black/70">
                  <span className="text-gray-400">WIN:</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-1 neon-glow-yellow">
                    <span>🎟️</span> {game.payout}
                  </span>
                </div>

              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <Link
                  href={`/games/${game.id}`}
                  prefetch={true}
                  className="w-full py-3 px-4 rounded-xl font-comic text-lg font-bold text-center flex items-center justify-center gap-2 border-3 border-black bg-lime-400 hover:bg-pink-500 hover:text-white text-black shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_#a3e635] transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span>🕹️</span>
                  <span>ENTER CABINET</span>
                </Link>
              </div>

              {/* Bottom Coin Slot Bar */}
              <div className="py-1 px-4 bg-[#0a0010] border-t-2 border-black flex items-center justify-between text-[8px] font-pixel text-gray-500">
                <span>INSERT 25¢</span>
                <span className="text-lime-400 font-mono">READY</span>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* Featured Minesweeper Section */}
      <MinesweeperSection />

      {/* ============================================================ */}
      {/* 🛠️ TEAMMATE ARCADE DEV GUIDE (MISSION BRIEFING) */}
      {/* ============================================================ */}
      <section className="p-6 sm:p-8 rounded-2xl border-4 border-black bg-[#12031d] shadow-[8px_8px_0_#000] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/80 pb-3">
          <div className="flex items-center gap-2 text-lime-400 font-comic text-xl font-bold">
            <span>🧁</span>
            <span>TEAMMATE MISSION BRIEFING: HOW TO BUILD YOUR GAME</span>
          </div>
          <span className="text-[9px] font-pixel px-2.5 py-1 rounded bg-black text-pink-400 border border-pink-500/50">
            SOUP ARCADE SYSTEM
          </span>
        </div>

        <p className="text-xs font-pixel text-gray-300 leading-relaxed">
          The arcade machines are assigned to the team. Each teammate builds their game canvas inside their dedicated route:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="p-4 rounded-xl border-3 border-black bg-black/60 shadow-[3px_3px_0_#a3e635] space-y-2">
            <div className="font-comic text-lg text-lime-400">1. Crossy Road</div>
            <p className="text-[9px] font-pixel text-gray-400 leading-relaxed">
              Assigned to <strong>Teammate 1</strong>. Route: <code className="text-yellow-300">/games/crossy-road</code>
            </p>
          </div>

          <div className="p-4 rounded-xl border-3 border-black bg-black/60 shadow-[3px_3px_0_#ff0080] space-y-2">
            <div className="font-comic text-lg text-pink-400">2. Flappy Bird</div>
            <p className="text-[9px] font-pixel text-gray-400 leading-relaxed">
              Assigned to <strong>Teammate 2</strong>. Route: <code className="text-yellow-300">/games/flappy-bird</code>
            </p>
          </div>

          <div className="p-4 rounded-xl border-3 border-black bg-black/60 shadow-[3px_3px_0_#facc15] space-y-2">
            <div className="font-comic text-lg text-yellow-400">3. Minesweeper</div>
            <p className="text-[9px] font-pixel text-gray-400 leading-relaxed">
              Assigned to <strong>Letian</strong>. Route: <code className="text-yellow-300">/games/minesweeper</code>
            </p>
          </div>

          <div className="p-4 rounded-xl border-3 border-black bg-black/60 shadow-[3px_3px_0_#00e5ff] space-y-2">
            <div className="font-comic text-lg text-cyan-400">4. Subway Surfers</div>
            <p className="text-[9px] font-pixel text-gray-400 leading-relaxed">
              Assigned to <strong>Teammate 4</strong>. Route: <code className="text-yellow-300">/games/subway-surfers</code>
            </p>
          </div>

        </div>

        <div className="p-4 rounded-xl border-2 border-dashed border-pink-500/60 bg-pink-950/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-pixel">
          <div className="text-pink-300">
            🎟️ To award tickets when a player wins or beats a score:
          </div>
          <code className="p-2 rounded bg-black text-lime-400 border border-lime-400/40 text-[10px]">
            const &#123; addTickets &#125; = useTickets(); addTickets(50);
          </code>
        </div>

      </section>

    </div>
  );
}
