"use client";

import { useEffect, useState } from "react";
import { GAMES, getGameById } from "@/data/games";
import { topScores, type ScoreEntry } from "@/data/leaderboard";
import {
  BOARD_FILTERS,
  MENU_ITEMS,
  type ArcadeAction,
  type ArcadeState,
  type MenuItem,
} from "../arcadeMachine";

/**
 * Everything drawn on the cabinet's CRT. Rendered as DOM inside the 3D scene (drei <Html>),
 * which uses its own React root, so all data arrives through props rather than context.
 */
export interface CrtScreenProps {
  state: ArcadeState;
  scores: ScoreEntry[];
  onSelect: (menuIndex: number) => void;
  onAction: (action: ArcadeAction) => void;
}

export function CrtScreen({ state, scores, onSelect, onAction }: CrtScreenProps) {
  // Re-keying replays the flicker animation whenever the picture changes.
  const pictureKey = `${state.screen}-${state.menuIndex}-${state.boardFilter}`;

  return (
    <div className="crt-screen font-pixel">
      <div key={pictureKey} className="crt-picture crt-flicker">
        {state.screen === "attract" && <AttractScreen onStart={() => onAction("start")} />}
        {state.screen === "menu" && <MenuScreen state={state} onSelect={onSelect} />}
        {state.screen === "launch" && <LaunchScreen state={state} onAction={onAction} />}
        {state.screen === "leaderboard" && <LeaderboardScreen state={state} scores={scores} onAction={onAction} />}
      </div>
      <div className="crt-scanlines" />
      <div className="crt-glare" />
    </div>
  );
}

function AttractScreen({ onStart }: { onStart: () => void }) {
  return (
    <button type="button" onClick={onStart} className="w-full h-full flex flex-col items-center justify-center gap-7 text-center cursor-pointer">
      <div className="text-[18px] tracking-[0.3em] text-[#7dffb0] crt-glow-green">★ SUMMER ARCADE NIGHTS ★</div>
      <h2 className="text-[46px] leading-[1.25] text-white crt-glow-white">
        NEON RETRO
        <br />
        ARCADE
      </h2>
      <div className="attract-parade text-[34px]" aria-hidden>
        {GAMES.map((g) => (
          <span key={g.id}>{g.cabinetArt.split(/\s+/)[0]}</span>
        ))}
      </div>
      <div className="text-[24px] text-[#ffe066] crt-glow-yellow retro-blink">INSERT COIN / PRESS START</div>
      <div className="text-[14px] text-[#a6eef2]">CREDITS: FREE PLAY</div>
    </button>
  );
}

function itemLabel(item: MenuItem) {
  if (item.kind === "game") return item.game.title;
  return item.kind === "leaderboard" ? "HIGH SCORES" : "PRIZE COUNTER";
}

function MenuScreen({ state, onSelect }: { state: ArcadeState; onSelect: (i: number) => void }) {
  const item = MENU_ITEMS[state.menuIndex];
  const gameCount = GAMES.length;

  const row = (entry: MenuItem, i: number) => {
    const active = i === state.menuIndex;
    return (
      <li key={i}>
        <button
          type="button"
          onClick={() => onSelect(i)}
          className={`w-full text-left px-3 py-2 text-[17px] leading-tight rounded cursor-pointer transition-colors ${
            active ? "bg-[#7dffb0] text-[#06221a] crt-select" : "text-[#d8fbff] hover:bg-white/10"
          }`}
        >
          {active ? "▶ " : "  "}
          {itemLabel(entry)}
          {entry.kind === "game" && entry.game.comingSoon && <span className="ml-2 text-[11px] opacity-70">SOON</span>}
        </button>
      </li>
    );
  };

  return (
    <div className="h-full grid grid-cols-[300px_1fr] gap-6 px-8 py-7">
      <div className="flex flex-col gap-3 min-h-0">
        <div className="text-[14px] text-[#7dffb0] crt-glow-green">CABINETS:</div>
        <ul className="space-y-1">{MENU_ITEMS.slice(0, gameCount).map((e, i) => row(e, i))}</ul>
        <div className="text-[14px] text-[#7dffb0] crt-glow-green pt-2">EXTRAS:</div>
        <ul className="space-y-1">{MENU_ITEMS.slice(gameCount).map((e, i) => row(e, i + gameCount))}</ul>
      </div>

      <div className="flex flex-col justify-between border-l-2 border-[#a6eef2]/30 pl-6 min-w-0 menu-detail">
        {item.kind === "game" ? (
          <>
            <div className="space-y-4">
              <div className="text-[46px] tracking-widest preview-bob" aria-hidden>
                {item.game.cabinetArt}
              </div>
              <h2 className="text-[30px] leading-tight text-white crt-glow-white">{item.game.title}</h2>
              <div className="text-[14px] text-[#7dffb0]">
                {item.game.genre.toUpperCase()} · BY {item.game.developer.toUpperCase()}
              </div>
              <p className="font-sans text-[19px] leading-snug text-[#d8fbff]">{item.game.description}</p>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div className="text-[14px] text-[#ffe066]">🎟️ {item.game.payout.toUpperCase()}</div>
              <div className={`text-[18px] retro-blink ${item.game.comingSoon ? "text-[#ff8fa3]" : "text-[#ffe066] crt-glow-yellow"}`}>
                {item.game.comingSoon ? "COMING SOON" : "▶ PRESS START"}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-5">
              <div className="text-[54px]" aria-hidden>
                {item.kind === "leaderboard" ? "🏆" : "🎁"}
              </div>
              <h2 className="text-[30px] leading-tight text-white crt-glow-white">{itemLabel(item)}</h2>
              <p className="font-sans text-[19px] leading-snug text-[#d8fbff]">
                {item.kind === "leaderboard"
                  ? "See who rules the arcade. Top 10 players for every cabinet, filterable by game."
                  : "Cash in the tickets you've won for stickers, plushies and legendary prizes."}
              </p>
            </div>
            <div className="text-right text-[18px] text-[#ffe066] crt-glow-yellow retro-blink">▶ PRESS START</div>
          </>
        )}
      </div>
    </div>
  );
}

function LaunchScreen({ state, onAction }: { state: ArcadeState; onAction: (a: ArcadeAction) => void }) {
  const item = MENU_ITEMS[state.menuIndex];
  if (item.kind !== "game") return null;
  const { game } = item;

  const button = (focus: 0 | 1, label: string, disabled = false) => {
    const active = state.launchFocus === focus;
    return (
      <button
        type="button"
        onClick={() => onAction(focus === 0 ? "start" : "back")}
        className={`px-5 py-3 text-[18px] rounded border-4 cursor-pointer transition-colors ${
          active
            ? disabled
              ? "border-[#ff8fa3] bg-[#ff8fa3] text-[#2a0710]"
              : "border-[#ffe066] bg-[#ffe066] text-[#2a2000] crt-select"
            : "border-[#a6eef2]/60 text-[#d8fbff] hover:bg-white/10"
        }`}
      >
        {active ? "▶ " : ""}
        {label}
      </button>
    );
  };

  return (
    <div className="relative h-full">
      {/* Boot sequence: shows first, then the detail card fades in over it. */}
      <div className="launch-loading absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div className="text-[22px] text-[#7dffb0] crt-glow-green">LOADING {game.title}</div>
        <div className="w-[420px] h-6 border-4 border-[#7dffb0] p-1">
          <div className="launch-bar h-full bg-[#7dffb0]" />
        </div>
        <div className="text-[13px] text-[#a6eef2]">CHECKING ROM ... OK</div>
      </div>

      <div className="launch-detail h-full flex flex-col justify-between px-10 py-8">
        <div className="flex gap-8 items-start">
          <div className="shrink-0 w-[220px] h-[170px] rounded-lg border-4 border-[#a6eef2]/50 bg-black/30 flex items-center justify-center text-[38px] preview-bob">
            {game.cabinetArt}
          </div>
          <div className="space-y-3 min-w-0">
            <h2 className="text-[32px] leading-tight text-white crt-glow-white">{game.title}</h2>
            <div className="text-[15px] text-[#7dffb0]">{game.subtitle.toUpperCase()}</div>
            <p className="font-sans text-[19px] leading-snug text-[#d8fbff]">{game.description}</p>
            <div className="text-[14px] text-[#ffe066]">🎟️ WIN {game.payout.toUpperCase()}</div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div key={state.deniedAt} className={`text-[15px] ${state.deniedAt ? "denied-shake text-[#ff8fa3]" : "text-[#a6eef2]"}`}>
            {game.comingSoon ? (state.deniedAt ? "CABINET NOT READY YET!" : "THIS CABINET IS STILL BEING BUILT") : "GOOD LUCK, PLAYER 1"}
          </div>
          <div className="flex gap-4">
            {button(0, game.comingSoon ? "COMING SOON" : "PLAY NOW", game.comingSoon)}
            {button(1, "BACK TO ARCADE")}
          </div>
        </div>
      </div>
    </div>
  );
}

const RANK_STYLES = [
  "text-[#ffe066] crt-glow-yellow",
  "text-[#e6f1f5]",
  "text-[#ffb37a]",
];

function LeaderboardScreen({
  state,
  scores,
  onAction,
}: {
  state: ArcadeState;
  scores: ScoreEntry[];
  onAction: (a: ArcadeAction) => void;
}) {
  const filterId = BOARD_FILTERS[state.boardFilter];
  const filterGame = filterId ? getGameById(filterId) : undefined;
  const rows = topScores(scores, filterId);

  return (
    <div className="h-full flex flex-col px-8 py-6 gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] text-white crt-glow-white">HIGH SCORES</h2>
        <div className="flex items-center gap-3 text-[15px] text-[#7dffb0]">
          <button type="button" onClick={() => onAction("prev")} className="cursor-pointer px-1 hover:text-white">◀</button>
          <span className="min-w-[230px] text-center">{filterGame ? filterGame.title : "ALL GAMES"}</span>
          <button type="button" onClick={() => onAction("next")} className="cursor-pointer px-1 hover:text-white">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-[60px_1fr_1fr_130px] gap-x-3 text-[12px] text-[#a6eef2] border-b-2 border-[#a6eef2]/40 pb-2">
        <span>RANK</span>
        <span>PLAYER</span>
        <span>GAME</span>
        <span className="text-right">SCORE</span>
      </div>

      {rows.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[18px] text-[#a6eef2]">NO SCORES YET. BE THE FIRST!</div>
      ) : (
        <ol className="flex-1 flex flex-col justify-start">
          {rows.map((entry, i) => (
            <li
              key={`${state.boardFilter}-${i}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`board-row grid grid-cols-[60px_1fr_1fr_130px] gap-x-3 items-center px-1 h-[29px] text-[15px] ${
                i === 0 ? "board-champion" : ""
              } ${entry.isLocal ? "bg-[#7dffb0]/15" : ""}`}
            >
              <span className={RANK_STYLES[i] ?? "text-[#a6eef2]"}>{i === 0 ? "1ST" : i === 1 ? "2ND" : i === 2 ? "3RD" : `${i + 1}TH`}</span>
              <span className={`truncate ${RANK_STYLES[i] ?? "text-[#d8fbff]"}`}>
                {entry.player}
                {i === 0 && " 👑"}
              </span>
              <span className="truncate text-[12px] text-[#a6eef2]">{getGameById(entry.gameId)?.title ?? entry.gameId}</span>
              <span className={`text-right tabular-nums ${RANK_STYLES[i] ?? "text-[#7dffb0]"}`}>
                <CountUp value={entry.score} />
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="text-[11px] text-[#a6eef2]/80 text-center">◀ ▶ CHANGE GAME · BACK TO RETURN</div>
    </div>
  );
}

function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{shown.toLocaleString()}</>;
}
