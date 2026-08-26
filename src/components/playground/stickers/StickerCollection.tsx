"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { MathUtils, Raycaster, type Mesh, type Ray } from "three";

import CurvedStickerPatch, {
  type CurvedStickerPatchHandle,
} from "./CurvedStickerPatch";
import { cylinderSurface, stickerPoseFromPoint } from "./sticker-surface";

const activeStickerLift = 0.04;
const maxDragTilt = MathUtils.degToRad(2.5);
const dragTiltSensitivity = 3;

type StickerId =
  | "sticker-01"
  | "sticker-02"
  | "sticker-03"
  | "sticker-04"
  | "sticker-05"
  | "sticker-rare";

type StickerDefinition = {
  id: StickerId;
  initialTheta: number;
  initialVerticalY: number;
  color: number;
  restingRotation: number;
  unlock: "initial" | "rare";
};

const stickerDefinitions = [
  { id: "sticker-01", initialTheta: -0.58, initialVerticalY: 0.54, color: 0xf1eee7, restingRotation: MathUtils.degToRad(-5), unlock: "initial" },
  { id: "sticker-02", initialTheta: -0.12, initialVerticalY: -0.56, color: 0xb8bab7, restingRotation: MathUtils.degToRad(3), unlock: "initial" },
  { id: "sticker-03", initialTheta: 0.62, initialVerticalY: 0.5, color: 0xb85a2d, restingRotation: MathUtils.degToRad(-2), unlock: "initial" },
  { id: "sticker-04", initialTheta: -1.12, initialVerticalY: -0.08, color: 0xf1eee7, restingRotation: MathUtils.degToRad(5), unlock: "initial" },
  { id: "sticker-05", initialTheta: 1.08, initialVerticalY: -0.2, color: 0xb8bab7, restingRotation: MathUtils.degToRad(-6), unlock: "initial" },
  { id: "sticker-rare", initialTheta: 0.28, initialVerticalY: 0.02, color: 0xb85a2d, restingRotation: MathUtils.degToRad(2), unlock: "rare" },
] as const satisfies readonly StickerDefinition[];

const initialStickerDefinitions = stickerDefinitions.filter(
  (sticker) => sticker.unlock === "initial",
);
const stickerDefinitionById = new Map<StickerId, StickerDefinition>(
  stickerDefinitions.map((sticker) => [sticker.id, sticker] as const),
);

type StickerPose = { theta: number; verticalY: number };
type PointerCaptureTarget = EventTarget & {
  releasePointerCapture?: (pointerId: number) => void;
  setPointerCapture?: (pointerId: number) => void;
};
type DragState = {
  activeStickerId: StickerId | null;
  pointerId: number | null;
  target: PointerCaptureTarget | null;
  theta: number;
  verticalY: number;
};

type StickerCollectionProps = {
  onCursorChange?: (cursor: string) => void;
  onDraggingChange?: (dragging: boolean) => void;
  onHoverChange?: (hovered: boolean) => void;
  rareUnlocked?: boolean;
  showInteractionSurface?: boolean;
};

export default function StickerCollection({
  onCursorChange,
  onDraggingChange,
  onHoverChange,
  rareUnlocked = false,
  showInteractionSurface = false,
}: StickerCollectionProps) {
  const activeStickerDefinitions = useMemo(
    () => (rareUnlocked ? stickerDefinitions : initialStickerDefinitions),
    [rareUnlocked],
  );
  const activeStickerIds = useMemo(
    () => new Set(activeStickerDefinitions.map((sticker) => sticker.id)),
    [activeStickerDefinitions],
  );
  const cylinderRef = useRef<Mesh>(null);
  const stickerRefs = useRef(new Map<StickerId, CurvedStickerPatchHandle>());
  const stickerPosesRef = useRef(
    new Map<StickerId, StickerPose>(
      initialStickerDefinitions.map((sticker) => [
        sticker.id,
        { theta: sticker.initialTheta, verticalY: sticker.initialVerticalY },
      ]),
    ),
  );
  const raycasterRef = useRef(new Raycaster());
  const [interactionOrder, setInteractionOrder] = useState<StickerId[]>(() =>
    initialStickerDefinitions.map((sticker) => sticker.id),
  );
  const dragRef = useRef<DragState>({
    activeStickerId: null,
    pointerId: null,
    target: null,
    theta: 0,
    verticalY: 0,
  });

  const updateStickerFromRay = useCallback(
    (ray: Ray, shouldTilt = true) => {
      const cylinder = cylinderRef.current;
      if (!cylinder) return false;

      raycasterRef.current.ray.copy(ray);
      const hit = raycasterRef.current.intersectObject(cylinder, false)[0];
      const activeStickerId = dragRef.current.activeStickerId;
      if (!hit || !activeStickerId || !activeStickerIds.has(activeStickerId)) {
        return false;
      }

      const activeSticker = stickerDefinitionById.get(activeStickerId);
      if (!activeSticker) return false;

      const localPoint = cylinder.worldToLocal(hit.point.clone());
      const currentPose = stickerPoseFromPoint(
        localPoint,
        dragRef.current.theta,
        activeSticker.restingRotation,
      );
      const interactionRotation = shouldTilt
        ? MathUtils.clamp(
            (currentPose.theta - dragRef.current.theta) * dragTiltSensitivity,
            -maxDragTilt,
            maxDragTilt,
          )
        : 0;
      const nextPose = stickerPoseFromPoint(
        localPoint,
        dragRef.current.theta,
        activeSticker.restingRotation + interactionRotation,
      );

      dragRef.current.theta = nextPose.theta;
      dragRef.current.verticalY = nextPose.verticalY;
      stickerPosesRef.current.set(activeStickerId, nextPose);
      stickerRefs.current
        .get(activeStickerId)
        ?.setPosition(nextPose.theta, nextPose.verticalY);
      if (shouldTilt) {
        stickerRefs.current
          .get(activeStickerId)
          ?.setInteractionRotation(interactionRotation);
      }
      return true;
    },
    [activeStickerIds],
  );

  const endDrag = useCallback(
    (pointerId?: number) => {
      if (
        dragRef.current.pointerId === null ||
        (pointerId !== undefined && dragRef.current.pointerId !== pointerId)
      ) {
        return;
      }

      const activeStickerId = dragRef.current.activeStickerId;
      dragRef.current.target?.releasePointerCapture?.(dragRef.current.pointerId);
      if (activeStickerId) {
        const activeSticker = stickerRefs.current.get(activeStickerId);
        activeSticker?.setInteractionLift(0);
        activeSticker?.setInteractionRotation(0);
      }
      dragRef.current.activeStickerId = null;
      dragRef.current.pointerId = null;
      dragRef.current.target = null;
      onCursorChange?.("grab");
      onDraggingChange?.(false);
    },
    [onCursorChange, onDraggingChange],
  );

  useEffect(() => {
    const handlePointerEnd = (event: PointerEvent) => endDrag(event.pointerId);
    window.addEventListener("pointercancel", handlePointerEnd);
    window.addEventListener("pointerup", handlePointerEnd);
    return () => {
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("pointerup", handlePointerEnd);
    };
  }, [endDrag]);

  const handlePointerDown = useCallback(
    (stickerId: StickerId, event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const target = event.target as PointerCaptureTarget;
      endDrag();
      const definition = stickerDefinitionById.get(stickerId);
      const pose = stickerPosesRef.current.get(stickerId) ??
        (definition && {
          theta: definition.initialTheta,
          verticalY: definition.initialVerticalY,
        });
      if (!pose) return;

      stickerPosesRef.current.set(stickerId, pose);
      dragRef.current.activeStickerId = stickerId;
      dragRef.current.pointerId = event.pointerId;
      dragRef.current.target = target;
      dragRef.current.theta = pose.theta;
      dragRef.current.verticalY = pose.verticalY;
      target.setPointerCapture?.(event.pointerId);
      updateStickerFromRay(event.ray, false);
      const activeSticker = stickerRefs.current.get(stickerId);
      activeSticker?.setInteractionLift(activeStickerLift);
      activeSticker?.setInteractionRotation(0);
      setInteractionOrder((currentOrder) => [
        ...currentOrder.filter((id) => id !== stickerId),
        stickerId,
      ]);
      onCursorChange?.("grabbing");
      onDraggingChange?.(true);
    },
    [endDrag, onCursorChange, onDraggingChange, updateStickerFromRay],
  );

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (
        dragRef.current.activeStickerId === null ||
        dragRef.current.pointerId !== event.pointerId
      ) return;
      event.stopPropagation();
      updateStickerFromRay(event.ray);
    },
    [updateStickerFromRay],
  );

  const handlePointerUp = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      endDrag(event.pointerId);
    },
    [endDrag],
  );
  const handlePointerCancel = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      endDrag(event.pointerId);
    },
    [endDrag],
  );
  const activeInteractionOrder = [
    ...interactionOrder.filter((id) => activeStickerIds.has(id)),
    ...activeStickerDefinitions
      .filter((sticker) => !interactionOrder.includes(sticker.id))
      .map((sticker) => sticker.id),
  ];

  return (
    <>
      <mesh ref={cylinderRef} visible={showInteractionSurface}>
        <cylinderGeometry
          args={[
            cylinderSurface.radius,
            cylinderSurface.radius,
            cylinderSurface.height,
            cylinderSurface.radialSegments,
          ]}
        />
        <meshStandardMaterial color={0x89867f} roughness={0.85} />
      </mesh>
      {activeStickerDefinitions.map((sticker) => {
        const layerOffset = activeInteractionOrder.indexOf(sticker.id) * 0.001;
        return (
          <CurvedStickerPatch
            key={sticker.id}
            ref={(handle) => {
              if (handle) stickerRefs.current.set(sticker.id, handle);
              else stickerRefs.current.delete(sticker.id);
            }}
            color={sticker.color}
            initialTheta={sticker.initialTheta}
            initialVerticalY={sticker.initialVerticalY}
            layerOffset={layerOffset}
            restingRotation={sticker.restingRotation}
            onPointerCancel={handlePointerCancel}
            onPointerDown={(event) => handlePointerDown(sticker.id, event)}
            onPointerMove={handlePointerMove}
            onPointerOut={() => {
              if (dragRef.current.pointerId === null) {
                onCursorChange?.("default");
                onHoverChange?.(false);
              }
            }}
            onPointerOver={() => {
              if (dragRef.current.pointerId === null) {
                onCursorChange?.("grab");
                onHoverChange?.(true);
              }
            }}
            onPointerUp={handlePointerUp}
          />
        );
      })}
    </>
  );
}
