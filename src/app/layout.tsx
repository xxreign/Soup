import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TicketProvider } from "@/context/TicketContext";
import { ArcadeShell } from "@/components/ArcadeShell";

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
          <ArcadeShell>{children}</ArcadeShell>
        </TicketProvider>
      </body>
    </html>
  );
}
