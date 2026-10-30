"use client";

import { useEffect, useRef, useState } from "react";
import { Faculty_Glyphic, IBM_Plex_Mono } from "next/font/google";
import { useTickets } from "@/context/TicketContext";
import { mountBalloonPup, pupWallpaper } from "./engine";

const facultyGlyphic = Faculty_Glyphic({ weight: "400", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({ weight: "400", subsets: ["latin"] });

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

    // The wallpaper is a one-off snapshot, so build it once the character image has loaded.
    const sprite = new Image();
    sprite.onload = () => {
      if (backdropRef.current) backdropRef.current.style.backgroundImage = `url(${pupWallpaper(160, sprite)})`;
    };
    sprite.src = CHARACTER_SRC;
    const displayFont = facultyGlyphic.style.fontFamily;
    const monoFont = plexMono.style.fontFamily;
    // Canvas text doesn't always trigger a web font download, so request both up front.
    document.fonts?.load(`16px ${displayFont}`);
    document.fonts?.load(`11px ${monoFont}`);

    let awardTimer: ReturnType<typeof setTimeout> | undefined;
    const stop = mountBalloonPup(canvas, {
      sprite,
      displayFont,
      monoFont,
      onGameOver: (score) => {
        const reward = Math.min(score * TICKETS_PER_SPIKE, MAX_TICKETS_PER_RUN);
        if (reward <= 0) return;
        addTicketsRef.current(reward);
        setAward(`+${reward} TICKETS EARNED!`);
        clearTimeout(awardTimer);
        awardTimer = setTimeout(() => setAward(null), 3000);
      },
    });

    return () => {
      stop();
      clearTimeout(awardTimer);
    };
  }, []);

  // Layout uses inline styles so the game sizes itself even where Tailwind isn't compiled.
  return (
    <div
      ref={backdropRef}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        padding: 24,
        boxSizing: "border-box",
        backgroundColor: "#6fbf3a",
        backgroundSize: "160px 160px",
      }}
    >
      <div
        style={{
          // Fit the window height like the standalone page did, up to 440px wide.
          width: "min(100%, calc((100dvh - 48px) * 0.68))",
          maxWidth: 440,
          aspectRatio: "0.68",
          overflow: "hidden",
          borderRadius: 12,
          boxShadow: "0 0 0 2px #3b2314, 0 12px 32px rgba(59, 35, 20, 0.18)",
        }}
      >
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="img"
          aria-label="Balloon pup game. Click, tap, or press Space to float the pup up through the gaps."
          style={{ display: "block", width: "100%", height: "100%", cursor: "pointer", touchAction: "none", outline: "none" }}
          className="focus-visible:shadow-[inset_0_0_0_3px_#3b2314]"
        />
      </div>

      {award && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #22c55e",
            background: "rgba(5, 46, 22, 0.9)",
            color: "#86efac",
            fontSize: 10,
            pointerEvents: "none",
          }}
        >
          ✨ {award}
        </div>
      )}
    </div>
  );
}
