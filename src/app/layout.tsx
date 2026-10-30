import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TicketProvider } from "@/context/TicketContext";
import { Header } from "@/components/Header";
import { HideOnGameScreen } from "@/components/HideOnGameScreen";

const pressStart2P = localFont({
  src: "../fonts/PressStart2P-Regular.ttf",
  variable: "--font-press-start",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEON RETRO ARCADE | Classic Games & Prize Counter",
  description: "Play classic arcade games, earn tickets, and cash them in at the prize shop!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart2P.variable} dark`}>
      <body className="min-h-screen bg-[#080812] text-gray-100 flex flex-col font-pixel selection:bg-pink-500 selection:text-white">
        <TicketProvider>
          <div className="relative flex flex-col min-h-screen arcade-grid-bg">
            <HideOnGameScreen>
              <Header />
            </HideOnGameScreen>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            
            <HideOnGameScreen>
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
            </HideOnGameScreen>
          </div>
        </TicketProvider>
      </body>
    </html>
  );
}
