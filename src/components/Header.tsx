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
    <header className="sticky top-0 z-50 bg-[#060009]/95 backdrop-blur-md border-b-4 border-black shadow-[0_4px_30px_rgba(255,0,128,0.35)]">
      {/* Top Spray Paint Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-lime-400 via-pink-500 to-cyan-400 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Arcade Brand Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-3 transition-transform hover:scale-105"
        >
          {/* Toxic Gir / Cupcake Badge */}
          <div className="w-11 h-11 bg-lime-400 flex items-center justify-center rounded-xl border-3 border-black shadow-[3px_3px_0_#ff0080] text-xl transform -rotate-3 group-hover:rotate-0 transition-transform">
            🧁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-comic text-2xl sm:text-3xl font-extrabold tracking-wider text-lime-400 text-stroke-black-sm neon-glow-lime">
                SOUP
              </span>
              <span className="font-comic text-2xl sm:text-3xl font-extrabold tracking-wider text-pink-500 text-stroke-black-sm neon-glow-pink">
                ARCADE
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-pink-300/80 font-mono -mt-1">
              THE MADNESS • THE HORROR • THE TICKETS
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 sm:gap-3 font-comic text-base tracking-wide">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-lg border-2 border-black transition-all duration-150 flex items-center gap-2 shadow-[2px_2px_0_#000] active:translate-x-0.5 active:translate-y-0.5 ${
              pathname === "/"
                ? "bg-lime-400 text-black shadow-[3px_3px_0_#ff0080] font-bold"
                : "bg-black/60 text-lime-300 hover:bg-lime-400/20 hover:text-white"
            }`}
          >
            <span>🕹️</span>
            <span>ARCADE FLOOR</span>
          </Link>

          <Link
            href="/shop"
            className={`px-4 py-1.5 rounded-lg border-2 border-black transition-all duration-150 flex items-center gap-2 shadow-[2px_2px_0_#000] active:translate-x-0.5 active:translate-y-0.5 ${
              pathname === "/shop"
                ? "bg-pink-500 text-white shadow-[3px_3px_0_#a3e635] font-bold"
                : "bg-black/60 text-pink-300 hover:bg-pink-500/20 hover:text-white"
            }`}
          >
            <span>🎁</span>
            <span>PRIZE SHOP</span>
          </Link>
        </nav>

        {/* Ticket Wallet Display & Faucet */}
        <div className="flex items-center gap-3">
          <div 
            className={`flex items-center gap-2.5 px-3.5 py-1 rounded-xl border-3 border-black bg-yellow-400 text-black shadow-[3px_3px_0_#ff0080] transition-all duration-200 ${
              pulse ? "scale-110 shadow-[0_0_25px_rgba(255,230,0,0.9)]" : ""
            }`}
          >
            <span className="text-xl animate-bounce">🎟️</span>
            <div className="text-right">
              <div className="text-[8px] font-pixel text-black font-bold uppercase tracking-wider">
                TICKETS
              </div>
              <div className="font-comic text-xl font-bold text-black leading-none">
                {tickets.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick test ticket faucet */}
          <button
            onClick={handleTestEarn}
            title="Dev Faucet: Add 25 Test Tickets"
            className="font-comic text-sm px-3 py-1.5 rounded-lg bg-pink-500 text-white border-2 border-black shadow-[2px_2px_0_#a3e635] hover:bg-pink-400 transition-transform active:scale-95"
          >
            +25 🎟️
          </button>
        </div>

      </div>
    </header>
  );
}
