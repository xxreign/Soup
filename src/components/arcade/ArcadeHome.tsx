"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTickets } from "@/context/TicketContext";
import { GAMES } from "@/data/games";
import { SAMPLE_SCORES, getLocalScores, getServerLocalScores, subscribeToLocalScores } from "@/data/leaderboard";
import {
  CONTROL_ACTIONS,
  INITIAL_STATE,
  MENU_ITEMS,
  transition,
  type ArcadeAction,
  type ArcadeState,
  type ControlId,
  type ControlPresses,
} from "./arcadeMachine";

const ArcadeScene = dynamic(() => import("./scene/ArcadeScene"), {
  ssr: false,
  loading: () => <BootScreen message="BOOTING CABINET..." />,
});

/** Default tilt for each stick when it's clicked or driven by a touch button. */
const STICK_TILT: Partial<Record<ControlId, { dx: number; dz: number }>> = {
  leftStick: { dx: -1, dz: 0 },
  rightStick: { dx: 1, dz: 0 },
};

const KEY_CONTROLS: Record<string, { id: ControlId; dx?: number; dz?: number }> = {
  ArrowLeft: { id: "leftStick", dx: -1 },
  ArrowUp: { id: "leftStick", dz: -1 },
  ArrowRight: { id: "rightStick", dx: 1 },
  ArrowDown: { id: "rightStick", dz: 1 },
  Enter: { id: "blueOk" },
  " ": { id: "blueOk" },
  Escape: { id: "blueBack" },
  Backspace: { id: "blueBack" },
  s: { id: "redStart" },
  l: { id: "hiScore" },
};

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function ArcadeHome() {
  const router = useRouter();
  const { tickets } = useTickets();
  const localScores = useSyncExternalStore(subscribeToLocalScores, getLocalScores, getServerLocalScores);
  const scores = useMemo(() => [...SAMPLE_SCORES, ...localScores], [localScores]);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const [state, setState] = useState<ArcadeState>(INITIAL_STATE);
  const stateRef = useRef(state);
  const presses = useRef<ControlPresses>({});
  const screenChangedAt = useRef(0);

  // Preload playable games so navigation is instant
  useEffect(() => {
    router.prefetch("/games/balloon-pup");
    router.prefetch("/games/minesweeper");
  }, [router]);

  useEffect(() => {
    const item = MENU_ITEMS[state.menuIndex];
    if (item.kind === "game" && !item.game.comingSoon) {
      router.prefetch(`/games/${item.game.id}`);
    }
  }, [state.menuIndex, router]);

  const commit = useCallback((next: ArcadeState) => {
    if (next === stateRef.current) return;
    stateRef.current = next;
    screenChangedAt.current = performance.now();
    setState(next);
  }, []);

  const act = useCallback(
    (action: ArcadeAction) => {
      const [next, effect] = transition(stateRef.current, action);
      commit(next);
      if (effect?.type === "navigate") router.push(effect.href);
    },
    [commit, router]
  );

  const press = useCallback(
    (id: ControlId, tilt?: { dx?: number; dz?: number }) => {
      const t = tilt ?? STICK_TILT[id];
      presses.current[id] = { at: performance.now(), dx: t?.dx ?? 0, dz: t?.dz ?? 0 };
      act(CONTROL_ACTIONS[id]);
    },
    [act]
  );

  const selectMenuItem = useCallback(
    (index: number) => {
      const current = stateRef.current;
      if (current.screen !== "menu") return;
      if (index === current.menuIndex) act("confirm");
      else commit({ ...current, menuIndex: index });
    },
    [act, commit]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      // Let Enter/Space activate focused links and buttons (e.g. the header) normally.
      if ((e.key === "Enter" || e.key === " ") && target?.closest("a, button")) return;
      const control = KEY_CONTROLS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!control) return;
      e.preventDefault();
      press(control.id, control);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [press]);

  const announcement = describe(state);

  return (
    <div className="ml-[calc(50%-50vw)] w-screen -mt-8 -mb-8">
      <section
        aria-label="Arcade cabinet"
        className="relative h-[68svh] min-h-[460px] md:h-[calc(100svh-6rem)] md:min-h-[600px] bg-[#0a1650]"
      >
        <ArcadeScene
          view={state.screen === "attract" ? "wide" : "close"}
          reducedMotion={reducedMotion}
          fallback={<NoWebGL />}
          state={state}
          scores={scores}
          tickets={tickets}
          presses={presses}
          screenChangedAt={screenChangedAt}
          onPress={press}
          onSelect={selectMenuItem}
          onAction={act}
          onPrizeCounter={() => router.push("/shop")}
        />

        {/* Control hints for keyboard and mouse */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-5 px-5 py-2.5 rounded-full bg-[#050a2a]/80 border border-[#2a55c8]/60 text-[9px] text-[#a6c4ff] whitespace-nowrap">
          <span><Key>←</Key><Key>→</Key> or sticks: browse</span>
          <span><Key>ENTER</Key> or OK: select</span>
          <span><Key>S</Key> or START: play</span>
          <span><Key>ESC</Key> or BACK: back</span>
          <span><Key>L</Key> or HI-SCORE: scores</span>
        </div>

        {state.screen !== "attract" && (
          <button
            type="button"
            onClick={() => commit({ ...stateRef.current, screen: "attract" })}
            className="absolute top-4 right-4 px-3 py-2 rounded border border-[#2a55c8]/70 bg-[#050a2a]/80 text-[9px] text-[#a6c4ff] hover:text-white hover:border-cyan-400 transition-colors"
          >
            ⤢ STEP BACK
          </button>
        )}
      </section>

      {/* Touch pad for phones and tablets, mirroring the cabinet's controls */}
      <div className="md:hidden grid grid-cols-6 gap-2 p-3 bg-[#060c33] border-t-2 border-[#2a55c8]" aria-label="Cabinet controls">
        <TouchButton tone="red" label="◀" title="Previous" onPress={() => press("leftStick")} />
        <TouchButton tone="red" label="▶" title="Next" onPress={() => press("rightStick")} />
        <TouchButton tone="blue" label="BACK" onPress={() => press("blueBack")} />
        <TouchButton tone="blue" label="OK" onPress={() => press("blueOk")} />
        <TouchButton tone="red" label="START" onPress={() => press("redStart")} />
        <TouchButton tone="yellow" label="🏆" title="High scores" onPress={() => press("hiScore")} />
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <nav className="sr-only" aria-label="Games">
        <ul>
          {GAMES.map((g) => (
            <li key={g.id}>
              <Link href={`/games/${g.id}`}>
                {g.title}
                {g.comingSoon ? " (coming soon)" : ""}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/shop">Prize counter</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function describe(state: ArcadeState) {
  const item = MENU_ITEMS[state.menuIndex];
  switch (state.screen) {
    case "attract":
      return "Arcade cabinet ready. Press Enter to start.";
    case "menu":
      return item.kind === "game"
        ? `${item.game.title}. ${item.game.comingSoon ? "Coming soon." : "Press Enter to select."}`
        : item.kind === "leaderboard"
          ? "High scores."
          : "Prize counter.";
    case "launch":
      return item.kind === "game" ? `${item.game.title} loaded. ${state.launchFocus === 0 ? "Play now" : "Back to arcade"} highlighted.` : "";
    case "leaderboard":
      return "High scores. Use left and right to change game.";
  }
}

function Key({ children }: { children: React.ReactNode }) {
  return <kbd className="inline-block min-w-5 px-1.5 py-1 mr-1 rounded border border-[#4a74e0] bg-[#0e1a5c] text-white text-center">{children}</kbd>;
}

const TONES = {
  red: "bg-[#d8141c] border-[#ff6b70] shadow-[0_4px_0_#7a0a0f]",
  blue: "bg-[#1f5fd6] border-[#79a6ff] shadow-[0_4px_0_#0d2f73]",
  yellow: "bg-[#f5b400] border-[#ffe28a] shadow-[0_4px_0_#7a5900] text-black",
};

function TouchButton({ tone, label, title, onPress }: { tone: keyof typeof TONES; label: string; title?: string; onPress: () => void }) {
  return (
    <button
      type="button"
      aria-label={title ?? label}
      onClick={onPress}
      className={`h-14 rounded-full border-2 text-[10px] text-white active:translate-y-1 active:shadow-none transition-transform ${TONES[tone]}`}
    >
      {label}
    </button>
  );
}

function BootScreen({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a1650]">
      <div className="text-[12px] text-[#7dffb0] crt-glow-green retro-blink">{message}</div>
    </div>
  );
}

function NoWebGL() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center bg-[#0a1650]">
      <p className="text-[12px] text-[#7dffb0]">THIS CABINET NEEDS WEBGL TO POWER ON.</p>
      <ul className="space-y-2 text-[11px]">
        {GAMES.map((g) => (
          <li key={g.id}>
            <Link className="text-cyan-300 hover:text-white" href={`/games/${g.id}`}>
              ▶ {g.title}
            </Link>
          </li>
        ))}
        <li>
          <Link className="text-yellow-300 hover:text-white" href="/shop">
            ▶ PRIZE COUNTER
          </Link>
        </li>
      </ul>
    </div>
  );
}
