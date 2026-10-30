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
        message: `❌ NOT ENOUGH TICKETS! You have ${tickets} 🎟️, but "${prize.name}" costs ${prize.cost} 🎟️ (short by ${deficit} 🎟️). Play games on the arcade floor to earn more!`,
      });
    }

    // Auto dismiss notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* Prize Counter Marquee Header */}
      <section className="relative text-center py-8 px-4 rounded-2xl border-4 border-pink-500 bg-[#160c1d]/90 neon-border-pink overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full border border-pink-400 bg-pink-950/70 text-pink-300 text-[10px] tracking-widest uppercase">
            ★ REDEMPTION COUNTER OPEN ★
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            THE ARCADE <span className="text-pink-500 neon-glow-pink">PRIZE SHOP</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Trade your hard-earned arcade tickets for retro merchandise, toys, and legendary trophies!
          </p>

          {/* Player Balance Card */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl border-2 border-yellow-400 bg-black/80 text-yellow-300 shadow-[0_0_20px_rgba(255,230,0,0.4)]">
              <span className="text-2xl animate-bounce">🎟️</span>
              <div className="text-left">
                <span className="text-[9px] text-yellow-500 block">CURRENT TICKET BALANCE:</span>
                <span className="text-lg sm:text-xl font-bold text-yellow-300 neon-glow-yellow">
                  {tickets.toLocaleString()} TICKETS
                </span>
              </div>
            </div>

            {/* Quick test buttons for teammates */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => addTickets(50)}
                className="text-[10px] px-3 py-2 rounded border border-green-500 bg-green-950/60 text-green-300 hover:bg-green-900/80 transition-colors"
                title="Add 50 Tickets to test purchasing"
              >
                +50 🎟️ (EARN)
              </button>
              <button
                onClick={() => resetTickets(100)}
                className="text-[10px] px-3 py-2 rounded border border-gray-700 bg-gray-900/60 text-gray-400 hover:text-white transition-colors"
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
          className={`p-4 rounded-xl border-2 font-pixel text-xs leading-relaxed animate-in fade-in slide-in-from-top duration-200 ${
            notification.type === "success"
              ? "border-green-400 bg-green-950/90 text-green-300 shadow-[0_0_20px_rgba(57,255,20,0.4)]"
              : "border-red-500 bg-red-950/90 text-red-300 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Prize Shelves */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-gray-800 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-cyan-400 neon-glow-cyan flex items-center gap-2">
            <span>🎁</span> PRIZE SHOWCASE
          </h2>
          <span className="text-[10px] text-gray-400">
            SOURCE: <code className="text-yellow-400">src/data/prizes.ts</code>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRIZES.map((prize) => {
            const canAfford = tickets >= prize.cost;

            return (
              <div
                key={prize.id}
                className={`flex flex-col justify-between rounded-xl border-2 ${prize.accentColor.split(" ")[0]} bg-[#0f0e1f] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,0,127,0.3)]`}
              >
                <div className="space-y-3">
                  {/* Prize Tier & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-lg bg-black/50 border border-gray-800">
                      {prize.icon}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded border border-gray-700 bg-gray-900/60 text-gray-400 font-mono">
                      {prize.rarity}
                    </span>
                  </div>

                  {/* Prize Details */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      {prize.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 leading-relaxed min-h-[35px]">
                      {prize.description}
                    </p>
                  </div>
                </div>

                {/* Price and Action Button */}
                <div className="pt-4 mt-4 border-t border-gray-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">PRICE:</span>
                    <span className="font-bold text-yellow-400 flex items-center gap-1 neon-glow-yellow">
                      <span>🎟️</span>
                      <span>{prize.cost} TICKETS</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(prize)}
                    className={`w-full py-2.5 px-4 rounded-lg font-pixel text-[11px] font-bold transition-all duration-150 active:scale-95 border-2 flex items-center justify-center gap-2 ${
                      canAfford
                        ? "border-pink-500 bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_12px_rgba(255,0,127,0.5)]"
                        : "border-gray-700 bg-gray-900/60 text-gray-500 hover:border-yellow-500/50 hover:text-yellow-400"
                    }`}
                  >
                    <span>{canAfford ? "CLAIM PRIZE" : "INSUFFICIENT TICKETS"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Claimed Inventory Shelf (Shows redeemed prizes in this session) */}
      <section className="p-6 rounded-xl border-2 border-cyan-500/40 bg-[#090e1f] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <span>🎒</span> YOUR CLAIMED LOOT ({inventory.length})
          </h3>
          <span className="text-[9px] text-gray-400">
            TESTS spendTickets() IN TICKET WALLET
          </span>
        </div>

        {inventory.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-lg text-xs">
            No prizes claimed yet! Spend your tickets on the showcase above.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {inventory.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="p-3 rounded-lg border border-cyan-400/50 bg-black/60 text-center space-y-1 animate-in zoom-in duration-150"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="text-[9px] text-white font-bold truncate">{item.name}</div>
                <div className="text-[8px] text-gray-400">Claimed!</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Navigation link back to games */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 py-2 px-4 rounded border border-cyan-500/50 bg-cyan-950/40 transition-colors"
        >
          <span>← BACK TO ARCADE FLOOR TO EARN MORE TICKETS</span>
        </Link>
      </div>

    </div>
  );
}
