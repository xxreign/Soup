"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Cabinet } from "./Cabinet";
import { ArcadeRoom } from "./ArcadeRoom";

type CabinetProps = React.ComponentProps<typeof Cabinet>;

export interface ArcadeSceneProps extends CabinetProps {
  /** Wide shows the whole machine; close frames the screen and controls. */
  view: "wide" | "close";
  reducedMotion: boolean;
  fallback: ReactNode;
}

/** Framing for each view: what to look at and how much must fit on screen (world units). */
const VIEWS = {
  wide: { target: new THREE.Vector3(0, 1.12, 0), halfHeight: 1.3, halfWidth: 1.0, lift: 0.25 },
  close: { target: new THREE.Vector3(0, 1.6, 0.15), halfHeight: 0.66, halfWidth: 0.56, lift: 0.18 },
};

function CameraRig({ view, reducedMotion }: { view: "wide" | "close"; reducedMotion: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const look = useRef(VIEWS.wide.target.clone());
  const goal = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer }, delta) => {
    const { target, halfHeight, halfWidth, lift } = VIEWS[view];
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const aspect = size.width / size.height;
    const distance = Math.max(halfHeight / tan, halfWidth / (tan * aspect));
    const px = reducedMotion ? 0 : pointer.x * 0.22;
    const py = reducedMotion ? 0 : pointer.y * 0.1;

    goal.set(target.x + px, target.y + lift + py, target.z + distance);
    const ease = 1 - Math.exp(-delta * 2.6);
    camera.position.lerp(goal, ease);
    look.current.lerp(target, ease);
    camera.lookAt(look.current);
  });

  return null;
}

/** Slow idle sway while the machine sits in attract mode. */
function Sway({ active, children }: { active: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const goal = active ? Math.sin(clock.elapsedTime * 0.35) * 0.08 : 0;
    group.current.rotation.y += (goal - group.current.rotation.y) * (1 - Math.exp(-delta * 2));
  });
  return <group ref={group}>{children}</group>;
}

export default function ArcadeScene({ view, reducedMotion, fallback, ...cabinet }: ArcadeSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 35, near: 0.1, far: 40, position: [0, 1.5, 5] }}
      gl={{ antialias: true }}
      fallback={fallback}
    >
      <color attach="background" args={["#0a1650"]} />
      <fog attach="fog" args={["#0a1650", 7, 15]} />

      <hemisphereLight args={["#7fb2ff", "#0a0f2a", 0.7]} />
      <directionalLight position={[-2.5, 4, 3]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[3, 2.5, 2]} intensity={0.6} color="#9fc4ff" />
      <pointLight position={[0, 2.4, -0.9]} intensity={6} distance={4} color="#3d7bff" />

      {/* Studio light panels, only seen in reflections on the glossy cabinet. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[6, 1.2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2} color="#4f8bff" position={[-4, 1.5, 1]} scale={[3, 3, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2} color="#ff4f6d" position={[4, 1.5, 1]} scale={[3, 3, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.5} color="#5ff6ff" position={[0, 1.5, 4]} scale={2} />
      </Environment>

      <CameraRig view={view} reducedMotion={reducedMotion} />

      <Sway active={view === "wide" && !reducedMotion}>
        <Cabinet {...cabinet} />
      </Sway>
      <ContactShadows position={[0, 0.004, 0]} opacity={0.75} scale={3.2} blur={2.4} far={2.4} resolution={512} color="#000010" />

      <ArcadeRoom reducedMotion={reducedMotion} />
    </Canvas>
  );
}
