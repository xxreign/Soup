export interface PrizeItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  accentColor: string;
}

export const PRIZES: PrizeItem[] = [
  {
    id: "neon-sticker",
    name: "Pixel Neon Sticker",
    description: "Holographic retro sticker to slap onto your notebook or cabinet.",
    cost: 15,
    icon: "👾",
    rarity: "COMMON",
    accentColor: "border-cyan-400 text-cyan-400",
  },
  {
    id: "sticky-hand",
    name: "Glow Slime Sticky Hand",
    description: "The classic stretchy rubber hand that grabs anything across the room.",
    cost: 30,
    icon: "🖐️",
    rarity: "COMMON",
    accentColor: "border-green-400 text-green-400",
  },
  {
    id: "pixel-sunglasses",
    name: "8-Bit Pixel Shades",
    description: "Thug life sunglasses designed for 100% arcade coolness.",
    cost: 65,
    icon: "🕶️",
    rarity: "RARE",
    accentColor: "border-yellow-400 text-yellow-400",
  },
  {
    id: "retro-keychain",
    name: "Mini Joystick Keychain",
    description: "Clicky micro-switch joystick that clicks satisfyingly in your pocket.",
    cost: 120,
    icon: "🕹️",
    rarity: "EPIC",
    accentColor: "border-pink-500 text-pink-400",
  },
  {
    id: "giant-kaiju",
    name: "Giant Neon Kaiju Plush",
    description: "The colossal top-shelf prize that towers over the prize booth.",
    cost: 250,
    icon: "🦖",
    rarity: "LEGENDARY",
    accentColor: "border-purple-400 text-purple-400",
  },
  {
    id: "golden-trophy",
    name: "Golden High-Score Trophy",
    description: "Solid arcade prestige proving you are the undisputed champion.",
    cost: 500,
    icon: "🏆",
    rarity: "LEGENDARY",
    accentColor: "border-amber-300 text-amber-300",
  },
];
