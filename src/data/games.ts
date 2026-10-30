import { ArcadeGame } from "@/types/game";

/**
 * Shared registry of all arcade games.
 * 
 * Instructions for teammates:
 * - Each teammate can claim one game entry below or add a new one.
 * - Set `id` to the URL slug for your game (e.g. "pacman" -> /games/pacman).
 * - When your game is ready, update `comingSoon: false` and build your component in
 *   `src/app/games/[slug]/page.tsx` (or a dedicated game component).
 */
export const GAMES: ArcadeGame[] = [
  {
    id: "pacman",
    title: "PAC-MAN",
    subtitle: "Ghost Chaser Classic",
    description: "Navigate the neon labyrinth, chomp glowing power pellets, and outwit Blinky, Pinky, Inky, and Clyde before time runs out!",
    developer: "Teammate 1",
    genre: "Maze Chase",
    themeColor: {
      primary: "#ffe600",
      border: "border-yellow-400",
      shadow: "shadow-[0_0_25px_rgba(255,230,0,0.5)]",
      text: "text-yellow-400",
      bgAccent: "bg-yellow-400/10",
    },
    payout: "20 - 60 Tickets",
    comingSoon: true,
    cabinetArt: "ᗧ ··· ᗣ ··· ᗣ",
  },
  {
    id: "space-invaders",
    title: "SPACE INVADERS",
    subtitle: "Galactic Defense",
    description: "Take control of the planetary laser cannon and fend off relentless waves of descending 8-bit extraterrestrial invaders!",
    developer: "Teammate 2",
    genre: "Fixed Shooter",
    themeColor: {
      primary: "#00f0ff",
      border: "border-cyan-400",
      shadow: "shadow-[0_0_25px_rgba(0,240,255,0.5)]",
      text: "text-cyan-400",
      bgAccent: "bg-cyan-400/10",
    },
    payout: "15 - 50 Tickets",
    comingSoon: true,
    cabinetArt: "👾  🛸  👾",
  },
  {
    id: "asteroids",
    title: "ASTEROIDS",
    subtitle: "Deep Space Vector Flight",
    description: "Thrust and rotate your triangular craft through hazardous asteroid fields, shattering colossal space rocks into fragments!",
    developer: "Teammate 3",
    genre: "Vector Arcade",
    themeColor: {
      primary: "#ff007f",
      border: "border-pink-500",
      shadow: "shadow-[0_0_25px_rgba(255,0,127,0.5)]",
      text: "text-pink-500",
      bgAccent: "bg-pink-500/10",
    },
    payout: "25 - 80 Tickets",
    comingSoon: true,
    cabinetArt: "▲  ☄️  💥",
  },
  {
    id: "balloon-pup",
    title: "BALLOON PUP",
    subtitle: "Float Through the Spikes",
    description: "Tap to puff a little green pup and its heart balloon up through gaps in rows of metal spikes. Don't let the balloon pop!",
    developer: "Sean",
    genre: "Endless Flyer",
    themeColor: {
      primary: "#39ff14",
      border: "border-green-400",
      shadow: "shadow-[0_0_25px_rgba(57,255,20,0.5)]",
      text: "text-green-400",
      bgAccent: "bg-green-400/10",
    },
    payout: "2 - 50 Tickets",
    comingSoon: false,
    cabinetArt: "🐶 🎈 ▲",
  },
];

export function getGameById(id: string): ArcadeGame | undefined {
  return GAMES.find((game) => game.id.toLowerCase() === id.toLowerCase());
}
