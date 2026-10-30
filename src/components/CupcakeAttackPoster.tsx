"use client";

import React from "react";

export function CupcakeAttackPoster() {
  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
      
      {/* Background Ambience / Shirt Fabric Backdrop */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[600/740] rounded-3xl bg-[#030006] border-4 border-black shadow-[0_0_50px_rgba(255,0,128,0.35)] overflow-hidden flex items-center justify-center p-2 sm:p-4">
        
        {/* Soft spray aura in background */}
        <div className="absolute inset-0 bg-radial from-pink-600/25 via-transparent to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 600 740"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="toxicLime" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d9f99d" />
              <stop offset="40%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>

            <linearGradient id="girSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bef264" />
              <stop offset="50%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#4d7c0f" />
            </linearGradient>

            <linearGradient id="frostingCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Hot Pink Airbrush Spray Filter */}
            <filter id="sprayGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="pinkSprayRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff0080" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#ff00a0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff0080" stopOpacity="0" />
            </radialGradient>

            {/* Text Path for Arched "CUPCAKE" */}
            <path id="cupcakeArc" d="M 50 120 Q 300 50 550 120" fill="none" />
          </defs>

          {/* ======================================================== */}
          {/* 1. HOT PINK AIRBRUSH SPRAY CLOUD & SPLATTERS (BACKGROUND) */}
          {/* ======================================================== */}
          <g opacity="0.95">
            {/* Massive organic spray clouds behind head and body */}
            <ellipse cx="300" cy="350" rx="230" ry="250" fill="url(#pinkSprayRadial)" filter="blur(25px)" />
            <ellipse cx="280" cy="180" rx="220" ry="110" fill="#ff0080" opacity="0.3" filter="blur(30px)" />
            <ellipse cx="210" cy="460" rx="160" ry="170" fill="#ff0080" opacity="0.35" filter="blur(25px)" />

            {/* Splatter dots around edges (exact feel of the shirt) */}
            <circle cx="70" cy="190" r="10" fill="#ff0080" />
            <circle cx="45" cy="230" r="5" fill="#ff0080" />
            <circle cx="85" cy="270" r="7" fill="#ff0080" />
            <circle cx="60" cy="310" r="4" fill="#ff0080" />
            <circle cx="95" cy="370" r="12" fill="#ff0080" />
            <circle cx="50" cy="420" r="6" fill="#ff0080" />
            <circle cx="40" cy="480" r="9" fill="#ff0080" />
            <circle cx="65" cy="530" r="5" fill="#ff0080" />

            <circle cx="530" cy="190" r="11" fill="#ff0080" />
            <circle cx="560" cy="240" r="6" fill="#ff0080" />
            <circle cx="520" cy="280" r="8" fill="#ff0080" />
            <circle cx="550" cy="340" r="5" fill="#ff0080" />
            <circle cx="530" cy="400" r="9" fill="#ff0080" />
            <circle cx="560" cy="450" r="7" fill="#ff0080" />
            <circle cx="510" cy="490" r="4" fill="#ff0080" />
            <circle cx="540" cy="540" r="8" fill="#ff0080" />

            {/* Green splatter flecks */}
            <circle cx="80" cy="150" r="4" fill="#a3e635" />
            <circle cx="520" cy="140" r="5" fill="#a3e635" />
            <circle cx="35" cy="360" r="4" fill="#a3e635" />
            <circle cx="565" cy="380" r="5" fill="#a3e635" />
            <circle cx="110" cy="620" r="4" fill="#a3e635" />
          </g>

          {/* ======================================================== */}
          {/* 2. TOP TEXT: "CUPCAKE" (ARCHED) AND "ATTACK" (STACKED) */}
          {/* ======================================================== */}
          
          {/* CUPCAKE (Arched over the top) */}
          <g>
            {/* Hot pink spray shadow under CUPCAKE */}
            <text
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-creepster), Impact, cursive, sans-serif",
                fontSize: "76px",
                fontWeight: "900",
                letterSpacing: "0.08em",
              }}
              filter="blur(8px)"
              opacity="0.9"
            >
              <textPath href="#cupcakeArc" startOffset="50%" textAnchor="middle">
                CUPCAKE
              </textPath>
            </text>

            {/* Black thick cartoon stroke */}
            <text
              fill="#000"
              stroke="#000"
              strokeWidth="14"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                fontFamily: "var(--font-creepster), Impact, cursive, sans-serif",
                fontSize: "76px",
                fontWeight: "900",
                letterSpacing: "0.08em",
              }}
            >
              <textPath href="#cupcakeArc" startOffset="50%" textAnchor="middle">
                CUPCAKE
              </textPath>
            </text>

            {/* Lime-green fill */}
            <text
              fill="url(#toxicLime)"
              style={{
                fontFamily: "var(--font-creepster), Impact, cursive, sans-serif",
                fontSize: "76px",
                fontWeight: "900",
                letterSpacing: "0.08em",
              }}
            >
              <textPath href="#cupcakeArc" startOffset="50%" textAnchor="middle">
                CUPCAKE
              </textPath>
            </text>
          </g>

          {/* ATTACK (Directly below CUPCAKE) */}
          <g transform="translate(300, 185)">
            {/* Hot pink spray shadow under ATTACK */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#ff0080"
              filter="blur(8px)"
              opacity="0.95"
              style={{
                fontFamily: "var(--font-creepster), Impact, cursive, sans-serif",
                fontSize: "82px",
                fontWeight: "900",
                letterSpacing: "0.06em",
              }}
            >
              ATTACK
            </text>

            {/* Black thick cartoon stroke */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#000"
              stroke="#000"
              strokeWidth="16"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                fontFamily: "var(--font-creepster), Impact, cursive, sans-serif",
                fontSize: "82px",
                fontWeight: "900",
                letterSpacing: "0.06em",
              }}
            >
              ATTACK
            </text>

            {/* Lime-green fill */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="url(#toxicLime)"
              style={{
                fontFamily: "var(--font-creepster), Impact, cursive, sans-serif",
                fontSize: "82px",
                fontWeight: "900",
                letterSpacing: "0.06em",
              }}
            >
              ATTACK
            </text>
          </g>


          {/* ======================================================== */}
          {/* 3. GIR CHARACTER (CENTER - SCREAMING WITH CUPCAKE) */}
          {/* ======================================================== */}
          <g id="girCharacter">
            
            {/* --- Torso & Zipper (angled down left) --- */}
            <g stroke="#000" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
              
              {/* Torso outline */}
              <path
                d="M 230 460 L 190 620 L 260 635 L 310 490 Z"
                fill="url(#girSkin)"
              />

              {/* Dark green shadow block on right torso */}
              <path
                d="M 255 465 L 235 630 L 260 635 L 310 490 Z"
                fill="#4d7c0f"
                stroke="none"
              />

              {/* Zipper running down center */}
              <line x1="218" y1="475" x2="218" y2="625" stroke="#000" strokeWidth="7" />
              {/* Zipper cross stitches */}
              <line x1="210" y1="495" x2="226" y2="495" stroke="#000" strokeWidth="4" />
              <line x1="210" y1="520" x2="226" y2="520" stroke="#000" strokeWidth="4" />
              <line x1="210" y1="545" x2="226" y2="545" stroke="#000" strokeWidth="4" />
              <line x1="210" y1="570" x2="226" y2="570" stroke="#000" strokeWidth="4" />
              <line x1="210" y1="595" x2="226" y2="595" stroke="#000" strokeWidth="4" />
              {/* Zipper pull tab */}
              <rect x="211" y="470" width="14" height="22" rx="3" fill="#e2e8f0" stroke="#000" strokeWidth="4" />
              <circle cx="218" cy="483" r="3" fill="#000" />

              {/* Left Black Stick Arm holding Cupcake */}
              <path
                d="M 205 505 L 145 540 L 130 520"
                stroke="#000"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right Black Stick Arm tucked down */}
              <path
                d="M 280 500 L 320 545 L 340 520"
                stroke="#000"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* --- The Cupcake in Hand (Bottom Left) --- */}
            <g stroke="#000" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
              {/* Green Cupcake Wrapper */}
              <path
                d="M 85 530 L 100 600 L 155 595 L 165 525 Z"
                fill="#65a30d"
              />
              {/* Wrapper pleat ridges */}
              <line x1="105" y1="532" x2="114" y2="598" stroke="#365314" strokeWidth="4" />
              <line x1="125" y1="530" x2="128" y2="597" stroke="#365314" strokeWidth="4" />
              <line x1="145" y1="528" x2="142" y2="596" stroke="#365314" strokeWidth="4" />

              {/* Cyan Frosting Top */}
              <path
                d="M 80 530 C 78 505 105 495 120 505 C 130 488 155 490 162 505 C 172 500 178 512 174 530 Z"
                fill="url(#frostingCyan)"
              />
              {/* Blue Frosting Drips */}
              <circle cx="120" cy="510" r="3.5" fill="#ffffff" />
              <circle cx="145" cy="515" r="3" fill="#ff0080" />
              <circle cx="100" cy="535" r="3" fill="#ffffff" />
              <path d="M 95 530 Q 98 548 95 554" stroke="#00e5ff" strokeWidth="4" />
            </g>

            {/* --- GIR Head Base & Cheek Shading --- */}
            <g stroke="#000" strokeWidth="7" strokeLinejoin="round">
              
              {/* Main Head Contour (tilted wedge) */}
              <path
                d="M 125 320 C 115 240 165 175 285 170 C 405 175 450 240 440 320 C 430 380 380 435 280 440 C 180 435 135 380 125 320 Z"
                fill="url(#girSkin)"
              />

              {/* Dark Olive Cheek Shading on Right */}
              <path
                d="M 360 200 C 435 240 445 310 435 340 C 425 385 390 425 340 435 C 390 380 405 280 360 200 Z"
                fill="#4d7c0f"
                stroke="none"
              />

              {/* Forehead Center Stitches */}
              <line x1="260" y1="180" x2="272" y2="210" stroke="#000" strokeWidth="4" strokeLinecap="round" />
              <line x1="250" y1="193" x2="280" y2="198" stroke="#000" strokeWidth="4" strokeLinecap="round" />
              <line x1="275" y1="195" x2="295" y2="218" stroke="#000" strokeWidth="4" strokeLinecap="round" />

              {/* Little Black Triangular Nose */}
              <polygon points="265,305 285,305 275,320" fill="#000" stroke="#000" strokeWidth="3" />
            </g>

            {/* --- Huge Screaming Open Mouth (Extreme comic wide open) --- */}
            <g stroke="#000" strokeWidth="7" strokeLinejoin="round">
              
              {/* Thick Cyan Lip / Frosting Border */}
              <path
                d="M 160 325 Q 275 375 390 320 Q 360 440 275 445 Q 190 440 160 325 Z"
                fill="#00e5ff"
              />

              {/* Dark Void Mouth Interior */}
              <path
                d="M 172 334 Q 275 380 378 330 Q 352 430 275 435 Q 198 430 172 334 Z"
                fill="#07000d"
              />

              {/* Angular Pink Tongue at bottom */}
              <path
                d="M 230 415 Q 275 395 320 415 Q 275 434 230 415 Z"
                fill="#ff0080"
                stroke="none"
              />

              {/* Cyan spittle / frosting droplets inside scream */}
              <circle cx="240" cy="370" r="4.5" fill="#00e5ff" />
              <circle cx="285" cy="365" r="5" fill="#00e5ff" />
              <circle cx="310" cy="380" r="3.5" fill="#00e5ff" />
              <circle cx="220" cy="385" r="3" fill="#00e5ff" />
              <circle cx="260" cy="390" r="4" fill="#00e5ff" />
              <circle cx="335" cy="360" r="3.5" fill="#00e5ff" />
            </g>

            {/* --- Massive Round Mechanical Dome Eyes --- */}
            {/* Left Eye */}
            <g stroke="#000" strokeWidth="8">
              <ellipse
                cx="185"
                cy="260"
                rx="72"
                ry="68"
                fill="#cbd5e1"
              />
              {/* Speckled inner eyeball shading */}
              <ellipse
                cx="190"
                cy="262"
                rx="64"
                ry="60"
                fill="#f1f5f9"
                stroke="#64748b"
                strokeWidth="3"
              />
              {/* Crazy Staring Pupil Dot */}
              <circle cx="170" cy="255" r="14" fill="#000" stroke="none" />
              {/* Highlight */}
              <circle cx="165" cy="250" r="4.5" fill="#ffffff" stroke="none" />
            </g>

            {/* Right Eye */}
            <g stroke="#000" strokeWidth="8">
              <ellipse
                cx="365"
                cy="260"
                rx="72"
                ry="68"
                fill="#cbd5e1"
              />
              {/* Speckled inner eyeball shading */}
              <ellipse
                cx="360"
                cy="262"
                rx="64"
                ry="60"
                fill="#f1f5f9"
                stroke="#64748b"
                strokeWidth="3"
              />
              {/* Crazy Staring Pupil Dot */}
              <circle cx="350" cy="255" r="14" fill="#000" stroke="none" />
              {/* Highlight */}
              <circle cx="345" cy="250" r="4.5" fill="#ffffff" stroke="none" />
            </g>

            {/* Dog Suit Floppy Ears (Left & Right) */}
            <path
              d="M 105 280 C 85 220 100 170 145 180 C 130 220 120 250 105 280 Z"
              fill="#4d7c0f"
              stroke="#000"
              strokeWidth="6"
            />
            <path
              d="M 455 280 C 475 220 460 170 415 180 C 430 220 440 250 455 280 Z"
              fill="#4d7c0f"
              stroke="#000"
              strokeWidth="6"
            />

          </g>


          {/* ======================================================== */}
          {/* 4. LOWER RIGHT TEXT: "THE MADNESS / THE HORROR / THE FROSTING" */}
          {/* (ANGLED SLIGHTLY UPWARD, SITTING BESIDE GIR'S BODY) */}
          {/* ======================================================== */}
          <g transform="translate(370, 535) rotate(-7)">
            
            {/* THE MADNESS */}
            <text
              x="0"
              y="0"
              fill="#000"
              stroke="#000"
              strokeWidth="10"
              strokeLinejoin="round"
              style={{
                fontFamily: "var(--font-bangers), 'Arial Black', Impact, sans-serif",
                fontSize: "40px",
                fontWeight: "900",
                letterSpacing: "0.05em",
              }}
            >
              THE MADNESS
            </text>
            <text
              x="0"
              y="0"
              fill="url(#toxicLime)"
              style={{
                fontFamily: "var(--font-bangers), 'Arial Black', Impact, sans-serif",
                fontSize: "40px",
                fontWeight: "900",
                letterSpacing: "0.05em",
              }}
            >
              THE MADNESS
            </text>

            {/* THE HORROR */}
            <text
              x="8"
              y="38"
              fill="#000"
              stroke="#000"
              strokeWidth="10"
              strokeLinejoin="round"
              style={{
                fontFamily: "var(--font-bangers), 'Arial Black', Impact, sans-serif",
                fontSize: "40px",
                fontWeight: "900",
                letterSpacing: "0.05em",
              }}
            >
              THE HORROR
            </text>
            <text
              x="8"
              y="38"
              fill="url(#toxicLime)"
              style={{
                fontFamily: "var(--font-bangers), 'Arial Black', Impact, sans-serif",
                fontSize: "40px",
                fontWeight: "900",
                letterSpacing: "0.05em",
              }}
            >
              THE HORROR
            </text>

            {/* THE FROSTING */}
            <text
              x="16"
              y="76"
              fill="#000"
              stroke="#000"
              strokeWidth="10"
              strokeLinejoin="round"
              style={{
                fontFamily: "var(--font-bangers), 'Arial Black', Impact, sans-serif",
                fontSize: "40px",
                fontWeight: "900",
                letterSpacing: "0.05em",
              }}
            >
              THE FROSTING
            </text>
            <text
              x="16"
              y="76"
              fill="url(#toxicLime)"
              style={{
                fontFamily: "var(--font-bangers), 'Arial Black', Impact, sans-serif",
                fontSize: "40px",
                fontWeight: "900",
                letterSpacing: "0.05em",
              }}
            >
              THE FROSTING
            </text>

          </g>


          {/* ======================================================== */}
          {/* 5. BOTTOM MOVIE BILLING CREDITS (CURVING ALONG THE BOTTOM) */}
          {/* ======================================================== */}
          
          {/* Left: STARRING GIR AND ZIM AS THE INVADER */}
          <g transform="translate(60, 672)">
            <text
              x="0"
              y="0"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "14px",
                letterSpacing: "0.08em",
              }}
            >
              STARRING
            </text>
            
            <text
              x="58"
              y="10"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "26px",
                fontWeight: "900",
                letterSpacing: "0.06em",
              }}
            >
              GIR
            </text>
            
            <text
              x="62"
              y="23"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.05em",
              }}
            >
              AND
            </text>
            
            <text
              x="60"
              y="44"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "26px",
                fontWeight: "900",
                letterSpacing: "0.06em",
              }}
            >
              ZIM
            </text>

            <text
              x="100"
              y="38"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.08em",
              }}
            >
              AS THE
            </text>
            
            <text
              x="100"
              y="49"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.08em",
              }}
            >
              INVADER
            </text>
          </g>

          {/* Center-Right: WITH DIB and THE ALMIGHTY TALLEST */}
          <g transform="translate(245, 670) rotate(-4)">
            <text
              x="0"
              y="0"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "15px",
                letterSpacing: "0.06em",
              }}
            >
              WITH
            </text>
            <text
              x="36"
              y="1"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "24px",
                fontWeight: "900",
                letterSpacing: "0.06em",
              }}
            >
              DIB
            </text>
            <text
              x="72"
              y="0"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "14px",
                letterSpacing: "0.04em",
              }}
            >
              and
            </text>
            <text
              x="96"
              y="1"
              fill="#ff0080"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "24px",
                fontWeight: "900",
                letterSpacing: "0.06em",
              }}
            >
              THE ALMIGHTY TALLEST
            </text>
          </g>

          {/* Lower Center Billing: A TACOS TACOS UMM... TACOS!!! PRODUCTION */}
          <g transform="translate(370, 700)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill="#ff0080"
              opacity="0.9"
              style={{
                fontFamily: "var(--font-bangers), Impact, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.08em",
              }}
            >
              A TACOS TACOS UMM... TACOS!!! PRODUCTION
            </text>

            <text
              x="0"
              y="15"
              textAnchor="middle"
              fill="#ff0080"
              opacity="0.6"
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                letterSpacing: "0.1em",
              }}
            >
              INVADER ZIM ™ & © 2010 Viacom • SOUP RETRO ARCADE
            </text>
          </g>

        </svg>

      </div>

    </div>
  );
}
