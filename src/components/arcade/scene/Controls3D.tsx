"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { ControlId, ControlPresses } from "../arcadeMachine";

export const DECK_WIDTH = 0.94;
export const DECK_DEPTH = 0.314;

interface ControlSpec {
  id: ControlId;
  kind: "stick" | "button";
  x: number;
  z: number;
  label: string;
  color: string;
  radius?: number;
}

/** Positions on the control deck, in deck-local units (x across, z toward the player). */
export const CONTROL_LAYOUT: ControlSpec[] = [
  { id: "leftStick", kind: "stick", x: -0.34, z: -0.01, label: "◀ PREV", color: "#d0161f" },
  { id: "blueBack", kind: "button", x: -0.185, z: 0.0, label: "BACK", color: "#1f5fd6" },
  { id: "blueOk", kind: "button", x: -0.085, z: -0.02, label: "OK", color: "#1f5fd6" },
  { id: "rightStick", kind: "stick", x: 0.07, z: -0.01, label: "NEXT ▶", color: "#d0161f" },
  { id: "redNext", kind: "button", x: 0.215, z: 0.0, label: "NEXT", color: "#d8141c" },
  { id: "redStart", kind: "button", x: 0.315, z: -0.02, label: "START", color: "#d8141c" },
  { id: "hiScore", kind: "button", x: 0.41, z: 0.0, label: "HI-SCORE", color: "#f5b400", radius: 0.024 },
];

/** 0 → 1 → 0 envelope over ~0.4s after a press. */
function pressAmount(elapsedMs: number) {
  if (elapsedMs < 0) return 0;
  if (elapsedMs < 70) return elapsedMs / 70;
  if (elapsedMs < 170) return 1;
  return Math.max(0, 1 - (elapsedMs - 170) / 240);
}

interface ControlProps {
  spec: ControlSpec;
  presses: RefObject<ControlPresses>;
  onPress: (id: ControlId) => void;
}

function useHoverable(id: ControlId, onPress: (id: ControlId) => void) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const handlers = {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
    },
    onPointerOut: () => setHovered(false),
    onPointerDown: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onPress(id);
    },
  };
  return [hovered, handlers] as const;
}

function IndicatorLight({ id, presses, color, z }: { id: ControlId; presses: RefObject<ControlPresses>; color: string; z: number }) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const press = presses.current?.[id];
    const amount = press ? pressAmount(performance.now() - press.at) : 0;
    if (material.current) material.current.emissiveIntensity = 0.25 + amount * 6;
  });
  return (
    <mesh position={[0, 0.004, z]}>
      <sphereGeometry args={[0.007, 12, 8]} />
      <meshStandardMaterial ref={material} color={color} emissive={color} emissiveIntensity={0.25} />
    </mesh>
  );
}

export function Joystick({ spec, presses, onPress }: ControlProps) {
  const pivot = useRef<THREE.Group>(null);
  const ball = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hovered, handlers] = useHoverable(spec.id, onPress);

  useFrame(() => {
    const press = presses.current?.[spec.id];
    const amount = press ? pressAmount(performance.now() - press.at) : 0;
    if (pivot.current) {
      pivot.current.rotation.z = -(press?.dx ?? 0) * 0.42 * amount;
      pivot.current.rotation.x = (press?.dz ?? 0) * 0.42 * amount;
    }
    if (ball.current) ball.current.emissiveIntensity = hovered ? 0.35 : 0.08;
  });

  return (
    <group position={[spec.x, 0, spec.z]} {...handlers}>
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[0.05, 0.054, 0.008, 32]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.022, 0.026, 0.008, 24]} />
        <meshStandardMaterial color="#050507" roughness={0.6} />
      </mesh>
      <group ref={pivot} position={[0, 0.01, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.0065, 0.0075, 0.1, 16]} />
          <meshStandardMaterial color="#c9ccd4" metalness={1} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.115, 0]}>
          <sphereGeometry args={[0.032, 32, 24]} />
          <meshPhysicalMaterial
            ref={ball}
            color={spec.color}
            emissive={spec.color}
            emissiveIntensity={0.08}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
      </group>
      {/* Generous invisible hit area so the stick is easy to click or tap. */}
      <mesh position={[0, 0.06, 0]} visible={false}>
        <cylinderGeometry args={[0.06, 0.06, 0.14, 12]} />
      </mesh>
      <IndicatorLight id={spec.id} presses={presses} color="#7dffb0" z={-0.075} />
    </group>
  );
}

export function ArcadeButton({ spec, presses, onPress }: ControlProps) {
  const radius = spec.radius ?? 0.031;
  const cap = useRef<THREE.Mesh>(null);
  const capMaterial = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hovered, handlers] = useHoverable(spec.id, onPress);

  useFrame(() => {
    const press = presses.current?.[spec.id];
    const amount = press ? pressAmount(performance.now() - press.at) : 0;
    if (cap.current) cap.current.position.y = 0.019 - amount * 0.011;
    if (capMaterial.current) capMaterial.current.emissiveIntensity = (hovered ? 0.45 : 0.12) + amount * 1.2;
  });

  return (
    <group position={[spec.x, 0, spec.z]} {...handlers}>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[radius + 0.009, radius + 0.011, 0.01, 32]} />
        <meshStandardMaterial color="#141418" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh ref={cap} position={[0, 0.019, 0]}>
        <cylinderGeometry args={[radius, radius, 0.022, 32]} />
        <meshPhysicalMaterial
          ref={capMaterial}
          color={spec.color}
          emissive={spec.color}
          emissiveIntensity={0.12}
          roughness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <IndicatorLight id={spec.id} presses={presses} color={spec.color} z={-radius - 0.03} />
    </group>
  );
}

/** Brushed-metal deck surface with the control labels printed on it. */
export function useDeckTexture() {
  return useMemo(() => createDeckTexture(), []);
}

function createDeckTexture() {
  // Seeded so the grain looks the same on every visit.
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const w = 1024;
  const h = Math.round((w * DECK_DEPTH) / DECK_WIDTH);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#8d939c");
  base.addColorStop(0.5, "#c3c8cf");
  base.addColorStop(1, "#7d838c");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // Brushed grain: many faint horizontal strokes.
  for (let i = 0; i < 900; i++) {
    const y = random() * h;
    ctx.strokeStyle = random() > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
    ctx.lineWidth = random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(random() * w * 0.3, y);
    ctx.lineTo(w * (0.7 + random() * 0.3), y);
    ctx.stroke();
  }

  // Canvas top edge is the back of the deck; bottom edge faces the player.
  const toPx = (x: number, z: number) => [(x / DECK_WIDTH + 0.5) * w, (z / DECK_DEPTH + 0.5) * h] as const;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const spec of CONTROL_LAYOUT) {
    const [px, py] = toPx(spec.x, spec.z + 0.075);
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillStyle = "#1c1f26";
    ctx.fillText(spec.label, px, py);
  }

  ctx.strokeStyle = "rgba(20,22,28,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.font = "bold 18px system-ui, sans-serif";
  ctx.fillStyle = "rgba(20,22,28,0.6)";
  ctx.textAlign = "left";
  ctx.fillText("1P", 28, h - 30);
  ctx.textAlign = "right";
  ctx.fillText("FREE PLAY", w - 28, h - 30);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
