import type { Vector3 } from "three";

import { canConfig } from "../can/can-config";

export const cylinderSurface = {
  radius: canConfig.bodyRadius,
  height: canConfig.bodyHeight,
  radialSegments: 96,
  surfaceOffset: 0.012,
} as const;

export const stickerSurface = {
  horizontalSegments: 18,
  verticalSegments: 4,
  verticalMargin: 0.12,
} as const;

export const stickerInteraction = {
  angularDragSensitivity: 0.012,
} as const;

export function rotatedStickerHalfExtents(
  width: number,
  height: number,
  rotation: number,
) {
  const cosine = Math.abs(Math.cos(rotation));
  const sine = Math.abs(Math.sin(rotation));

  return {
    horizontal: cosine * (width / 2) + sine * (height / 2),
    vertical: sine * (width / 2) + cosine * (height / 2),
  };
}

export function clampStickerVerticalY(
  verticalY: number,
  width: number,
  height: number,
  rotation = 0,
) {
  const { vertical } = rotatedStickerHalfExtents(width, height, rotation);
  const limit = cylinderSurface.height / 2 - vertical - stickerSurface.verticalMargin;

  return Math.min(
    limit,
    Math.max(-limit, verticalY),
  );
}

export function stickerPoseFromPoint(
  point: Vector3,
  theta: number,
  width: number,
  height: number,
  rotation = 0,
) {
  return {
    theta,
    verticalY: clampStickerVerticalY(point.y, width, height, rotation),
  };
}
