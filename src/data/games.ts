import { ArcadeGame } from "@/types/game";

/**
 * Shared registry of all arcade games.
 * 
 * Instructions for teammates:
 * - Each teammate claims one game below or adds their new game.
 * - Build your game canvas or React component in `src/app/games/[slug]/GameClientView.tsx`.
 * - Reward tickets by importing `useTickets()` and calling `addTickets(pts)`!
 */
export const GAMES: ArcadeGame[] = [
  {
    id: "crossy-road",
    title: "CROSSY ROAD",
    subtitle: "Why Did the Chicken Cross the Chaos?",
    description: "Hop through raging 6-lane highways, dodge speeding semi-trucks, hop across river logs, and avoid getting snatched by the hawk!",
    developer: "Teammate 1",
    genre: "Endless Hopper",
    themeColor: {
      primary: "#a3e635",
      border: "border-lime-400",
      shadow: "shadow-[0_0_25px_rgba(163,230,53,0.55)]",
      text: "text-lime-400",
      bgAccent: "bg-lime-400/10",
    },
    payout: "20 - 75 Tickets",
    comingSoon: true,
    cabinetArt: "🐔 🚗 🌊 🪵 🚂",
  },
  {
    id: "flappy-bird",
    title: "FLAPPY BIRD",
    subtitle: "Rage-Quit Pipe Navigator",
    description: "Tap to flap your tiny wings through treacherous toxic green warp pipes. One single pixel miscalculation and your run is toast!",
    developer: "Teammate 2",
    genre: "One-Tap Rage",
    themeColor: {
      primary: "#ff007f",
      border: "border-pink-500",
      shadow: "shadow-[0_0_25px_rgba(255,0,127,0.55)]",
      text: "text-pink-500",
      bgAccent: "bg-pink-500/10",
    },
    payout: "15 - 100 Tickets",
    comingSoon: true,
    cabinetArt: "🐤 🌵 ⚡ 🌵 💥",
  },
  {
    id: "minesweeper",
    title: "MINESWEEPER",
    subtitle: "High-Stakes Hazard Clearance",
    description: "Step onto the digital minefield! Analyze perimeter numbers, plant warning flags with surgeon precision, and clear all unmined tiles!",
    developer: "Teammate 3",
    genre: "Puzzle Strategy",
    themeColor: {
      primary: "#facc15",
      border: "border-yellow-400",
      shadow: "shadow-[0_0_25px_rgba(250,204,21,0.55)]",
      text: "text-yellow-400",
      bgAccent: "bg-yellow-400/10",
    },
    payout: "30 - 90 Tickets",
    comingSoon: true,
    cabinetArt: "🚩 💣 1️⃣ 2️⃣ 💥",
  },
  {
    id: "subway-surfers",
    title: "SUBWAY SURFERS",
    subtitle: "Rail-Grinding Sprint",
    description: "Dash down metro railway tracks, surf over speeding train carriages, snatch coin magnets, and outrun the grumpy inspector with spray can in hand!",
    developer: "Teammate 4",
    genre: "Endless Runner",
    themeColor: {
      primary: "#00f0ff",
      border: "border-cyan-400",
      shadow: "shadow-[0_0_25px_rgba(0,240,255,0.55)]",
      text: "text-cyan-400",
      bgAccent: "bg-cyan-400/10",
    },
    payout: "25 - 80 Tickets",
    comingSoon: true,
    cabinetArt: "🛹 🚆 🪙 💨 🚨",
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
