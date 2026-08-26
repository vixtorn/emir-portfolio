"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { MathUtils, Raycaster, Vector2, type Mesh, type Ray } from "three";

import CurvedStickerPatch, {
  type CurvedStickerPatchHandle,
} from "./CurvedStickerPatch";
import {
  cylinderSurface,
  stickerInteraction,
  stickerPoseFromPoint,
} from "./sticker-surface";

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
  lastClientX: number;
  interactionRotation: number;
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
  const { camera, gl } = useThree();
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
  const pointerNdcRef = useRef(new Vector2());
  const [interactionOrder, setInteractionOrder] = useState<StickerId[]>(() =>
    initialStickerDefinitions.map((sticker) => sticker.id),
  );
  const dragRef = useRef<DragState>({
    activeStickerId: null,
    pointerId: null,
    target: null,
    theta: 0,
    verticalY: 0,
    lastClientX: 0,
    interactionRotation: 0,
  });

  const updateStickerVerticalFromRay = useCallback(
    (ray: Ray) => {
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
      const nextPose = stickerPoseFromPoint(
        localPoint,
        dragRef.current.theta,
        activeSticker.restingRotation + dragRef.current.interactionRotation,
      );

      dragRef.current.verticalY = nextPose.verticalY;
      stickerPosesRef.current.set(activeStickerId, nextPose);
      stickerRefs.current
        .get(activeStickerId)
        ?.setPosition(nextPose.theta, nextPose.verticalY);
      return true;
    },
    [activeStickerIds],
  );

  const updateStickerThetaFromPointer = useCallback((clientX: number) => {
    const activeStickerId = dragRef.current.activeStickerId;
    if (!activeStickerId) return;

    const deltaX = clientX - dragRef.current.lastClientX;
    dragRef.current.lastClientX = clientX;
    if (deltaX === 0) return;

    const activeSticker = stickerDefinitionById.get(activeStickerId);
    if (!activeSticker) return;

    const deltaTheta = deltaX * stickerInteraction.angularDragSensitivity;
    const nextTheta = dragRef.current.theta + deltaTheta;
    const interactionRotation = MathUtils.clamp(
      deltaTheta * dragTiltSensitivity,
      -maxDragTilt,
      maxDragTilt,
    );
    const nextPose = {
      theta: nextTheta,
      verticalY: dragRef.current.verticalY,
    };

    dragRef.current.theta = nextTheta;
    dragRef.current.interactionRotation = interactionRotation;
    stickerPosesRef.current.set(activeStickerId, nextPose);
    const activeStickerHandle = stickerRefs.current.get(activeStickerId);
    activeStickerHandle?.setPosition(nextPose.theta, nextPose.verticalY);
    activeStickerHandle?.setInteractionRotation(interactionRotation);
  }, []);

  const rayFromPointerEvent = useCallback(
    (event: PointerEvent) => {
      const bounds = gl.domElement.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return null;

      pointerNdcRef.current.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycasterRef.current.setFromCamera(pointerNdcRef.current, camera);
      return raycasterRef.current.ray;
    },
    [camera, gl],
  );

  const updateStickerFromPointer = useCallback(
    (clientX: number, ray: Ray | null) => {
      updateStickerThetaFromPointer(clientX);
      if (ray) updateStickerVerticalFromRay(ray);
    },
    [updateStickerThetaFromPointer, updateStickerVerticalFromRay],
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
      dragRef.current.interactionRotation = 0;
      onCursorChange?.("grab");
      onDraggingChange?.(false);
    },
    [onCursorChange, onDraggingChange],
  );

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (dragRef.current.pointerId !== event.pointerId) return;

      updateStickerFromPointer(event.clientX, rayFromPointerEvent(event));
    };
    const handlePointerEnd = (event: PointerEvent) => endDrag(event.pointerId);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointercancel", handlePointerEnd);
    window.addEventListener("pointerup", handlePointerEnd);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("pointerup", handlePointerEnd);
    };
  }, [endDrag, rayFromPointerEvent, updateStickerFromPointer]);

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
      dragRef.current.lastClientX = event.clientX;
      dragRef.current.interactionRotation = 0;
      target.setPointerCapture?.(event.pointerId);
      updateStickerVerticalFromRay(event.ray);
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
    [endDrag, onCursorChange, onDraggingChange, updateStickerVerticalFromRay],
  );

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (
        dragRef.current.activeStickerId === null ||
        dragRef.current.pointerId !== event.pointerId
      ) return;
      event.stopPropagation();
      updateStickerFromPointer(event.clientX, event.ray);
    },
    [updateStickerFromPointer],
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
