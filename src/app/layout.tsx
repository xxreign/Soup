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

const bangers = localFont({
  src: "../fonts/Bangers-Regular.ttf",
  variable: "--font-bangers",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOUP ARCADE | Cupcake Attack Toxic Retro Floor",
  description: "Crossy Road, Flappy Bird, Minesweeper, Subway Surfers - play games and win tickets!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${bangers.variable} dark`}>
      <body className="min-h-screen bg-[#07010a] text-gray-100 flex flex-col font-pixel selection:bg-pink-500 selection:text-white">
        <TicketProvider>
          <div className="relative flex flex-col min-h-screen arcade-grunge-bg">
            <HideOnGameScreen>
              <Header />
            </HideOnGameScreen>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
            
            <HideOnGameScreen>
              {/* Retro / Grunge Arcade Footer */}
              <footer className="border-t-4 border-black bg-[#040006] py-8 text-center text-xs">
                <div className="max-w-7xl mx-auto px-4 space-y-3">
                  <div className="font-comic text-xl text-lime-400 tracking-wider text-stroke-black-sm">
                    ★ THE MADNESS • THE HORROR • THE TICKETS ★
                  </div>
                  <p className="text-[10px] text-pink-400 tracking-widest font-mono uppercase">
                    A TACOS TACOS PRODUCTION • 4 CABINETS STANDING BY • EARN TICKETS FOR THE PRIZE VAULT
                  </p>
                  <div className="text-[9px] text-gray-500 font-pixel">
                    CROSSY ROAD • FLAPPY BIRD • MINESWEEPER • SUBWAY SURFERS
                  </div>
                </div>
              </footer>
            </HideOnGameScreen>
          </div>
        </TicketProvider>
      </body>
    </html>
  );
}
