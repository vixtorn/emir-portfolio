"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
} from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, DoubleSide } from "three";

import { cylinderSurface, stickerSurface } from "./sticker-surface";

export type CurvedStickerPatchHandle = {
  setPosition: (theta: number, verticalY: number) => void;
};

type CurvedStickerPatchProps = {
  initialTheta: number;
  initialVerticalY: number;
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
  onPointerUp: (event: ThreeEvent<PointerEvent>) => void;
  onPointerCancel: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
};

function updatePatchGeometry(
  geometry: BufferGeometry,
  theta: number,
  verticalY: number,
) {
  const positions = geometry.getAttribute("position") as BufferAttribute;
  const angularWidth = stickerSurface.width / cylinderSurface.radius;
  const radius = cylinderSurface.radius + cylinderSurface.surfaceOffset;
  const columns = stickerSurface.horizontalSegments + 1;

  for (let row = 0; row <= stickerSurface.verticalSegments; row += 1) {
    const verticalProgress = row / stickerSurface.verticalSegments;
    const y = verticalY + (verticalProgress - 0.5) * stickerSurface.height;

    for (let column = 0; column <= stickerSurface.horizontalSegments; column += 1) {
      const horizontalProgress = column / stickerSurface.horizontalSegments;
      const angle = theta + (horizontalProgress - 0.5) * angularWidth;
      const index = row * columns + column;

      positions.setXYZ(index, Math.sin(angle) * radius, y, Math.cos(angle) * radius);
    }
  }

  positions.needsUpdate = true;
  geometry.computeBoundingSphere();
}

function createPatchGeometry() {
  const columns = stickerSurface.horizontalSegments + 1;
  const rows = stickerSurface.verticalSegments + 1;
  const geometry = new BufferGeometry();
  const positions = new Float32Array(columns * rows * 3);
  const indices: number[] = [];

  for (let row = 0; row < stickerSurface.verticalSegments; row += 1) {
    for (let column = 0; column < stickerSurface.horizontalSegments; column += 1) {
      const topLeft = row * columns + column;
      const topRight = topLeft + 1;
      const bottomLeft = (row + 1) * columns + column;
      const bottomRight = bottomLeft + 1;

      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
    }
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setIndex(indices);

  return geometry;
}

const CurvedStickerPatch = forwardRef<
  CurvedStickerPatchHandle,
  CurvedStickerPatchProps
>(function CurvedStickerPatch(
  {
    initialTheta,
    initialVerticalY,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerOver,
    onPointerOut,
  },
  ref,
) {
  const geometry = useMemo(createPatchGeometry, []);
  const setPosition = useCallback(
    (theta: number, verticalY: number) => {
      updatePatchGeometry(geometry, theta, verticalY);
    },
    [geometry],
  );

  useLayoutEffect(() => {
    setPosition(initialTheta, initialVerticalY);
  }, [initialTheta, initialVerticalY, setPosition]);

  useImperativeHandle(ref, () => ({ setPosition }), [setPosition]);

  return (
    <mesh
      geometry={geometry}
      onPointerCancel={onPointerCancel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onPointerOver={onPointerOver}
      onPointerUp={onPointerUp}
    >
      <meshBasicMaterial color={0xf1eee7} depthWrite side={DoubleSide} />
    </mesh>
  );
});

export default CurvedStickerPatch;
