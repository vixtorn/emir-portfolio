"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, type MutableRefObject } from "react";
import { Vector3 } from "three";

import { signpostConfig } from "./signpost-config";

type SignpostCameraRigProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

type CameraKeyframe = {
  progress: number;
  position: readonly [number, number, number];
  target: readonly [number, number, number];
};

function smoothstep(value: number) {
  const clamped = Math.min(1, Math.max(0, value));

  return clamped * clamped * (3 - 2 * clamped);
}

function interpolateKeyframes(
  keyframes: readonly CameraKeyframe[],
  progress: number,
  position: Vector3,
  target: Vector3,
) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const nextIndex = keyframes.findIndex(
    (keyframe) => keyframe.progress >= clampedProgress,
  );
  const endIndex = nextIndex === -1 ? keyframes.length - 1 : nextIndex;
  const startIndex = Math.max(0, endIndex - 1);
  const start = keyframes[startIndex];
  const end = keyframes[endIndex];
  const segmentProgress =
    start.progress === end.progress
      ? 0
      : smoothstep(
          (clampedProgress - start.progress) / (end.progress - start.progress),
        );

  position.set(
    start.position[0] + (end.position[0] - start.position[0]) * segmentProgress,
    start.position[1] + (end.position[1] - start.position[1]) * segmentProgress,
    start.position[2] + (end.position[2] - start.position[2]) * segmentProgress,
  );
  target.set(
    start.target[0] + (end.target[0] - start.target[0]) * segmentProgress,
    start.target[1] + (end.target[1] - start.target[1]) * segmentProgress,
    start.target[2] + (end.target[2] - start.target[2]) * segmentProgress,
  );
}

export default function SignpostCameraRig({
  progressRef,
  reducedMotion,
}: SignpostCameraRigProps) {
  const { size } = useThree();
  const positionRef = useRef(new Vector3());
  const targetRef = useRef(new Vector3());

  useFrame(({ camera }) => {
    const keyframes =
      size.width < 760
        ? signpostConfig.cameraChoreography.narrowKeyframes
        : signpostConfig.cameraChoreography.desktopKeyframes;

    interpolateKeyframes(
      keyframes,
      reducedMotion ? 0 : progressRef.current,
      positionRef.current,
      targetRef.current,
    );
    camera.position.copy(positionRef.current);
    camera.lookAt(targetRef.current);
  });

  return null;
}
