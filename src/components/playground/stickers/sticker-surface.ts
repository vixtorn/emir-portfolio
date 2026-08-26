import type { Vector3 } from "three";

import { canConfig } from "../can/can-config";

export const cylinderSurface = {
  radius: canConfig.bodyRadius,
  height: canConfig.bodyHeight,
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

export const stickerInteraction = {
  visibleArcHalfAngle: 1.77,
} as const;

export const stickerAngularHalfWidth =
  (stickerSurface.width / cylinderSurface.radius) / 2;

export const safeStickerCenterTheta =
  stickerInteraction.visibleArcHalfAngle - stickerAngularHalfWidth;

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

export function rotatedStickerHalfExtents(rotation: number) {
  const cosine = Math.abs(Math.cos(rotation));
  const sine = Math.abs(Math.sin(rotation));

  return {
    horizontal:
      cosine * (stickerSurface.width / 2) + sine * (stickerSurface.height / 2),
    vertical:
      sine * (stickerSurface.width / 2) + cosine * (stickerSurface.height / 2),
  };
}

export function clampStickerVerticalY(verticalY: number, rotation = 0) {
  const { vertical } = rotatedStickerHalfExtents(rotation);
  const limit = cylinderSurface.height / 2 - vertical - stickerSurface.verticalMargin;

  return Math.min(
    limit,
    Math.max(-limit, verticalY),
  );
}

export function clampStickerTheta(theta: number, rotation = 0) {
  const { horizontal } = rotatedStickerHalfExtents(rotation);
  const limit = stickerInteraction.visibleArcHalfAngle - horizontal / cylinderSurface.radius;

  return Math.min(limit, Math.max(-limit, theta));
}

export function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export function unwrapAngle(previousAngle: number, nextAngle: number) {
  return previousAngle + normalizeAngle(nextAngle - previousAngle);
}

export function stickerPoseFromPoint(
  point: Vector3,
  previousTheta: number,
  rotation = 0,
) {
  return {
    theta: clampStickerTheta(
      unwrapAngle(previousTheta, Math.atan2(point.x, point.z)),
      rotation,
    ),
    verticalY: clampStickerVerticalY(point.y, rotation),
  };
}
