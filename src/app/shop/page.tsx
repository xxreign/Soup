"use client";

import { useState } from "react";
import Link from "next/link";
import { useTickets } from "@/context/TicketContext";
import { PRIZES, PrizeItem } from "@/data/prizes";

export default function PrizeShopPage() {
  const { tickets, spendTickets, addTickets, resetTickets } = useTickets();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [inventory, setInventory] = useState<PrizeItem[]>([]);

  const handleRedeem = (prize: PrizeItem) => {
    const success = spendTickets(prize.cost);

    if (success) {
      setInventory((prev) => [...prev, prize]);
      setNotification({
        type: "success",
        message: `🎉 PRIZE CLAIMED: "${prize.name}" for ${prize.cost} tickets! Check your inventory below!`,
      });
    } else {
      const deficit = prize.cost - tickets;
      setNotification({
        type: "error",
        message: `❌ NOT ENOUGH TICKETS! You have ${tickets} 🎟️, but "${prize.name}" costs ${prize.cost} 🎟️ (short by ${deficit} 🎟️). Play Crossy Road, Flappy Bird, Minesweeper, or Subway Surfers to earn more!`,
      });
    }

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Prize Counter Marquee Header */}
      <section className="relative text-center py-10 px-4 rounded-3xl border-5 border-black bg-[#150424] shadow-[10px_10px_0_#000] overflow-hidden">
        
        {/* Spray paint glows */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#ff0080]/30 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#a3e635]/25 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-lg border-3 border-black bg-yellow-400 text-black font-comic text-base tracking-wider uppercase transform -rotate-1 shadow-[3px_3px_0_#ff0080]">
            ★ REDEMPTION VAULT OPEN • CASH IN TICKETS ★
          </div>

          <h1 className="font-comic text-5xl sm:text-7xl font-black text-white text-stroke-black leading-none">
            THE ARCADE <span className="text-pink-500 neon-glow-pink">PRIZE SHOP</span>
          </h1>

          <p className="text-xs sm:text-sm font-pixel text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Trade your hard-earned arcade tickets for stickers, toys, gear, and legendary high-roller loot!
          </p>

          {/* Player Balance Card */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border-4 border-black bg-yellow-400 text-black shadow-[5px_5px_0_#ff0080]">
              <span className="text-3xl animate-bounce">🎟️</span>
              <div className="text-left">
                <span className="text-[9px] font-pixel text-black font-bold block">CURRENT TICKET BALANCE:</span>
                <span className="font-comic text-3xl font-black text-black leading-tight">
                  {tickets.toLocaleString()} TICKETS
                </span>
              </div>
            </div>

            {/* Quick test buttons for teammates */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => addTickets(50)}
                className="font-comic text-base px-4 py-2 rounded-xl border-3 border-black bg-lime-400 text-black hover:bg-lime-300 transition-transform active:scale-95 shadow-[3px_3px_0_#000]"
                title="Add 50 Tickets to test purchasing"
              >
                +50 🎟️ (EARN)
              </button>
              <button
                onClick={() => resetTickets(100)}
                className="font-comic text-base px-4 py-2 rounded-xl border-3 border-black bg-black text-gray-300 hover:text-white transition-transform active:scale-95 shadow-[3px_3px_0_#ff0080]"
                title="Reset to 100 starter tickets"
              >
                RESET 100 🎟️
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction Feedback Toast / Alert Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border-4 border-black font-comic text-lg leading-relaxed shadow-[6px_6px_0_#000] animate-in fade-in slide-in-from-top duration-200 ${
            notification.type === "success"
              ? "bg-lime-400 text-black shadow-[6px_6px_0_#ff0080]"
              : "bg-red-600 text-white shadow-[6px_6px_0_#a3e635]"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Prize Shelves */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b-4 border-black pb-3">
          <h2 className="font-comic text-3xl sm:text-4xl font-black text-lime-400 text-stroke-black flex items-center gap-2">
            <span>🎁</span> PRIZE SHOWCASE
          </h2>
          <span className="text-[9px] font-pixel text-gray-400">
            CATALOG: <code className="text-yellow-400">src/data/prizes.ts</code>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRIZES.map((prize) => {
            const canAfford = tickets >= prize.cost;

            return (
              <div
                key={prize.id}
                className="flex flex-col justify-between rounded-2xl border-4 border-black bg-[#10031c] p-5 shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#ff0080] transition-all duration-200 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  {/* Prize Tier & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-4xl p-2.5 rounded-xl bg-black border-3 border-black shadow-[2px_2px_0_#a3e635]">
                      {prize.icon}
                    </span>
                    <span className="font-comic text-sm px-2.5 py-0.5 rounded-lg border-2 border-black bg-pink-500 text-white shadow-[2px_2px_0_#000]">
                      {prize.rarity}
                    </span>
                  </div>

                  {/* Prize Details */}
                  <div className="space-y-1">
                    <h3 className="font-comic text-2xl font-bold text-white tracking-wide">
                      {prize.name}
                    </h3>
                    <p className="text-[10px] font-pixel text-gray-400 leading-relaxed min-h-[35px]">
                      {prize.description}
                    </p>
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="pt-4 mt-4 border-t-2 border-black/70 space-y-3">
                  <div className="flex items-center justify-between font-comic text-lg">
                    <span className="text-gray-400">PRICE:</span>
                    <span className="font-black text-yellow-300 flex items-center gap-1 neon-glow-yellow">
                      <span>🎟️</span>
                      <span>{prize.cost} TICKETS</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(prize)}
                    className={`w-full py-2.5 px-4 rounded-xl font-comic text-base font-bold transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 border-3 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-2 ${
                      canAfford
                        ? "bg-pink-500 hover:bg-pink-400 text-white shadow-[3px_3px_0_#a3e635]"
                        : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                    }`}
                  >
                    <span>{canAfford ? "CLAIM PRIZE" : "NEED MORE TICKETS"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Claimed Inventory Shelf */}
      <section className="p-6 rounded-2xl border-4 border-black bg-[#120320] shadow-[6px_6px_0_#000] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-comic text-2xl font-bold text-lime-400 flex items-center gap-2">
            <span>🎒</span> YOUR CLAIMED LOOT ({inventory.length})
          </h3>
          <span className="text-[9px] font-pixel text-pink-400">
            TESTS spendTickets() IN TICKET WALLET
          </span>
        </div>

        {inventory.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border-3 border-dashed border-black rounded-xl text-xs font-pixel">
            No prizes claimed yet! Spend your tickets on the showcase above.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {inventory.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="p-3 rounded-xl border-3 border-black bg-black/80 text-center space-y-1 shadow-[3px_3px_0_#a3e635] animate-in zoom-in duration-150"
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="text-[10px] font-comic text-white font-bold truncate">{item.name}</div>
                <div className="text-[8px] font-pixel text-lime-400">Claimed!</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Navigation link back to games */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-comic text-xl text-lime-400 hover:text-white py-2.5 px-6 rounded-xl border-3 border-black bg-black shadow-[4px_4px_0_#ff0080] transition-colors"
        >
          <span>← BACK TO ARCADE FLOOR TO PLAY GAMES</span>
        </Link>
      </div>

    </div>
  );
}
