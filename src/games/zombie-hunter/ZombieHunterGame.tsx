"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { Chakra_Petch, Creepster } from "next/font/google";
import { useTickets } from "@/context/TicketContext";
import { recordScore } from "@/data/leaderboard";
import { mountZombieHunter, type ZombieHunterHandle, type ZombieHunterHud } from "./engine";

const creepster = Creepster({ weight: "400", subsets: ["latin"] });
const chakra = Chakra_Petch({ weight: ["500", "700"], subsets: ["latin"] });

/** Tickets paid per kill, capped so one long run can't drain the prize shop. */
const TICKETS_PER_KILL = 2;
const MAX_TICKETS_PER_RUN = 80;

const blood = "#d1121b";
const bone = "#efe6d2";

const KEYFRAMES = `
@keyframes zh-fade { from { opacity: 1; } to { opacity: 0; } }
@keyframes zh-hit { from { opacity: 1; transform: translate(-50%, -50%) rotate(45deg) scale(1.25); } to { opacity: 0; transform: translate(-50%, -50%) rotate(45deg) scale(1); } }
@keyframes zh-blink { 50% { opacity: 0.35; } }
@keyframes zh-rise { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }
`;

const CONTROLS: [string, string][] = [
  ["WASD", "Move"],
  ["MOUSE", "Look"],
  ["LEFT CLICK", "Fire"],
  ["HOLD SHIFT", "Aim down sights"],
  ["R", "Reload"],
  ["ESC", "Pause"],
];

export function ZombieHunterGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ZombieHunterHandle | null>(null);
  const [hud, setHud] = useState<ZombieHunterHud | null>(null);
  const [hit, setHit] = useState<{ id: number; kind: "body" | "head" | "kill" } | null>(null);
  const [hurtId, setHurtId] = useState(0);
  const [reward, setReward] = useState(0);
  const { addTickets } = useTickets();

  // Keep the latest addTickets without remounting the game when it changes.
  const addTicketsRef = useRef(addTickets);
  useEffect(() => {
    addTicketsRef.current = addTickets;
  }, [addTickets]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let hitId = 0;
    const engine = mountZombieHunter(host, {
      onHud: setHud,
      onHit: (kind) => setHit({ id: ++hitId, kind }),
      onHurt: () => setHurtId((n) => n + 1),
      onGameOver: ({ score, kills }) => {
        recordScore("zombie-hunter", score);
        const tickets = Math.min(kills * TICKETS_PER_KILL, MAX_TICKETS_PER_RUN);
        setReward(tickets);
        if (tickets > 0) addTicketsRef.current(tickets);
      },
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const start = () => {
    setReward(0);
    engineRef.current?.start();
  };

  const state = hud?.state ?? "title";
  const inRun = state === "playing" || state === "paused";
  const aiming = Boolean(hud?.aiming);
  const health = hud?.health ?? 100;
  const lowHealth = Math.max(0, 1 - health / 40);

  return (
    <div
      className={chakra.className}
      style={{ position: "fixed", inset: 0, background: "#05070d", overflow: "hidden", color: bone, userSelect: "none", cursor: state === "playing" ? "none" : "default" }}
    >
      <style>{KEYFRAMES}</style>
      <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />

      {/* ADS vignette narrows focus while aiming */}
      <div style={{ ...fill, background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.75) 100%)", opacity: aiming ? 1 : 0, transition: "opacity 120ms" }} />
      {/* Persistent red edge when badly hurt */}
      <div style={{ ...fill, background: `radial-gradient(ellipse at center, transparent 45%, rgba(150,0,0,0.7) 100%)`, opacity: inRun ? lowHealth : 0 }} />
      {hurtId > 0 && (
        <div key={hurtId} style={{ ...fill, background: "radial-gradient(ellipse at center, rgba(180,0,0,0.1) 30%, rgba(200,0,0,0.6) 100%)", animation: "zh-fade 450ms ease-out forwards" }} />
      )}

      {inRun && hud && (
        <>
          <Crosshair hidden={aiming} />
          {hit && (
            <div
              key={hit.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 26,
                height: 26,
                pointerEvents: "none",
                animation: "zh-hit 260ms ease-out forwards",
                ["--c" as string]: hit.kind === "kill" ? blood : hit.kind === "head" ? "#ffd23a" : "#ffffff",
              }}
            >
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, marginLeft: -1, background: "linear-gradient(var(--c) 35%, transparent 35% 65%, var(--c) 65%)" }} />
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, marginTop: -1, background: "linear-gradient(90deg, var(--c) 35%, transparent 35% 65%, var(--c) 65%)" }} />
            </div>
          )}

          {/* Top bar: wave, horde count, score */}
          <div style={{ position: "absolute", top: 18, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none", textShadow: "0 2px 6px #000" }}>
            <div>
              <div className={creepster.className} style={{ fontSize: 34, color: blood, lineHeight: 1 }}>
                WAVE {Math.max(1, hud.wave)}
              </div>
              <div style={{ fontSize: 13, letterSpacing: 2, opacity: 0.8 }}>{hud.zombiesLeft} UNDEAD REMAINING</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{hud.score.toLocaleString()}</div>
              <div style={{ fontSize: 13, letterSpacing: 2, opacity: 0.8 }}>{hud.kills} KILLS</div>
            </div>
          </div>

          {hud.message && (
            <div
              key={hud.message}
              className={creepster.className}
              style={{ position: "absolute", top: "24%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(40px, 7vw, 84px)", color: blood, textShadow: "0 0 18px rgba(255,0,0,0.5), 0 4px 0 #000", whiteSpace: "nowrap", pointerEvents: "none", animation: "zh-rise 300ms ease-out" }}
            >
              {hud.message}
            </div>
          )}

          {/* Bottom bar: health and ammo */}
          <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "none", textShadow: "0 2px 6px #000" }}>
            <div style={{ width: "min(280px, 40vw)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, letterSpacing: 2, marginBottom: 6 }}>
                <span>HEALTH</span>
                <span style={{ fontWeight: 700 }}>{hud.health}</span>
              </div>
              <div style={{ height: 12, background: "rgba(0,0,0,0.6)", border: `1px solid rgba(239,230,210,0.4)`, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hud.health}%`, background: hud.health > 50 ? "#7fbf4d" : hud.health > 25 ? "#e0a530" : blood, transition: "width 150ms, background 300ms" }} />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              {hud.reloading ? (
                <div style={{ fontSize: 14, letterSpacing: 3, color: "#ffd23a", animation: "zh-blink 0.6s infinite" }}>RELOADING</div>
              ) : hud.ammo <= 6 ? (
                <div style={{ fontSize: 14, letterSpacing: 3, color: blood, animation: "zh-blink 0.6s infinite" }}>{hud.ammo === 0 ? "PRESS R" : "LOW AMMO"}</div>
              ) : null}
              <div style={{ fontWeight: 700, lineHeight: 1 }}>
                <span style={{ fontSize: 48, color: hud.ammo <= 6 ? blood : bone }}>{hud.ammo}</span>
                <span style={{ fontSize: 22, opacity: 0.6 }}> / {hud.magSize}</span>
              </div>
              <div style={{ fontSize: 12, letterSpacing: 2, opacity: aiming ? 1 : 0.55, color: aiming ? "#ff5a5a" : bone }}>
                {aiming ? "● AIMING" : "SHIFT TO AIM"}
              </div>
            </div>
          </div>
        </>
      )}

      {state === "title" && (
        <Overlay>
          <h1 className={creepster.className} style={{ fontSize: "clamp(56px, 10vw, 120px)", color: blood, margin: 0, lineHeight: 0.95, textShadow: "0 0 30px rgba(255,0,0,0.45), 0 6px 0 #000" }}>
            ZOMBIE HUNTER
          </h1>
          <p style={{ margin: "10px 0 28px", fontSize: 16, letterSpacing: 4, opacity: 0.85 }}>HOLD THE YARD. ONE WAVE AT A TIME.</p>
          <ControlsGrid />
          <StartButton onClick={start}>CLICK TO PLAY</StartButton>
          {Boolean(hud?.best) && <p style={{ marginTop: 16, fontSize: 13, letterSpacing: 2, opacity: 0.7 }}>BEST SCORE {hud!.best.toLocaleString()}</p>}
          <BackLink />
        </Overlay>
      )}

      {state === "paused" && (
        <Overlay>
          <h2 className={creepster.className} style={{ fontSize: 72, margin: 0, color: bone }}>PAUSED</h2>
          <div style={{ margin: "20px 0 28px" }}>
            <ControlsGrid />
          </div>
          <StartButton onClick={start}>RESUME</StartButton>
          <BackLink />
        </Overlay>
      )}

      {state === "over" && hud && (
        <Overlay>
          <h2 className={creepster.className} style={{ fontSize: "clamp(56px, 9vw, 110px)", margin: 0, color: blood, textShadow: "0 0 30px rgba(255,0,0,0.5), 0 6px 0 #000" }}>
            YOU DIED
          </h2>
          <div style={{ display: "flex", gap: 36, justifyContent: "center", margin: "22px 0 8px" }}>
            <Stat label="WAVE" value={hud.wave} />
            <Stat label="KILLS" value={hud.kills} />
            <Stat label="SCORE" value={hud.score.toLocaleString()} />
          </div>
          <p style={{ fontSize: 13, letterSpacing: 2, opacity: 0.7, margin: "0 0 6px" }}>
            {hud.score >= hud.best && hud.score > 0 ? "NEW BEST SCORE!" : `BEST ${hud.best.toLocaleString()}`}
          </p>
          {reward > 0 && <p style={{ fontSize: 16, letterSpacing: 2, color: "#ffd23a", margin: "0 0 20px" }}>+{reward} TICKETS EARNED</p>}
          <StartButton onClick={start}>PLAY AGAIN</StartButton>
          <BackLink />
        </Overlay>
      )}
    </div>
  );
}

const fill: CSSProperties = { position: "absolute", inset: 0, pointerEvents: "none" };

function Crosshair({ hidden }: { hidden: boolean }) {
  const bar: CSSProperties = { position: "absolute", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 2px #000" };
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: 0, height: 0, opacity: hidden ? 0 : 1, transition: "opacity 100ms", pointerEvents: "none" }}>
      <div style={{ ...bar, left: -1, top: -15, width: 2, height: 8 }} />
      <div style={{ ...bar, left: -1, top: 7, width: 2, height: 8 }} />
      <div style={{ ...bar, top: -1, left: -15, width: 8, height: 2 }} />
      <div style={{ ...bar, top: -1, left: 7, width: 8, height: 2 }} />
      <div style={{ ...bar, left: -1, top: -1, width: 2, height: 2 }} />
    </div>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, background: "radial-gradient(ellipse at center, rgba(10,4,6,0.55), rgba(0,0,0,0.88))" }}>
      {children}
    </div>
  );
}

function ControlsGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "8px 18px", fontSize: 14, letterSpacing: 1.5, marginBottom: 28, textAlign: "left" }}>
      {CONTROLS.map(([key, action]) => (
        <div key={key} style={{ display: "contents" }}>
          <span style={{ justifySelf: "end", fontWeight: 700, padding: "2px 8px", border: "1px solid rgba(239,230,210,0.45)", borderRadius: 3, background: "rgba(0,0,0,0.4)" }}>{key}</span>
          <span style={{ opacity: 0.85, alignSelf: "center" }}>{action}</span>
        </div>
      ))}
    </div>
  );
}

function StartButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      autoFocus
      style={{ font: "inherit", fontWeight: 700, fontSize: 20, letterSpacing: 4, padding: "14px 40px", color: bone, background: blood, border: "2px solid #000", borderRadius: 4, boxShadow: "0 6px 0 #000, 0 0 30px rgba(209,18,27,0.45)", cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

function BackLink() {
  return (
    <Link href="/" style={{ marginTop: 22, fontSize: 13, letterSpacing: 2, color: bone, opacity: 0.65 }}>
      ← BACK TO THE ARCADE
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.7 }}>{label}</div>
    </div>
  );
}
