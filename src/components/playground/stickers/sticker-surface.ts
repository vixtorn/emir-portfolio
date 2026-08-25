import type { Vector3 } from "three";

export const cylinderSurface = {
  radius: 1,
  height: 3,
  radialSegments: 96,
  surfaceOffset: 0.012,
} as const;

export const stickerSurface = {
  width: 0.9,
  height: 0.5,
  horizontalSegments: 18,
  verticalSegments: 4,
  verticalMargin: 0.12,
} as const;

export const stickerVerticalRange = {
  min:
    -cylinderSurface.height / 2 +
    stickerSurface.height / 2 +
    stickerSurface.verticalMargin,
  max:
    cylinderSurface.height / 2 -
    stickerSurface.height / 2 -
    stickerSurface.verticalMargin,
} as const;

export function clampStickerVerticalY(verticalY: number) {
  return Math.min(
    stickerVerticalRange.max,
    Math.max(stickerVerticalRange.min, verticalY),
  );
}

export function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export function unwrapAngle(previousAngle: number, nextAngle: number) {
  return previousAngle + normalizeAngle(nextAngle - previousAngle);
}

export function stickerPoseFromPoint(point: Vector3, previousTheta: number) {
  return {
    theta: unwrapAngle(previousTheta, Math.atan2(point.x, point.z)),
    verticalY: clampStickerVerticalY(point.y),
  };
}
