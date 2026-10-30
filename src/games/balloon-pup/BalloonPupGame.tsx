"use client";

import { useEffect, useRef, useState } from "react";
import { useTickets } from "@/context/TicketContext";
import { recordScore } from "@/data/leaderboard";
import { mountBalloonPup, pupWallpaper } from "./engine";

const displayFont = "system-ui, -apple-system, sans-serif";
const monoFont = "ui-monospace, monospace, 'Courier New'";

const CHARACTER_SRC = "/games/balloon-pup/zim.png";

/** Tickets paid per spike passed, capped so one long run can't drain the prize shop. */
const TICKETS_PER_SPIKE = 2;
const MAX_TICKETS_PER_RUN = 50;

export function BalloonPupGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addTickets } = useTickets();
  const backdropRef = useRef<HTMLDivElement>(null);
  const [award, setAward] = useState<string | null>(null);

  // Keep the latest addTickets without remounting the game when it changes.
  const addTicketsRef = useRef(addTickets);
  useEffect(() => {
    addTicketsRef.current = addTickets;
  }, [addTickets]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sprite = new Image();
    sprite.onload = () => {
      if (backdropRef.current) backdropRef.current.style.backgroundImage = `url(${pupWallpaper(160, sprite)})`;
    };
    sprite.src = CHARACTER_SRC;

    let awardTimer: ReturnType<typeof setTimeout> | undefined;
    const stop = mountBalloonPup(canvas, {
      sprite,
      displayFont,
      monoFont,
      onGameOver: (score: number) => {
        recordScore("balloon-pup", score);
        const payout = Math.min(score * TICKETS_PER_SPIKE, MAX_TICKETS_PER_RUN);
        if (payout > 0) {
          addTicketsRef.current(payout);
          setAward(`+${payout} TICKETS!`);
          clearTimeout(awardTimer);
          awardTimer = setTimeout(() => setAward(null), 2500);
        }
      },
    });

    return () => {
      clearTimeout(awardTimer);
      stop();
    };
  }, []);

  return (
    <div
      ref={backdropRef}
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-[#070b16] select-none"
      style={{ backgroundSize: "160px 160px" }}
    >
      <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-black">
        <canvas ref={canvasRef} className="block cursor-pointer touch-none" />
        {award && (
          <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#f5b400] text-black font-black text-sm tracking-widest shadow-lg animate-bounce">
            🎟️ {award}
          </div>
        )}
      </div>
    </div>
  );
}
