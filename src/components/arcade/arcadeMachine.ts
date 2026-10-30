import { GAMES } from "@/data/games";
import type { ArcadeGame } from "@/types/game";

/** Every physical control on the cabinet. Keyboard and touch input map onto these too. */
export type ControlId = "leftStick" | "rightStick" | "blueBack" | "blueOk" | "redNext" | "redStart" | "hiScore";

export type ArcadeAction = "prev" | "next" | "confirm" | "back" | "start" | "leaderboard";

export const CONTROL_ACTIONS: Record<ControlId, ArcadeAction> = {
  leftStick: "prev",
  rightStick: "next",
  blueBack: "back",
  blueOk: "confirm",
  redNext: "next",
  redStart: "start",
  hiScore: "leaderboard",
};

export type MenuItem =
  | { kind: "game"; game: ArcadeGame }
  | { kind: "leaderboard" }
  | { kind: "shop" };

export const MENU_ITEMS: MenuItem[] = [
  ...GAMES.map((game) => ({ kind: "game" as const, game })),
  { kind: "leaderboard" },
  { kind: "shop" },
];

/** Leaderboard filters: undefined means all games. */
export const BOARD_FILTERS: (string | undefined)[] = [undefined, ...GAMES.map((g) => g.id)];

export type Screen = "attract" | "menu" | "launch" | "leaderboard";

export interface ArcadeState {
  screen: Screen;
  menuIndex: number;
  /** On the launch screen: 0 = PLAY NOW, 1 = BACK TO ARCADE. */
  launchFocus: 0 | 1;
  boardFilter: number;
  /** Bumped when the launch screen refuses to start a game that isn't ready. */
  deniedAt: number;
}

export const INITIAL_STATE: ArcadeState = {
  screen: "attract",
  menuIndex: 0,
  launchFocus: 0,
  boardFilter: 0,
  deniedAt: 0,
};

/** Side effects the page performs after a transition. */
export type ArcadeEffect = { type: "navigate"; href: string } | null;

const wrap = (i: number, n: number) => (i + n) % n;

function selectedGame(state: ArcadeState): ArcadeGame | undefined {
  const item = MENU_ITEMS[state.menuIndex];
  return item.kind === "game" ? item.game : undefined;
}

function openLeaderboard(state: ArcadeState): ArcadeState {
  // Opening the board while a game is highlighted shows that game's scores.
  const game = state.screen === "attract" ? undefined : selectedGame(state);
  const filter = game ? BOARD_FILTERS.indexOf(game.id) : 0;
  return { ...state, screen: "leaderboard", boardFilter: Math.max(0, filter) };
}

export function transition(state: ArcadeState, action: ArcadeAction): [ArcadeState, ArcadeEffect] {
  if (action === "leaderboard") {
    return state.screen === "leaderboard" ? [{ ...state, screen: "menu" }, null] : [openLeaderboard(state), null];
  }

  switch (state.screen) {
    case "attract":
      if (action === "back") return [state, null];
      return [{ ...state, screen: "menu" }, null];

    case "menu": {
      const n = MENU_ITEMS.length;
      if (action === "prev") return [{ ...state, menuIndex: wrap(state.menuIndex - 1, n) }, null];
      if (action === "next") return [{ ...state, menuIndex: wrap(state.menuIndex + 1, n) }, null];
      if (action === "back") return [{ ...state, screen: "attract" }, null];
      const item = MENU_ITEMS[state.menuIndex];
      if (item.kind === "shop") return [state, { type: "navigate", href: "/shop" }];
      if (item.kind === "leaderboard") return [{ ...state, screen: "leaderboard", boardFilter: 0 }, null];
      return [{ ...state, screen: "launch", launchFocus: 0 }, null];
    }

    case "launch": {
      if (action === "prev" || action === "next") {
        return [{ ...state, launchFocus: state.launchFocus === 0 ? 1 : 0 }, null];
      }
      if (action === "back" || (action === "confirm" && state.launchFocus === 1)) {
        return [{ ...state, screen: "menu" }, null];
      }
      const game = selectedGame(state);
      if (!game || game.comingSoon) return [{ ...state, deniedAt: Date.now() }, null];
      return [state, { type: "navigate", href: `/games/${game.id}` }];
    }

    case "leaderboard": {
      const n = BOARD_FILTERS.length;
      if (action === "prev") return [{ ...state, boardFilter: wrap(state.boardFilter - 1, n) }, null];
      if (action === "next") return [{ ...state, boardFilter: wrap(state.boardFilter + 1, n) }, null];
      return [{ ...state, screen: "menu" }, null];
    }
  }
}

/** Shared between the page and the 3D scene so controls animate on any input source. */
export interface ControlPress {
  at: number;
  /** Joystick tilt direction: x is left/right, z is toward/away from the player. */
  dx: number;
  dz: number;
}

export type ControlPresses = Partial<Record<ControlId, ControlPress>>;
