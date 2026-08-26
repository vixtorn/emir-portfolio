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
  angularDragSensitivity: 0.012,
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

export function stickerPoseFromPoint(
  point: Vector3,
  theta: number,
  rotation = 0,
) {
  return {
    theta,
    verticalY: clampStickerVerticalY(point.y, rotation),
  };
}
