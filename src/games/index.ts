import type { ComponentType } from "react";
import { BalloonPupGame } from "./balloon-pup/BalloonPupGame";

/**
 * Playable game components, keyed by the `id` in `src/data/games.ts`.
 * Games without an entry here show the Coming Soon placeholder.
 */
export const GAME_COMPONENTS: Record<string, ComponentType> = {
  "balloon-pup": BalloonPupGame,
};
