"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import { Box3, Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const coneMotion = {
  finalX: -1.25,
  initialTiltZ: (4 * Math.PI) / 180,
  initialX: -1.55,
  initialY: 8.4,
  settleProgress: 0.075,
  slideEndProgress: 0.055,
  z: 0.16,
} as const;

function smoothstep(start: number, end: number, value: number) {
  const normalized = Math.min(1, Math.max(0, (value - start) / (end - start)));

  return normalized * normalized * (3 - 2 * normalized);
}

type SignpostConeProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

export default function SignpostCone({
  progressRef,
  reducedMotion,
}: SignpostConeProps) {
  const gltf = useLoader(GLTFLoader, "/models/signpost/traffic-cone-v1.glb");
  const coneRef = useRef<Group>(null);
  const bounds = useMemo(() => {
    gltf.scene.updateMatrixWorld(true);
    return new Box3().setFromObject(gltf.scene);
  }, [gltf.scene]);
  const groundOffset = -bounds.min.y;

  useFrame(() => {
    const cone = coneRef.current;

    if (!cone) return;

    const progress = reducedMotion ? coneMotion.settleProgress : progressRef.current;
    const slide = smoothstep(0, coneMotion.slideEndProgress, progress);
    const settle = smoothstep(
      coneMotion.slideEndProgress,
      coneMotion.settleProgress,
      progress,
    );

    cone.position.x =
      coneMotion.initialX + (coneMotion.finalX - coneMotion.initialX) * slide;
    cone.position.y = coneMotion.initialY * (1 - slide);
    cone.rotation.z = coneMotion.initialTiltZ * (1 - settle);
  });

  return (
    <group
      ref={coneRef}
      position={[coneMotion.initialX, coneMotion.initialY, coneMotion.z]}
      scale={2}
    >
      <primitive object={gltf.scene} position={[0, groundOffset, 0]} />
    </group>
  );
}
