"use client";

import {
  Suspense,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import {
  useFrame,
  useLoader,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
} from "three";

import { cylinderSurface, stickerSurface } from "./sticker-surface";

export type CurvedStickerPatchHandle = {
  setInteractionLift: (lift: number) => void;
  setInteractionRotation: (rotation: number) => void;
  setPosition: (theta: number, verticalY: number) => void;
};

type CurvedStickerPatchProps = {
  artworkSrc?: string;
  fallbackColor: number;
  height: number;
  initialTheta: number;
  initialVerticalY: number;
  layerOffset: number;
  restingRotation: number;
  width: number;
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
  layerOffset: number,
  interactionLift: number,
  restingRotation: number,
  interactionRotation: number,
  width: number,
  height: number,
) {
  const positions = geometry.getAttribute("position") as BufferAttribute;
  const radius =
    cylinderSurface.radius +
    cylinderSurface.surfaceOffset +
    layerOffset +
    interactionLift;
  const columns = stickerSurface.horizontalSegments + 1;
  const rotation = restingRotation + interactionRotation;
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);

  for (let row = 0; row <= stickerSurface.verticalSegments; row += 1) {
    const verticalProgress = row / stickerSurface.verticalSegments;
    const localY = (verticalProgress - 0.5) * height;

    for (let column = 0; column <= stickerSurface.horizontalSegments; column += 1) {
      const horizontalProgress = column / stickerSurface.horizontalSegments;
      const localX = (horizontalProgress - 0.5) * width;
      const rotatedX = localX * cosine - localY * sine;
      const rotatedY = localX * sine + localY * cosine;
      const angle = theta + rotatedX / cylinderSurface.radius;
      const index = row * columns + column;

      positions.setXYZ(
        index,
        Math.sin(angle) * radius,
        verticalY + rotatedY,
        Math.cos(angle) * radius,
      );
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
  const uvs = new Float32Array(columns * rows * 2);
  const indices: number[] = [];

  for (let row = 0; row < stickerSurface.verticalSegments; row += 1) {
    for (let column = 0; column < stickerSurface.horizontalSegments; column += 1) {
      const topLeft = row * columns + column;
      const topRight = topLeft + 1;
      const bottomLeft = (row + 1) * columns + column;
      const bottomRight = bottomLeft + 1;

      uvs.set([column / stickerSurface.horizontalSegments, row / stickerSurface.verticalSegments], topLeft * 2);
      uvs.set([(column + 1) / stickerSurface.horizontalSegments, row / stickerSurface.verticalSegments], topRight * 2);
      uvs.set([column / stickerSurface.horizontalSegments, (row + 1) / stickerSurface.verticalSegments], bottomLeft * 2);
      uvs.set([(column + 1) / stickerSurface.horizontalSegments, (row + 1) / stickerSurface.verticalSegments], bottomRight * 2);

      indices.push(topLeft, bottomLeft, topRight, topRight, bottomLeft, bottomRight);
    }
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  geometry.setIndex(indices);

  return geometry;
}

function StickerArtworkMaterial({ artworkSrc }: { artworkSrc: string }) {
  const texture = useLoader(TextureLoader, artworkSrc);
  const { gl } = useThree();
  const configuredTexture = useMemo(() => {
    const artworkTexture = texture.clone();

    artworkTexture.colorSpace = SRGBColorSpace;
    artworkTexture.minFilter = LinearMipmapLinearFilter;
    artworkTexture.magFilter = LinearFilter;
    artworkTexture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    artworkTexture.needsUpdate = true;

    return artworkTexture;
  }, [gl, texture]);

  useLayoutEffect(() => {
    return () => configuredTexture.dispose();
  }, [configuredTexture]);

  return (
    <meshBasicMaterial
      alphaTest={0.08}
      depthWrite
      map={configuredTexture}
      side={DoubleSide}
      transparent
    />
  );
}

const CurvedStickerPatch = forwardRef<
  CurvedStickerPatchHandle,
  CurvedStickerPatchProps
>(function CurvedStickerPatch(
  {
    initialTheta,
    initialVerticalY,
    artworkSrc,
    fallbackColor,
    height,
    layerOffset,
    restingRotation,
    width,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerOver,
    onPointerOut,
  },
  ref,
) {
  const geometry = useMemo(() => createPatchGeometry(), []);
  const poseRef = useRef({ theta: initialTheta, verticalY: initialVerticalY });
  const layerOffsetRef = useRef(layerOffset);
  const currentLiftRef = useRef(0);
  const targetLiftRef = useRef(0);
  const currentInteractionRotationRef = useRef(0);
  const targetInteractionRotationRef = useRef(0);
  const redrawGeometry = useCallback(() => {
    updatePatchGeometry(
      geometry,
      poseRef.current.theta,
      poseRef.current.verticalY,
      layerOffsetRef.current,
      currentLiftRef.current,
      restingRotation,
      currentInteractionRotationRef.current,
      width,
      height,
    );
  }, [geometry, height, restingRotation, width]);
  const setPosition = useCallback(
    (theta: number, verticalY: number) => {
      poseRef.current = { theta, verticalY };
      redrawGeometry();
    },
    [redrawGeometry],
  );
  const setInteractionLift = useCallback((lift: number) => {
    targetLiftRef.current = lift;
  }, []);
  const setInteractionRotation = useCallback((rotation: number) => {
    targetInteractionRotationRef.current = rotation;
  }, []);

  useLayoutEffect(() => {
    layerOffsetRef.current = layerOffset;
    redrawGeometry();
  }, [layerOffset, redrawGeometry]);

  useFrame((_, delta) => {
    const damping =
      targetLiftRef.current > currentLiftRef.current ? 24 : 12;
    const nextLift = MathUtils.damp(
      currentLiftRef.current,
      targetLiftRef.current,
      damping,
      delta,
    );
    const rotationDamping =
      Math.abs(targetInteractionRotationRef.current) >
      Math.abs(currentInteractionRotationRef.current)
        ? 24
        : 12;
    const nextInteractionRotation = MathUtils.damp(
      currentInteractionRotationRef.current,
      targetInteractionRotationRef.current,
      rotationDamping,
      delta,
    );
    const shouldSnapLift = Math.abs(nextLift - currentLiftRef.current) < 0.0001;
    const shouldSnapRotation =
      Math.abs(
        nextInteractionRotation - currentInteractionRotationRef.current,
      ) < 0.0001;
    const liftChanged = nextLift !== currentLiftRef.current;
    const rotationChanged =
      nextInteractionRotation !== currentInteractionRotationRef.current;

    if (!liftChanged && !rotationChanged) {
      return;
    }

    if (shouldSnapLift) {
      currentLiftRef.current = targetLiftRef.current;
    } else {
      currentLiftRef.current = nextLift;
    }
    if (shouldSnapRotation) {
      currentInteractionRotationRef.current =
        targetInteractionRotationRef.current;
    } else {
      currentInteractionRotationRef.current = nextInteractionRotation;
    }

    redrawGeometry();
  });

  useImperativeHandle(
    ref,
    () => ({ setInteractionLift, setInteractionRotation, setPosition }),
    [setInteractionLift, setInteractionRotation, setPosition],
  );

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
      {artworkSrc ? (
        <Suspense
          fallback={
            <meshBasicMaterial
              color={fallbackColor}
              depthWrite
              side={DoubleSide}
            />
          }
        >
          <StickerArtworkMaterial artworkSrc={artworkSrc} />
        </Suspense>
      ) : (
        <meshBasicMaterial color={fallbackColor} depthWrite side={DoubleSide} />
      )}
    </mesh>
  );
});

export default CurvedStickerPatch;
