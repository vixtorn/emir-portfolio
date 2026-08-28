"use client";

import { Suspense, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { DirectionalLight, Group, MathUtils } from "three";

import StickerCollection from "../stickers/StickerCollection";
import CanModel from "./CanModel";
import { canConfig } from "./can-config";

type CanArtifactProps = {
  onCursorChange?: (cursor: string) => void;
  prefersReducedMotion: boolean;
  rareUnlocked?: boolean;
};

function CanMotion({
  isHovered,
  isStickerDragging,
  onCursorChange,
  onHoverChange,
  onStickerDraggingChange,
  prefersReducedMotion,
  rareUnlocked,
}: {
  isHovered: boolean;
  isStickerDragging: boolean;
  onCursorChange?: (cursor: string) => void;
  onHoverChange: (hovered: boolean) => void;
  onStickerDraggingChange: (dragging: boolean) => void;
  prefersReducedMotion: boolean;
  rareUnlocked: boolean;
}) {
  const rotationGroupRef = useRef<Group>(null);
  const floatingGroupRef = useRef<Group>(null);
  const rotationVelocityRef = useRef(canConfig.idleAngularVelocity);

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      rotationVelocityRef.current = 0;
      rotationGroupRef.current?.rotation.set(0, 0, 0);
      floatingGroupRef.current?.position.set(0, 0, 0);
      return;
    }

    const targetVelocity =
      isHovered || isStickerDragging ? 0 : canConfig.idleAngularVelocity;

    rotationVelocityRef.current = MathUtils.damp(
      rotationVelocityRef.current,
      targetVelocity,
      4,
      delta,
    );
    if (rotationGroupRef.current) {
      rotationGroupRef.current.rotation.y += rotationVelocityRef.current * delta;
    }

    if (!isStickerDragging && floatingGroupRef.current) {
      const targetFloatY =
        Math.sin(state.clock.elapsedTime * canConfig.floatAngularVelocity) *
        canConfig.floatAmplitude;

      floatingGroupRef.current.position.y = MathUtils.damp(
        floatingGroupRef.current.position.y,
        targetFloatY,
        12,
        delta,
      );
    }
  });

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    const isStillOverCan = event.intersections.some(
      (intersection) => intersection.object.userData.canSurface === true,
    );

    if (!isStillOverCan) onHoverChange(false);
  };

  return (
    <group ref={rotationGroupRef}>
      <group
        ref={floatingGroupRef}
        rotation={[canConfig.idleTiltX, 0, canConfig.idleTiltZ]}
      >
        <Suspense fallback={null}>
          <CanModel
            onPointerOut={handlePointerOut}
            onPointerOver={() => onHoverChange(true)}
          />
        </Suspense>
        <StickerCollection
          onCursorChange={onCursorChange}
          onDraggingChange={onStickerDraggingChange}
          onHoverChange={onHoverChange}
          rareUnlocked={rareUnlocked}
        />
      </group>
    </group>
  );
}

function CanLightSweep({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  const lightRef = useRef<DirectionalLight>(null);

  useFrame((state) => {
    if (prefersReducedMotion || !lightRef.current) return;

    lightRef.current.position.x =
      Math.sin(state.clock.elapsedTime * canConfig.lightSweepAngularVelocity) *
      canConfig.lightSweepTravel;
  });

  return (
    <directionalLight
      ref={lightRef}
      intensity={canConfig.lightSweepIntensity}
      position={[0, 2.8, 6]}
      visible={!prefersReducedMotion}
    />
  );
}

export default function CanArtifact({
  onCursorChange,
  prefersReducedMotion,
  rareUnlocked = false,
}: CanArtifactProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isStickerDragging, setIsStickerDragging] = useState(false);

  return (
    <>
      <CanLightSweep prefersReducedMotion={prefersReducedMotion} />
      <CanMotion
        isHovered={isHovered}
        isStickerDragging={isStickerDragging}
        onCursorChange={onCursorChange}
        onHoverChange={setIsHovered}
        onStickerDraggingChange={setIsStickerDragging}
        prefersReducedMotion={prefersReducedMotion}
        rareUnlocked={rareUnlocked}
      />
    </>
  );
}
