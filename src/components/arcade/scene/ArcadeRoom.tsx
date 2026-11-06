"use client";

import { Sparkles, useTexture } from "@react-three/drei";

const ROOM_WIDTH = 5.4;
const ROOM_HEIGHT = ROOM_WIDTH * (941 / 1672);
const BACK_Z = -2;

/** Lit wallpaper wraps the room, with visible corners and floor trim. */
export function ArcadeRoom({ reducedMotion }: { reducedMotion: boolean }) {
  const wallpaper = useTexture("/gir-background-wide.png");

  return (
    <group>
      {[
        { position: [0, ROOM_HEIGHT / 2, BACK_Z] as [number, number, number], rotation: 0 },
        { position: [-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, BACK_Z + ROOM_WIDTH / 2] as [number, number, number], rotation: Math.PI / 2 },
        { position: [ROOM_WIDTH / 2, ROOM_HEIGHT / 2, BACK_Z + ROOM_WIDTH / 2] as [number, number, number], rotation: -Math.PI / 2 },
      ].map(({ position, rotation }, index) => (
        <group key={index} position={position} rotation={[0, rotation, 0]}>
          <mesh>
            <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
            <meshStandardMaterial map={wallpaper} roughness={0.92} metalness={0} />
          </mesh>
          <mesh position={[0, -ROOM_HEIGHT / 2 + 0.055, 0.025]}>
            <boxGeometry args={[ROOM_WIDTH, 0.11, 0.05]} />
            <meshStandardMaterial color="#42592b" roughness={0.65} />
          </mesh>
          <mesh position={[0, -ROOM_HEIGHT / 2 + 0.115, 0.03]}>
            <boxGeometry args={[ROOM_WIDTH, 0.012, 0.025]} />
            <meshStandardMaterial color="#e885b2" emissive="#d64d91" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
      <pointLight position={[-2.2, 1.2, -1.4]} color="#ffb1d5" intensity={2} distance={4} />
      <pointLight position={[2.2, 1.8, -1.4]} color="#e6ffc2" intensity={2} distance={4} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#24341a" metalness={0.35} roughness={0.55} />
      </mesh>
      <gridHelper args={[30, 60, "#b7dc57", "#547335"]} position={[0, 0.002, 0]} />

      <Sparkles count={70} scale={[7, 3.5, 2.5]} position={[0, 1.8, -0.4]} size={2.4} speed={reducedMotion ? 0 : 0.35} color="#f5ffd6" opacity={0.7} />
    </group>
  );
}
