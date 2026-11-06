"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

interface ArcadeShellProps {
  children: React.ReactNode;
}

export function ArcadeShell({ children }: ArcadeShellProps) {
  const pathname = usePathname();
  const isFullscreenGame = pathname?.startsWith("/games/crossy-road");

  // When on Crossy Road (fullscreen game), render directly with zero outside headers, footers, or margins!
  if (isFullscreenGame) {
    return <main className="w-screen h-screen overflow-hidden">{children}</main>;
  }

  // Normal arcade floor layout with header and footer
  return (
    <div className="relative flex flex-col min-h-screen arcade-grid-bg">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Retro Arcade Footer */}
      <footer className="border-t-2 border-gray-900 bg-[#05050b] py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-gray-400">
            🕹️ <span className="text-cyan-400">RETRO ARCADE CO-OP</span> • INSERT COIN TO PLAY
          </p>
          <p className="text-[9px] text-gray-600">
            SHARED FOUNDATION: GAMES REGISTRY • TICKET WALLET • PRIZE SHOP
          </p>
        </div>
      </footer>
    </div>
  );
}
