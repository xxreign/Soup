"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTickets } from "@/context/TicketContext";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { tickets, addTickets } = useTickets();
  const [pulse, setPulse] = useState(false);

  const handleTestEarn = () => {
    addTickets(25);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a16]/95 backdrop-blur-md border-b-4 border-cyan-500 shadow-[0_4px_25px_rgba(0,240,255,0.25)]">
      {/* Top Marquee Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Arcade Brand Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="w-9 h-9 bg-pink-500 flex items-center justify-center rounded border-2 border-pink-300 shadow-[0_0_12px_rgba(255,0,127,0.7)] text-base">
            👾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-lg sm:text-xl font-bold tracking-wider text-cyan-400 neon-glow-cyan">
                NEON RETRO
              </span>
              <span className="font-pixel text-lg sm:text-xl font-bold tracking-wider text-pink-500 neon-glow-pink">
                ARCADE
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-pixel">
              EST. 1984 • 1-UP YOUR SKILLS
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 sm:gap-4 font-pixel text-xs">
          <Link
            href="/"
            className={`px-3 py-2 rounded border-2 transition-all duration-200 flex items-center gap-2 ${
              pathname === "/"
                ? "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                : "border-gray-800 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-300"
            }`}
          >
            <span>🕹️</span>
            <span>ARCADE FLOOR</span>
          </Link>

          <Link
            href="/games/minesweeper"
            className={`px-3 py-2 rounded border-2 transition-all duration-200 flex items-center gap-2 ${
              pathname.includes("minesweeper")
                ? "border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "border-gray-800 text-gray-400 hover:border-emerald-500/50 hover:text-emerald-300"
            }`}
          >
            <span>💣</span>
            <span>MINESWEEPER</span>
          </Link>

          <Link
            href="/shop"
            className={`px-3 py-2 rounded border-2 transition-all duration-200 flex items-center gap-2 ${
              pathname === "/shop"
                ? "border-pink-500 bg-pink-950/60 text-pink-300 shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                : "border-gray-800 text-gray-400 hover:border-pink-500/50 hover:text-pink-300"
            }`}
          >
            <span>🎁</span>
            <span>PRIZE SHOP</span>
          </Link>
        </nav>

        {/* Ticket Wallet Display & Quick Faucet */}
        <div className="flex items-center gap-3">
          <div 
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border-2 border-yellow-400 bg-[#171302] text-yellow-300 shadow-[0_0_18px_rgba(255,230,0,0.35)] transition-all duration-200 ${
              pulse ? "scale-110 shadow-[0_0_25px_rgba(255,230,0,0.8)]" : ""
            }`}
          >
            <span className="text-lg animate-bounce">🎟️</span>
            <div className="text-right">
              <div className="text-[8px] font-pixel text-yellow-500 uppercase tracking-wider">
                TICKETS
              </div>
              <div className="font-pixel text-sm sm:text-base font-bold text-yellow-300 neon-glow-yellow">
                {tickets.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick test ticket faucet so teammates can test earning immediately */}
          <button
            onClick={handleTestEarn}
            title="Dev Faucet: Add 25 Test Tickets"
            className="font-pixel text-[9px] px-2.5 py-2 rounded bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-400 border border-yellow-500/40 hover:border-yellow-400 transition-colors active:scale-95"
          >
            +25 🎟️
          </button>
        </div>

      </div>
    </header>
  );
}
