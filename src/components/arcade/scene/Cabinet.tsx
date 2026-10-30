"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ScoreEntry } from "@/data/leaderboard";
import type { ArcadeAction, ArcadeState, ControlId, ControlPresses } from "../arcadeMachine";
import { CrtScreen } from "../screens/CrtScreen";
import { BezelBottom, BezelTop, FrontPanel, Marquee, SummerSticker } from "../screens/CabinetArt";
import { ArcadeButton, CONTROL_LAYOUT, DECK_DEPTH, DECK_WIDTH, Joystick, useDeckTexture } from "./Controls3D";

/** Html content is authored at 1000 CSS px per world unit (distanceFactor / 400). */
const PX = 0.4;

const INNER_WIDTH = 0.94;
const SIDE_THICKNESS = 0.05;

/** Side silhouette in (depth, height); +depth faces the player. */
function useSideGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.4, 0);
    s.lineTo(0.3, 0);
    s.lineTo(0.3, 0.94);
    s.lineTo(0.44, 1.0);
    s.lineTo(0.44, 1.07);
    s.lineTo(0.15, 1.19);
    s.lineTo(0.06, 1.76);
    s.lineTo(0.2, 1.8);
    s.lineTo(0.2, 2.09);
    s.quadraticCurveTo(0.2, 2.16, 0.13, 2.16);
    s.lineTo(-0.33, 2.16);
    s.quadraticCurveTo(-0.4, 2.16, -0.4, 2.09);
    s.lineTo(-0.4, 0);
    return new THREE.ExtrudeGeometry(s, {
      depth: SIDE_THICKNESS,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 4,
      curveSegments: 16,
    });
  }, []);
}

interface CabinetProps {
  state: ArcadeState;
  scores: ScoreEntry[];
  tickets: number;
  presses: RefObject<ControlPresses>;
  screenChangedAt: RefObject<number>;
  onPress: (id: ControlId) => void;
  onSelect: (menuIndex: number) => void;
  onAction: (action: ArcadeAction) => void;
  onPrizeCounter: () => void;
}

export function Cabinet({
  state,
  scores,
  tickets,
  presses,
  screenChangedAt,
  onPress,
  onSelect,
  onAction,
  onPrizeCounter,
}: CabinetProps) {
  const side = useSideGeometry();
  const deckTexture = useDeckTexture();
  const screenLight = useRef<THREE.PointLight>(null);
  const marqueeLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Steady CRT hum, plus a brief surge whenever the picture changes.
    const sinceChange = performance.now() - (screenChangedAt.current ?? 0);
    const surge = sinceChange < 260 ? (1 - sinceChange / 260) * (Math.random() * 1.5 + 0.5) : 0;
    if (screenLight.current) screenLight.current.intensity = 1.6 + Math.sin(t * 9) * 0.06 + surge;
    if (marqueeLight.current) marqueeLight.current.intensity = 0.9 + Math.sin(t * 2.2) * 0.12;
  });

  return (
    <group>
      {/* Glossy black shell */}
      <mesh geometry={side} material={glossBlack} position={[INNER_WIDTH / 2 + SIDE_THICKNESS, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <mesh geometry={side} material={glossBlack} position={[-INNER_WIDTH / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Box size={[INNER_WIDTH, 2.16, 0.45]} position={[0, 1.08, -0.175]} material={glossBlack} />
      <Box size={[INNER_WIDTH, 0.06, 0.6]} position={[0, 2.13, -0.1]} material={glossBlack} />

      {/* Lower front: info panel + coin door */}
      <Box size={[INNER_WIDTH, 0.92, 0.04]} position={[0, 0.49, 0.28]} material={glossBlack} />
      <Box size={[INNER_WIDTH, 0.06, 0.05]} position={[0, 0.03, 0.29]} material={satinBlack} />
      <Html transform distanceFactor={PX} position={[0, 0.76, 0.302]}>
        <FrontPanel tickets={tickets} onPrizeCounter={onPrizeCounter} />
      </Html>
      <CoinDoor />

      {/* Control panel */}
      <Box size={[INNER_WIDTH, 0.13, 0.14]} position={[0, 1.005, 0.37]} material={glossBlack} />
      <Box size={[INNER_WIDTH + 0.004, 0.012, 0.012]} position={[0, 1.068, 0.442]} material={chrome} />
      <group position={[0, 1.13, 0.295]} rotation={[Math.atan2(0.12, 0.29), 0, 0]}>
        <Box size={[INNER_WIDTH, 0.02, DECK_DEPTH]} position={[0, -0.01, 0]} material={satinBlack} />
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[DECK_WIDTH, DECK_DEPTH]} />
          <meshStandardMaterial map={deckTexture} metalness={0.75} roughness={0.38} />
        </mesh>
        {CONTROL_LAYOUT.map((spec) =>
          spec.kind === "stick" ? (
            <Joystick key={spec.id} spec={spec} presses={presses} onPress={onPress} />
          ) : (
            <ArcadeButton key={spec.id} spec={spec} presses={presses} onPress={onPress} />
          )
        )}
      </group>

      {/* Screen bezel, tilted back like a real cabinet */}
      <group position={[0, 1.475, 0.105]} rotation={[-Math.atan2(0.09, 0.57), 0, 0]}>
        <Box size={[INNER_WIDTH, 0.578, 0.03]} position={[0, 0, -0.015]} material={glossBlack} />
        <Html transform distanceFactor={PX} position={[0, 0, 0.002]}>
          <div className="flex flex-col items-center bg-[#08080c]" style={{ width: 940, height: 578 }}>
            <BezelTop />
            <div style={{ width: 760, height: 462 }}>
              <CrtScreen state={state} scores={scores} onSelect={onSelect} onAction={onAction} />
            </div>
            <BezelBottom />
          </div>
        </Html>
        <pointLight ref={screenLight} position={[0, -0.05, 0.35]} color="#5ff6ff" distance={2.2} decay={2} intensity={1.6} />
      </group>

      {/* Overhang and marquee */}
      <Box size={[INNER_WIDTH, 0.05, 0.15]} position={[0, 1.785, 0.13]} material={glossBlack} />
      <Box size={[INNER_WIDTH, 0.3, 0.03]} position={[0, 1.95, 0.185]} material={glossBlack} />
      <Html transform distanceFactor={PX} position={[0, 1.95, 0.202]}>
        <Marquee />
      </Html>
      <pointLight ref={marqueeLight} position={[0, 1.95, 0.55]} color="#4dff8a" distance={1.4} decay={2} intensity={0.9} />

      <Html transform distanceFactor={PX} position={[0.43, 1.86, 0.26]} rotation={[0, 0, -0.16]} pointerEvents="none">
        <SummerSticker />
      </Html>
    </group>
  );
}

function CoinDoor() {
  return (
    <group position={[0, 0.33, 0.3]}>
      <Box size={[0.36, 0.32, 0.012]} position={[0, 0, 0.006]} material={brushedSteel} />
      {[-0.08, 0.08].map((x) => (
        <group key={x} position={[x, 0.05, 0.014]}>
          <Box size={[0.07, 0.11, 0.006]} position={[0, 0, 0]} material={satinBlack} />
          <mesh position={[0, 0.01, 0.004]}>
            <boxGeometry args={[0.012, 0.05, 0.004]} />
            <meshStandardMaterial color="#ff2a2a" emissive="#ff2a2a" emissiveIntensity={2.2} />
          </mesh>
        </group>
      ))}
      <Box size={[0.12, 0.05, 0.01]} position={[0, -0.1, 0.014]} material={satinBlack} />
    </group>
  );
}

function Box({
  size,
  position,
  material,
}: {
  size: [number, number, number];
  position: [number, number, number];
  material: THREE.Material;
}) {
  return (
    <mesh position={position} material={material}>
      <boxGeometry args={size} />
    </mesh>
  );
}

const glossBlack = new THREE.MeshPhysicalMaterial({
  color: "#0c0c12",
  roughness: 0.22,
  metalness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
});
const satinBlack = new THREE.MeshStandardMaterial({ color: "#121218", roughness: 0.6, metalness: 0.2 });
const chrome = new THREE.MeshStandardMaterial({ color: "#d9dde4", roughness: 0.15, metalness: 1 });
const brushedSteel = new THREE.MeshStandardMaterial({ color: "#5d626b", roughness: 0.45, metalness: 0.85 });
