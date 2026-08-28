"use client";

import { Suspense, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Group, MathUtils } from "three";

import TamagotchiModel from "./TamagotchiModel";
import { tamagotchiConfig } from "./tamagotchi-config";

type TamagotchiMotionProps = {
  finePointer: boolean;
  isHovered: boolean;
  reducedMotion: boolean;
  onHoverChange: (value: boolean) => void;
};

export default function TamagotchiMotion({
  finePointer,
  isHovered,
  reducedMotion,
  onHoverChange,
}: TamagotchiMotionProps) {
  const motionRootRef = useRef<Group>(null);
  const floatGroupRef = useRef<Group>(null);
  const swayGroupRef = useRef<Group>(null);
  const tiltGroupRef = useRef<Group>(null);
  const velocityRef = useRef(tamagotchiConfig.idleAngularVelocity);
  const swayRef = useRef({
    currentX: 0,
    currentY: 0,
    currentRX: 0,
    currentRY: 0,
    currentRZ: 0,
    targetX: 0,
    targetY: 0,
    targetRX: 0,
    targetRY: 0,
    targetRZ: 0,
    velocityX: 0,
    velocityY: 0,
    velocityRX: 0,
    velocityRY: 0,
    velocityRZ: 0,
    lastX: 0,
    lastY: 0,
  });

  useFrame((state, delta) => {
    const root = motionRootRef.current;
    const floatGroup = floatGroupRef.current;
    const sway = swayGroupRef.current;
    const tilt = tiltGroupRef.current;

    if (!root || !floatGroup || !sway || !tilt) return;

    const values = swayRef.current;

    if (reducedMotion) {
      velocityRef.current = 0;
      root.rotation.y = 0;
      floatGroup.position.y = 0;
      sway.position.set(0, 0, 0);
      sway.rotation.set(0, 0, 0);
      tilt.rotation.set(
        tamagotchiConfig.fixedTiltX,
        0,
        tamagotchiConfig.fixedTiltZ,
      );
      return;
    }

    velocityRef.current = MathUtils.damp(
      velocityRef.current,
      tamagotchiConfig.idleAngularVelocity *
        (isHovered ? tamagotchiConfig.hoverRotationMultiplier : 1),
      4,
      delta,
    );
    root.rotation.y += velocityRef.current * delta;

    const time = state.clock.elapsedTime;
    const floatY =
      Math.sin(time * tamagotchiConfig.floatAngularVelocity) *
        tamagotchiConfig.floatAmplitude +
      Math.sin(time * tamagotchiConfig.floatAngularVelocity * 2 + 0.8) *
        0.012;
    floatGroup.position.y = MathUtils.damp(
      floatGroup.position.y,
      floatY * (isHovered ? 0.55 : 1),
      8,
      delta,
    );

    for (const [axis, maxVelocity] of [
      ["X", 0.45],
      ["Y", 0.16],
      ["RX", 0.12],
      ["RY", 0.25],
      ["RZ", 0.28],
    ] as const) {
      const current = `current${axis}` as const;
      const target = `target${axis}` as const;
      const velocity = `velocity${axis}` as const;

      values[velocity] = MathUtils.clamp(
        values[velocity] +
          ((values[target] - values[current]) * tamagotchiConfig.swaySpring -
            values[velocity] * tamagotchiConfig.swayDamping) *
            delta,
        -maxVelocity,
        maxVelocity,
      );
      values[current] += values[velocity] * delta;
    }

    sway.position.set(values.currentX, values.currentY, 0);
    sway.rotation.set(values.currentRX, values.currentRY, values.currentRZ);
    tilt.rotation.x =
      tamagotchiConfig.fixedTiltX +
      Math.sin(time * 0.7) * tamagotchiConfig.microTiltX;
    tilt.rotation.z =
      tamagotchiConfig.fixedTiltZ +
      Math.sin(time * 0.55 + 0.6) * tamagotchiConfig.microTiltZ;
  });

  const resetSway = () => {
    const values = swayRef.current;
    values.targetX = 0;
    values.targetY = 0;
    values.targetRX = 0;
    values.targetRY = 0;
    values.targetRZ = 0;
  };

  const handleMove = (event: ThreeEvent<PointerEvent>) => {
    if (!finePointer || reducedMotion) return;

    const values = swayRef.current;
    const x = MathUtils.clamp(event.pointer.x, -1, 1);
    const y = MathUtils.clamp(event.pointer.y, -1, 1);
    const deltaX = x - values.lastX;
    const deltaY = y - values.lastY;

    values.targetX = x * tamagotchiConfig.swayXMax;
    values.targetY = y * tamagotchiConfig.swayYMax;
    values.targetRX = -y * tamagotchiConfig.swayRotationXMax;
    values.targetRY = x * tamagotchiConfig.swayRotationYMax;
    values.targetRZ = x * tamagotchiConfig.swayRotationZMax;
    values.velocityX = MathUtils.clamp(
      values.velocityX + deltaX * 0.035,
      -0.45,
      0.45,
    );
    values.velocityRZ = MathUtils.clamp(
      values.velocityRZ + deltaX * 0.025,
      -0.28,
      0.28,
    );
    values.velocityRX = MathUtils.clamp(
      values.velocityRX - deltaY * 0.012,
      -0.12,
      0.12,
    );
    values.lastX = x;
    values.lastY = y;
  };

  const handleOut = (event: ThreeEvent<PointerEvent>) => {
    if (!event.intersections.some((intersection) => intersection.object.parent)) {
      onHoverChange(false);
      resetSway();
    }
  };

  return (
    <group ref={motionRootRef}>
      <group ref={floatGroupRef}>
        <group ref={swayGroupRef}>
          <group ref={tiltGroupRef}>
            <Suspense fallback={null}>
              <TamagotchiModel
                onPointerMove={handleMove}
                onPointerOut={handleOut}
                onPointerOver={() => {
                  if (finePointer) onHoverChange(true);
                }}
              />
            </Suspense>
          </group>
        </group>
      </group>
    </group>
  );
}
