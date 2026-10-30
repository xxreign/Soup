import Link from "next/link";
import { GAMES } from "@/data/games";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      
      {/* Arcade Marquee Hero */}
      <section className="relative text-center py-10 px-4 rounded-2xl border-4 border-cyan-400 bg-[#0e0e22]/90 neon-border-cyan overflow-hidden">
        {/* Glow backdrop blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full border border-yellow-400/60 bg-yellow-400/10 text-yellow-300 text-[10px] tracking-widest uppercase retro-blink">
            ★ FREE PLAY ACTIVATED • INSERT COIN ★
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            THE ARCADE <span className="text-cyan-400 neon-glow-cyan">FLOOR</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Step up to a retro cabinet, play classic 8-bit games, rack up high scores, and win tickets to cash in at the prize counter!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[10px] text-gray-400">
            <span className="flex items-center gap-1.5 border border-gray-800 bg-gray-900/60 px-3 py-1.5 rounded">
              <span className="text-cyan-400">●</span> 3 CABINETS READY
            </span>
            <span className="flex items-center gap-1.5 border border-gray-800 bg-gray-900/60 px-3 py-1.5 rounded">
              <span className="text-yellow-400">🎟️</span> WIN REAL TICKETS
            </span>
            <span className="flex items-center gap-1.5 border border-gray-800 bg-gray-900/60 px-3 py-1.5 rounded">
              <span className="text-pink-500">🎁</span> SPEND IN PRIZE SHOP
            </span>
          </div>
        </div>
      </section>

      {/* Arcade Cabinets Floor Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-gray-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-yellow-400 neon-glow-yellow flex items-center gap-2">
              <span>🕹️</span> SELECT A CABINET
            </h2>
            <p className="text-[10px] text-gray-400">
              Each teammate builds one arcade machine below
            </p>
          </div>
          <div className="text-[10px] text-cyan-400 border border-cyan-500/40 bg-cyan-950/40 px-3 py-1 rounded">
            SOURCE: <code className="text-white">src/data/games.ts</code>
          </div>
        </div>

        {/* Cabinet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GAMES.map((game, index) => (
            <div
              key={game.id}
              className={`group relative flex flex-col justify-between rounded-xl border-4 ${game.themeColor.border} bg-[#0c0c1e] ${game.themeColor.shadow} transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(0,240,255,0.4)]`}
            >
              {/* Cabinet Marquee Header */}
              <div className="p-4 border-b-2 border-gray-800 bg-[#12122b] rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                    CABINET #{index + 1}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">
                    {game.genre}
                  </span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${game.themeColor.border} ${game.themeColor.text} bg-black/40`}>
                  {game.developer}
                </span>
              </div>

              {/* CRT Cabinet Screen */}
              <div className="p-5 flex-1 flex flex-col space-y-4">
                <div className="relative aspect-video rounded-lg border-2 border-gray-700 bg-black flex flex-col items-center justify-center crt-overlay overflow-hidden shadow-inner p-4 text-center">
                  {/* Subtle scanline line effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

                  {/* Cabinet Pixel Art Art */}
                  <div className="text-2xl sm:text-3xl tracking-widest py-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
                    {game.cabinetArt}
                  </div>

                  {/* Coming Soon Indicator */}
                  {game.comingSoon && (
                    <div className="mt-2 inline-block px-2.5 py-1 rounded border border-pink-500 bg-pink-950/80 text-pink-400 text-[9px] tracking-wider retro-blink shadow-[0_0_10px_rgba(255,0,127,0.5)]">
                      ★ COMING SOON ★
                    </div>
                  )}
                </div>

                {/* Game Title & Description */}
                <div className="space-y-2">
                  <h3 className={`text-base sm:text-lg font-bold tracking-wide ${game.themeColor.text}`}>
                    {game.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed min-h-[40px]">
                    {game.description}
                  </p>
                </div>

                {/* Ticket payout tag */}
                <div className="pt-2 flex items-center justify-between text-[10px] border-t border-gray-800/80">
                  <span className="text-gray-400">EST. REWARD:</span>
                  <span className="text-yellow-400 font-bold flex items-center gap-1">
                    <span>🎟️</span> {game.payout}
                  </span>
                </div>
              </div>

              {/* Cabinet Action Button */}
              <div className="p-4 pt-0">
                <Link
                  href={`/games/${game.id}`}
                  className={`w-full py-3 px-4 rounded-lg font-pixel text-xs font-bold text-center flex items-center justify-center gap-2 border-2 ${game.themeColor.border} bg-black/60 hover:bg-white hover:text-black transition-all duration-150 active:scale-95 shadow-md`}
                >
                  <span>🕹️</span>
                  <span>ENTER CABINET</span>
                </Link>
              </div>

              {/* Coin Slot Detail at bottom */}
              <div className="py-1 px-4 bg-[#070711] border-t border-gray-900 rounded-b-lg flex items-center justify-between text-[8px] text-gray-600">
                <span>SLOT 1: 25¢</span>
                <span className="text-green-500 font-mono">READY</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Teammate Quick-Start Guide Banner */}
      <section className="p-6 rounded-xl border-2 border-yellow-500/40 bg-[#121008] space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold">
          <span>🛠️</span>
          <span>DEVELOPER TEAM GUIDE: HOW TO BUILD YOUR GAME</span>
        </div>

        <p className="text-[11px] text-gray-300 leading-relaxed">
          Welcome team! The shared foundation is set up so everyone can build independently without stepping on each other&apos;s toes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px]">
          <div className="p-3 rounded bg-black/60 border border-gray-800 space-y-1">
            <div className="text-cyan-400 font-bold">1. Claim / Edit Game Info</div>
            <p className="text-gray-400">
              Open <code className="text-yellow-300">src/data/games.ts</code> to update your game&apos;s title, developer name, and colors.
            </p>
          </div>

          <div className="p-3 rounded bg-black/60 border border-gray-800 space-y-1">
            <div className="text-pink-400 font-bold">2. Build Game Screen</div>
            <p className="text-gray-400">
              Your cabinet page lives at <code className="text-yellow-300">src/app/games/[slug]/page.tsx</code>. Replace the &ldquo;Coming soon&rdquo; placeholder with your canvas/game loop!
            </p>
          </div>

          <div className="p-3 rounded bg-black/60 border border-gray-800 space-y-1">
            <div className="text-yellow-400 font-bold">3. Reward Tickets</div>
            <p className="text-gray-400">
              Import <code className="text-yellow-300">useTickets()</code> from <code className="text-yellow-300">@/context/TicketContext</code> and call <code className="text-green-400">addTickets(points)</code>!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
