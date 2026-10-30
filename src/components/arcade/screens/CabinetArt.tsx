"use client";

/** DOM artwork mounted on the cabinet's surfaces. Sizes are in CSS px at the cabinet's scale. */

const MARQUEE_MESSAGE =
  "JOIN THE FUN FOR FREE AND COMPETE FOR EPIC REWARDS  ★  WIN TICKETS ON EVERY CABINET  ★  CASH IN AT THE PRIZE COUNTER  ★  ";

export function Marquee() {
  return (
    <div className="marquee-display font-pixel" style={{ width: 840, height: 220 }}>
      <div className="marquee-track">
        {/* Two copies so the scroll loops without a gap. */}
        <span>{MARQUEE_MESSAGE}</span>
        <span aria-hidden>{MARQUEE_MESSAGE}</span>
      </div>
      <div className="marquee-dots" />
    </div>
  );
}

export function BezelTop() {
  return (
    <div className="flex items-center justify-center gap-3 text-white" style={{ width: 940, height: 56 }}>
      <span className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-[20px] font-black">◉</span>
      <span className="font-sans font-black italic text-[26px] tracking-tight">neon retro</span>
      <span className="font-sans text-[13px] uppercase tracking-[0.35em] text-gray-300 pt-1">arcade</span>
    </div>
  );
}

export function BezelBottom() {
  return (
    <div className="flex items-center justify-center gap-3" style={{ width: 940, height: 60 }}>
      <span className="w-14 h-9 rounded-lg border-4 border-[#f5b400] flex items-center justify-center text-[#f5b400] text-[14px] font-black">
        ✚ ●
      </span>
      <span className="font-sans font-black leading-none text-white">
        <span className="block text-[26px]">FREE PLAY</span>
        <span className="block text-[11px] tracking-[0.4em] text-gray-300">ZONE</span>
      </span>
    </div>
  );
}

export function FrontPanel({ tickets, onPrizeCounter }: { tickets: number; onPrizeCounter: () => void }) {
  return (
    <div className="flex items-center justify-between px-10 text-[#e8e8ee] font-sans" style={{ width: 940, height: 300 }}>
      <div className="space-y-4 uppercase">
        <div>
          <div className="text-[16px] font-bold tracking-wider text-gray-400">Venue</div>
          <div className="text-[24px] font-black tracking-wide">The Arcade Floor · Online</div>
        </div>
        <div>
          <div className="text-[16px] font-bold tracking-wider text-gray-400">Open</div>
          <div className="text-[24px] font-black tracking-wide">All Summer · Free Play</div>
        </div>
      </div>

      <div className="stamp">
        <span className="text-[22px]">FREE PLAY</span>
        <span className="text-[34px] leading-none">ALL</span>
        <span className="text-[22px]">SUMMER</span>
      </div>

      <button
        type="button"
        onClick={onPrizeCounter}
        className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 border-[#f5b400]/70 bg-black/40 cursor-pointer hover:bg-[#f5b400]/15 transition-colors"
      >
        <span className="text-[15px] font-bold tracking-widest text-gray-300">YOUR TICKETS</span>
        <span className="font-pixel text-[30px] text-[#ffe066] crt-glow-yellow">{tickets.toLocaleString()}</span>
        <span className="text-[14px] font-bold tracking-widest text-[#f5b400]">PRIZE COUNTER →</span>
      </button>
    </div>
  );
}

export function SummerSticker() {
  return (
    <div className="summer-sticker" style={{ width: 300 }}>
      <span className="tape tape-left" />
      <span className="tape tape-right" />
      <div className="summer-sticker-word">SUM</div>
      <div className="summer-sticker-word">MER</div>
      <div className="summer-sticker-tag">ARCADE NIGHTS</div>
    </div>
  );
}

export function WallSticker({ emoji, line1, line2, tone }: { emoji: string; line1: string; line2?: string; tone: string }) {
  return (
    <div className="wall-sticker" style={{ background: tone }}>
      <span className="text-[56px] leading-none">{emoji}</span>
      <span className="font-sans font-black text-[22px] leading-none text-[#1b1b2f]">{line1}</span>
      {line2 && <span className="font-sans font-black text-[16px] leading-none text-[#1b1b2f]/80">{line2}</span>}
    </div>
  );
}
