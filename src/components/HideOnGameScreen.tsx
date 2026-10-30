"use client";

import { usePathname } from "next/navigation";
import { getGameById } from "@/data/games";

/** Hides the arcade header/footer on playable game pages so the game fills the screen on its own. */
export function HideOnGameScreen({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.match(/^\/games\/([^/]+)/)?.[1];
  const game = slug ? getGameById(slug) : undefined;
  if (game && !game.comingSoon) return null;
  return <>{children}</>;
}
