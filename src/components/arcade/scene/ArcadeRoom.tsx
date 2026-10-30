"use client";

import { Float, Html, Instance, Instances, Sparkles } from "@react-three/drei";
import { WallSticker } from "../screens/CabinetArt";

const WALL_Z = -1.6;
const COLUMNS = 12;
const DOOR_W = 0.92;
const DOOR_H = 1.86;

const DOORS = Array.from({ length: COLUMNS * 2 }, (_, i) => ({
  x: (i % COLUMNS) - (COLUMNS - 1) / 2,
  y: i < COLUMNS ? 0.95 : 2.85,
}));

const VENT_OFFSETS = [0.72, 0.66, 0.6, 0.54, -0.54, -0.6, -0.66, -0.72];

interface Sticker {
  emoji: string;
  line1: string;
  line2?: string;
  tone: string;
  position: [number, number, number];
  rotation: number;
}

const STICKERS: Sticker[] = [
  { emoji: "🍦", line1: "SUMMER", line2: "SCOOPS", tone: "#ffe9b0", position: [-1.55, 2.35, -1.1], rotation: 0.18 },
  { emoji: "🌴", line1: "SUN'S OUT", line2: "FUN'S OUT", tone: "#b8f5e4", position: [1.6, 2.6, -1.2], rotation: -0.14 },
  { emoji: "🔥", line1: "HI-SCORE", line2: "HEAT", tone: "#ffc6c6", position: [-1.7, 0.95, -1.0], rotation: -0.1 },
  { emoji: "☀️", line1: "GAME ON", tone: "#fff2a8", position: [1.75, 1.15, -1.0], rotation: 0.12 },
];

/** Cobalt locker wall, floor and floating summer stickers around the cabinet. */
export function ArcadeRoom({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      {/* Wall behind the lockers */}
      <mesh position={[0, 3, WALL_Z - 0.06]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#10308f" roughness={0.8} />
      </mesh>

      <Instances limit={DOORS.length}>
        <boxGeometry args={[DOOR_W, DOOR_H, 0.05]} />
        <meshStandardMaterial color="#1f55e0" metalness={0.45} roughness={0.38} />
        {DOORS.map((d, i) => (
          <Instance key={i} position={[d.x, d.y, WALL_Z]} />
        ))}
      </Instances>

      <Instances limit={DOORS.length * VENT_OFFSETS.length}>
        <boxGeometry args={[0.38, 0.024, 0.01]} />
        <meshStandardMaterial color="#0a1a55" roughness={0.9} />
        {DOORS.flatMap((d, i) =>
          VENT_OFFSETS.map((dy, j) => <Instance key={`${i}-${j}`} position={[d.x, d.y + dy, WALL_Z + 0.028]} />)
        )}
      </Instances>

      <Instances limit={DOORS.length}>
        <boxGeometry args={[0.045, 0.2, 0.035]} />
        <meshStandardMaterial color="#c6ccd8" metalness={1} roughness={0.25} />
        {DOORS.map((d, i) => (
          <Instance key={i} position={[d.x + 0.33, d.y, WALL_Z + 0.04]} />
        ))}
      </Instances>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a1240" metalness={0.35} roughness={0.55} />
      </mesh>
      <gridHelper args={[30, 60, "#2a55c8", "#1a3488"]} position={[0, 0.002, 0]} />

      <Sparkles count={70} scale={[7, 3.5, 2.5]} position={[0, 1.8, -0.4]} size={2.4} speed={reducedMotion ? 0 : 0.35} color="#8ff3ff" opacity={0.7} />

      {STICKERS.map((s) => (
        <Float
          key={s.line1}
          speed={reducedMotion ? 0 : 1.4}
          rotationIntensity={reducedMotion ? 0 : 0.25}
          floatIntensity={reducedMotion ? 0 : 0.5}
          position={s.position}
        >
          <Html transform distanceFactor={1} rotation={[0, 0, s.rotation]} pointerEvents="none">
            <WallSticker emoji={s.emoji} line1={s.line1} line2={s.line2} tone={s.tone} />
          </Html>
        </Float>
      ))}
    </group>
  );
}
