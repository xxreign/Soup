"use client";

import React from "react";

export function GirMascot({
  className = "w-72 h-80",
  showHalo = true,
}: {
  className?: string;
  showHalo?: boolean;
}) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {showHalo && (
        <>
          {/* Massive Hot Pink Airbrush Spray Halo behind GIR */}
          <div className="absolute inset-0 bg-[#ff0080]/35 rounded-full blur-2xl transform scale-110 pointer-events-none" />
          <div className="absolute -top-4 -right-4 w-28 h-28 bg-[#a3e635]/25 rounded-full blur-xl pointer-events-none" />
        </>
      )}

      {/* SVG Cartoon Character */}
      <svg
        viewBox="0 0 360 400"
        className={`w-full h-full overflow-visible ${showHalo ? "drop-shadow-[0_0_25px_rgba(255,0,128,0.7)]" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for shaded cartoon volume */}
          <linearGradient id="girSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b4f738" />
            <stop offset="65%" stopColor="#8ed41b" />
            <stop offset="100%" stopColor="#5a9110" />
          </linearGradient>

          <linearGradient id="cupcakeWrapper" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7cb518" />
            <stop offset="50%" stopColor="#9ef01a" />
            <stop offset="100%" stopColor="#558000" />
          </linearGradient>

          <linearGradient id="frostingCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Paint Splatter Filter */}
          <radialGradient id="sprayPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0080" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ff00a0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff0080" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- Background Spray Splatters & Particles --- */}
        {showHalo && (
          <g opacity="0.9">
            {/* Main spray cloud */}
            <ellipse cx="180" cy="200" rx="160" ry="170" fill="url(#sprayPink)" />
            
            {/* Splatter dots around character */}
            <circle cx="50" cy="90" r="5" fill="#ff0080" />
            <circle cx="35" cy="115" r="3" fill="#ff0080" />
            <circle cx="70" cy="65" r="7" fill="#ff0080" />
            <circle cx="85" cy="50" r="4" fill="#ff0080" />
            <circle cx="310" cy="120" r="6" fill="#ff0080" />
            <circle cx="330" cy="140" r="4" fill="#ff0080" />
            <circle cx="320" cy="90" r="8" fill="#ff0080" />
            <circle cx="280" cy="45" r="5" fill="#ff0080" />
            <circle cx="40" cy="240" r="9" fill="#ff0080" />
            <circle cx="25" cy="270" r="4" fill="#ff0080" />
            <circle cx="65" cy="300" r="6" fill="#ff0080" />
            <circle cx="320" cy="280" r="8" fill="#ff0080" />
            <circle cx="340" cy="310" r="5" fill="#ff0080" />
            
            {/* Toxic lime splatter specks */}
            <circle cx="45" cy="140" r="3" fill="#a3e635" />
            <circle cx="305" cy="70" r="4" fill="#a3e635" />
            <circle cx="75" cy="340" r="5" fill="#a3e635" />
            <circle cx="290" cy="330" r="4" fill="#a3e635" />
            <circle cx="180" cy="25" r="5" fill="#a3e635" />
          </g>
        )}

        {/* --- GIR Body --- */}
        <g stroke="#000" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
          
          {/* Torso / Green Dog Disguise */}
          <path
            d="M130 250 L115 365 L180 375 L245 365 L230 250 Z"
            fill="url(#girSkin)"
          />

          {/* Center Zipper line */}
          <line x1="180" y1="270" x2="180" y2="370" stroke="#000" strokeWidth="6" />
          {/* Zipper teeth stitches */}
          <line x1="172" y1="285" x2="188" y2="285" stroke="#000" strokeWidth="3" />
          <line x1="172" y1="305" x2="188" y2="305" stroke="#000" strokeWidth="3" />
          <line x1="172" y1="325" x2="188" y2="325" stroke="#000" strokeWidth="3" />
          <line x1="172" y1="345" x2="188" y2="345" stroke="#000" strokeWidth="3" />
          {/* Zipper pull tab */}
          <rect x="173" y="260" width="14" height="20" rx="3" fill="#cbd5e1" stroke="#000" strokeWidth="3" />
          <circle cx="180" cy="273" r="3" fill="#000" />

          {/* Left Arm holding the Cupcake */}
          <path
            d="M125 280 L75 300 L70 280"
            stroke="#000"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Right Arm waving/thrashing */}
          <path
            d="M235 280 L295 295 L310 270"
            stroke="#000"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Dog suit stitches on arm & neck */}
          <line x1="140" y1="260" x2="148" y2="272" stroke="#000" strokeWidth="3" />
          <line x1="150" y1="258" x2="158" y2="270" stroke="#000" strokeWidth="3" />
          <line x1="210" y1="260" x2="202" y2="272" stroke="#000" strokeWidth="3" />
        </g>

        {/* --- The Cupcake in Hand --- */}
        <g stroke="#000" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          {/* Cupcake Wrapper */}
          <path
            d="M50 290 L60 340 L100 340 L110 290 Z"
            fill="url(#cupcakeWrapper)"
          />
          {/* Wrapper vertical ridges */}
          <line x1="68" y1="292" x2="74" y2="338" stroke="#365314" strokeWidth="3" />
          <line x1="80" y1="292" x2="82" y2="338" stroke="#365314" strokeWidth="3" />
          <line x1="92" y1="292" x2="90" y2="338" stroke="#365314" strokeWidth="3" />
          <line x1="102" y1="292" x2="98" y2="338" stroke="#365314" strokeWidth="3" />

          {/* Frosting Base / Spill (Cyan like the poster) */}
          <path
            d="M45 290 C45 275 60 270 70 275 C75 265 95 265 100 275 C108 270 115 278 115 290 Z"
            fill="url(#frostingCyan)"
          />
          {/* Frosting Sparkles / Drops */}
          <circle cx="70" cy="280" r="3" fill="#ffffff" />
          <circle cx="95" cy="282" r="2.5" fill="#ff0080" />
          <circle cx="82" cy="273" r="2.5" fill="#ffffff" />
          {/* Blue frosting drip on arm */}
          <path d="M60 290 Q62 305 60 310" stroke="#00e5ff" strokeWidth="4" />
        </g>

        {/* --- GIR Head & Screaming Mouth --- */}
        <g stroke="#000" strokeWidth="6" strokeLinejoin="round">
          
          {/* Head Base outline */}
          <path
            d="M75 190 C70 140 100 90 180 85 C260 90 290 140 285 190 C280 230 250 255 180 255 C110 255 80 230 75 190 Z"
            fill="url(#girSkin)"
          />

          {/* Forehead stitch details */}
          <path d="M165 95 L175 115" stroke="#000" strokeWidth="3" />
          <path d="M175 95 L185 115" stroke="#000" strokeWidth="3" />
          <path d="M185 95 L195 115" stroke="#000" strokeWidth="3" />

          {/* Little Black Triangular Nose */}
          <polygon points="175,185 185,185 180,195" fill="#000" />

          {/* Screaming Open Mouth (Extreme comic wide open) */}
          {/* Cyan Lip / Frosting Border */}
          <path
            d="M100 200 Q180 235 260 200 Q240 255 180 260 Q120 255 100 200 Z"
            fill="#00e5ff"
            stroke="#000"
            strokeWidth="5"
          />

          {/* Deep Black / Dark Violet Mouth Interior */}
          <path
            d="M108 206 Q180 238 252 206 Q235 250 180 254 Q125 250 108 206 Z"
            fill="#080211"
          />

          {/* Pink Tongue & Blue Spittle Drops */}
          <ellipse cx="180" cy="245" rx="35" ry="12" fill="#ff0080" />
          <circle cx="160" cy="225" r="3" fill="#00e5ff" />
          <circle cx="195" cy="228" r="4" fill="#00e5ff" />
          <circle cx="215" cy="220" r="2.5" fill="#00e5ff" />
          <circle cx="140" cy="220" r="2" fill="#00e5ff" />
        </g>

        {/* --- Giant Mechanical Staring Eyes --- */}
        {/* Left Eye */}
        <g stroke="#000" strokeWidth="6">
          <ellipse
            cx="115"
            cy="150"
            rx="52"
            ry="48"
            fill="#e2e8f0"
          />
          {/* Subtle eye shading */}
          <ellipse
            cx="118"
            cy="152"
            rx="46"
            ry="42"
            fill="#f8fafc"
          />
          {/* Pupil (Staring dot) */}
          <circle cx="108" cy="148" r="11" fill="#000" />
          {/* Reflection highlight */}
          <circle cx="104" cy="144" r="3.5" fill="#fff" />
        </g>

        {/* Right Eye */}
        <g stroke="#000" strokeWidth="6">
          <ellipse
            cx="245"
            cy="150"
            rx="52"
            ry="48"
            fill="#e2e8f0"
          />
          {/* Subtle eye shading */}
          <ellipse
            cx="242"
            cy="152"
            rx="46"
            ry="42"
            fill="#f8fafc"
          />
          {/* Pupil (Staring dot) */}
          <circle cx="236" cy="148" r="11" fill="#000" />
          {/* Reflection highlight */}
          <circle cx="232" cy="144" r="3.5" fill="#fff" />
        </g>

        {/* Dog Ear Left */}
        <path
          d="M60 170 C45 130 55 100 85 105 C75 130 70 150 60 170 Z"
          fill="#5a9110"
          stroke="#000"
          strokeWidth="5"
        />

        {/* Dog Ear Right */}
        <path
          d="M300 170 C315 130 305 100 275 105 C285 130 290 150 300 170 Z"
          fill="#5a9110"
          stroke="#000"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
}
