"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Group, MathUtils } from "three";

import KeychainModel, { type KeychainBounds } from "./KeychainModel";
import { keychainConfig } from "./keychain-config";

type KeychainPendulumProps = {
  finePointer: boolean;
  reducedMotion: boolean;
};

export default function KeychainPendulum({
  finePointer,
  reducedMotion,
}: KeychainPendulumProps) {
  const ambientRef = useRef<Group>(null);
  const swingRef = useRef<Group>(null);
  const twistRef = useRef<Group>(null);
  const [bounds, setBounds] = useState<KeychainBounds | null>(null);
  const state = useRef({
    angle: 0,
    angularVelocity: 0,
    idleAngle: 0,
    isHovering: false,
    lastInteractionAt: 0,
    previousPointerTime: 0,
    previousPointerX: 0,
  });

  const onBoundsReady = useCallback((next: KeychainBounds) => {
    setBounds(next);
  }, []);

  useFrame((frame, delta) => {
    const ambient = ambientRef.current;
    const swing = swingRef.current;
    const twist = twistRef.current;

    if (!ambient || !swing || !twist) return;

    if (reducedMotion) {
      ambient.position.y = 0;
      swing.rotation.set(0, 0, 0);
      twist.rotation.y = keychainConfig.baseRotationY;
      return;
    }

    const current = state.current;
    const acceleration =
      -keychainConfig.gravity * Math.sin(current.angle) -
      keychainConfig.damping * current.angularVelocity;

    current.angularVelocity = MathUtils.clamp(
      current.angularVelocity + acceleration * delta,
      -keychainConfig.angularVelocityMax,
      keychainConfig.angularVelocityMax,
    );
    current.angle = MathUtils.clamp(
      current.angle + current.angularVelocity * delta,
      -keychainConfig.absoluteAngleMax,
      keychainConfig.absoluteAngleMax,
    );

    const settled =
      Math.abs(current.angle) < 0.004 &&
      Math.abs(current.angularVelocity) < 0.01;
    const idle =
      !current.isHovering &&
      settled &&
      performance.now() / 1000 - current.lastInteractionAt >
        keychainConfig.idleResumeDelay;

    current.idleAngle = MathUtils.damp(
      current.idleAngle,
      idle
        ? Math.sin(
            frame.clock.elapsedTime * keychainConfig.idleSwayAngularVelocity,
          ) * keychainConfig.idleSwayAngle
        : 0,
      5,
      delta,
    );

    ambient.position.y =
      Math.sin(frame.clock.elapsedTime * keychainConfig.floatAngularVelocity) *
      keychainConfig.floatAmplitude;
    swing.rotation.z = current.angle + current.idleAngle;
    swing.rotation.x = MathUtils.clamp(
      -current.angularVelocity * 0.025,
      -keychainConfig.secondaryXMax,
      keychainConfig.secondaryXMax,
    );
    swing.rotation.y = MathUtils.clamp(
      current.angle * 0.18,
      -keychainConfig.secondaryYMax,
      keychainConfig.secondaryYMax,
    );
    twist.rotation.y =
      keychainConfig.baseRotationY +
      Math.sin(
        frame.clock.elapsedTime * keychainConfig.twistAngularVelocity,
      ) *
        keychainConfig.twistAngle *
        (settled ? 1 : keychainConfig.activeTwistMultiplier);
  });

  const move = (event: ThreeEvent<PointerEvent>) => {
    if (!finePointer || reducedMotion) return;

    const current = state.current;
    const x = MathUtils.clamp(event.pointer.x, -1, 1);
    const time = event.nativeEvent.timeStamp / 1000;

    if (current.previousPointerTime) {
      const elapsed = MathUtils.clamp(
        time - current.previousPointerTime,
        1 / 240,
        0.1,
      );
      const pointerVelocity = MathUtils.clamp(
        (x - current.previousPointerX) / elapsed,
        -keychainConfig.pointerVelocityMax,
        keychainConfig.pointerVelocityMax,
      );

      current.angularVelocity = MathUtils.clamp(
        current.angularVelocity +
          pointerVelocity * keychainConfig.impulseMultiplier,
        -keychainConfig.angularVelocityMax,
        keychainConfig.angularVelocityMax,
      );
    }

    current.previousPointerX = x;
    current.previousPointerTime = time;
    current.lastInteractionAt = performance.now() / 1000;
  };

  return (
    <group>
      {bounds && (
        <mesh
          position={bounds.center}
          onPointerEnter={() => {
            state.current.isHovering = true;
          }}
          onPointerLeave={() => {
            state.current.isHovering = false;
            state.current.previousPointerTime = 0;
          }}
          onPointerMove={move}
        >
          <boxGeometry
            args={[
              bounds.size[0] * 1.12,
              bounds.size[1] * 1.1,
              bounds.size[2] * 1.18,
            ]}
          />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      <group ref={ambientRef}>
        <group ref={swingRef} position={[0, keychainConfig.swingPivotY, 0]}>
          <group ref={twistRef}>
            <Suspense fallback={null}>
              <KeychainModel onBoundsReady={onBoundsReady} />
            </Suspense>
          </group>
        </group>
      </group>
    </group>
  );
}
