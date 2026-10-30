"use client";

import { Instance, Instances, Sparkles } from "@react-three/drei";

const WALL_Z = -1.6;
const COLUMNS = 12;
const DOOR_W = 0.92;
const DOOR_H = 1.86;

const DOORS = Array.from({ length: COLUMNS * 2 }, (_, i) => ({
  x: (i % COLUMNS) - (COLUMNS - 1) / 2,
  y: i < COLUMNS ? 0.95 : 2.85,
}));

const VENT_OFFSETS = [0.72, 0.66, 0.6, 0.54, -0.54, -0.6, -0.66, -0.72];

/** Cobalt locker wall and floor around the cabinet. */
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
    </group>
  );
}
