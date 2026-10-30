/**
 * High-score data for the arcade leaderboard.
 *
 * SAMPLE_SCORES is placeholder data so the board looks alive before games report real
 * scores. Scores from this browser (e.g. Balloon Pup runs) are saved with `recordScore`
 * and merged in by `topScores`. To move to a real backend, replace `recordScore` and
 * `getLocalScores` with API calls that return the same `ScoreEntry` shape.
 */

export interface ScoreEntry {
  player: string;
  /** Matches an `id` in `src/data/games.ts`. */
  gameId: string;
  score: number;
  /** True for scores set in this browser. */
  isLocal?: boolean;
}

export const LOCAL_PLAYER_NAME = "YOU";

export const SAMPLE_SCORES: ScoreEntry[] = [
  { player: "PIXELQUEEN", gameId: "pacman", score: 88420 },
  { player: "ZAPMASTER", gameId: "pacman", score: 61250 },
  { player: "GHOSTBYTE", gameId: "pacman", score: 47830 },
  { player: "MAZE_RAT", gameId: "pacman", score: 29110 },
  { player: "STARFALL", gameId: "space-invaders", score: 31580 },
  { player: "LASERLOU", gameId: "space-invaders", score: 24770 },
  { player: "ZAPMASTER", gameId: "space-invaders", score: 19900 },
  { player: "COSMO_K", gameId: "space-invaders", score: 12640 },
  { player: "ROCKSMASH", gameId: "asteroids", score: 52300 },
  { player: "VECTORVIX", gameId: "asteroids", score: 38450 },
  { player: "PIXELQUEEN", gameId: "asteroids", score: 26010 },
  { player: "DRIFTER", gameId: "asteroids", score: 14275 },
  { player: "PUPPYPILOT", gameId: "balloon-pup", score: 58 },
  { player: "HEARTFLOAT", gameId: "balloon-pup", score: 41 },
  { player: "SPIKEDODGE", gameId: "balloon-pup", score: 33 },
  { player: "GHOSTBYTE", gameId: "balloon-pup", score: 21 },
  { player: "COSMO_K", gameId: "balloon-pup", score: 12 },
];

const STORAGE_KEY = "retro_arcade_scores";
const UPDATE_EVENT = "retro_arcade_scores_changed";
const MAX_LOCAL_SCORES_PER_GAME = 10;
const EMPTY: ScoreEntry[] = [];

let cachedRaw: string | null = null;
let cachedScores: ScoreEntry[] = EMPTY;

/** Scores saved in this browser. Returns a stable array so it works with useSyncExternalStore. */
export function getLocalScores(): ScoreEntry[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedScores;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedScores = Array.isArray(parsed)
      ? parsed
          .filter((e): e is { gameId: string; score: number } =>
            typeof e?.gameId === "string" && typeof e?.score === "number"
          )
          .map((e) => ({ player: LOCAL_PLAYER_NAME, gameId: e.gameId, score: e.score, isLocal: true }))
      : EMPTY;
  } catch {
    cachedScores = EMPTY;
  }
  return cachedScores;
}

export function getServerLocalScores(): ScoreEntry[] {
  return EMPTY;
}

export function subscribeToLocalScores(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}

/** Save a finished run. Only the best few scores per game are kept. */
export function recordScore(gameId: string, score: number) {
  if (typeof window === "undefined" || !Number.isFinite(score) || score <= 0) return;
  const others = getLocalScores().filter((e) => e.gameId !== gameId);
  const forGame = [...getLocalScores().filter((e) => e.gameId === gameId), { gameId, score: Math.floor(score) }]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_LOCAL_SCORES_PER_GAME);
  const stored = [...others, ...forGame].map(({ gameId, score }) => ({ gameId, score }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

/** Top entries, highest first. Pass a game id to filter to one game. */
export function topScores(entries: ScoreEntry[], gameId?: string, limit = 10): ScoreEntry[] {
  return entries
    .filter((e) => !gameId || e.gameId === gameId)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
