"use client";

import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Raycaster, type Mesh, type Ray } from "three";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import CurvedStickerPatch, {
  type CurvedStickerPatchHandle,
} from "./CurvedStickerPatch";
import {
  cylinderSurface,
  stickerPoseFromPoint,
} from "./sticker-surface";
import styles from "./StickerSystemSpike.module.css";

const sceneId = "lab-sticker-system";
const stickerDefinitions = [
  { id: "sticker-01", theta: -0.58, verticalY: 0.48, color: 0xf1eee7 },
  { id: "sticker-02", theta: 0, verticalY: -0.48, color: 0xb8bab7 },
  { id: "sticker-03", theta: 0.58, verticalY: 0.42, color: 0xb85a2d },
] as const;

type StickerId = (typeof stickerDefinitions)[number]["id"];
type StickerPose = {
  theta: number;
  verticalY: number;
};

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

function StickerSystemScene({ onCursorChange }: { onCursorChange: (cursor: string) => void }) {
  const cylinderRef = useRef<Mesh>(null);
  const stickerRefs = useRef(new Map<StickerId, CurvedStickerPatchHandle>());
  const stickerPosesRef = useRef(
    new Map<StickerId, StickerPose>(
      stickerDefinitions.map((sticker) => [
        sticker.id,
        { theta: sticker.theta, verticalY: sticker.verticalY },
      ]),
    ),
  );
  const raycasterRef = useRef(new Raycaster());
  const [interactionOrder, setInteractionOrder] = useState<StickerId[]>(() =>
    stickerDefinitions.map((sticker) => sticker.id),
  );
  const dragRef = useRef<DragState>({
    activeStickerId: null,
    pointerId: null,
    target: null,
    theta: 0,
    verticalY: 0,
  });

  const updateStickerFromRay = useCallback((ray: Ray) => {
    const cylinder = cylinderRef.current;

    if (!cylinder) {
      return false;
    }

    raycasterRef.current.ray.copy(ray);
    const hit = raycasterRef.current.intersectObject(cylinder, false)[0];

    if (!hit) {
      return false;
    }

    const activeStickerId = dragRef.current.activeStickerId;

    if (!activeStickerId) {
      return false;
    }

    const nextPose = stickerPoseFromPoint(hit.point, dragRef.current.theta);
    dragRef.current.theta = nextPose.theta;
    dragRef.current.verticalY = nextPose.verticalY;
    stickerPosesRef.current.set(activeStickerId, nextPose);
    stickerRefs.current
      .get(activeStickerId)
      ?.setPosition(nextPose.theta, nextPose.verticalY);

    return true;
  }, []);

  const endDrag = useCallback(
    (pointerId?: number) => {
      if (
        dragRef.current.pointerId === null ||
        (pointerId !== undefined && dragRef.current.pointerId !== pointerId)
      ) {
        return;
      }

      dragRef.current.target?.releasePointerCapture?.(dragRef.current.pointerId);
      dragRef.current.activeStickerId = null;
      dragRef.current.pointerId = null;
      dragRef.current.target = null;
      onCursorChange("grab");
    },
    [onCursorChange],
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
      const pose = stickerPosesRef.current.get(stickerId);

      if (!pose) {
        return;
      }

      dragRef.current.activeStickerId = stickerId;
      dragRef.current.pointerId = event.pointerId;
      dragRef.current.target = target;
      dragRef.current.theta = pose.theta;
      dragRef.current.verticalY = pose.verticalY;
      target.setPointerCapture?.(event.pointerId);
      updateStickerFromRay(event.ray);
      setInteractionOrder((currentOrder) => [
        ...currentOrder.filter((id) => id !== stickerId),
        stickerId,
      ]);
      onCursorChange("grabbing");
    },
    [endDrag, onCursorChange, updateStickerFromRay],
  );

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (
        dragRef.current.activeStickerId === null ||
        dragRef.current.pointerId !== event.pointerId
      ) {
        return;
      }

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

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight intensity={1.2} position={[3, 4, 5]} />
      <mesh ref={cylinderRef}>
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
      {stickerDefinitions.map((sticker) => {
        const layerOffset = interactionOrder.indexOf(sticker.id) * 0.001;

        return (
          <CurvedStickerPatch
            key={sticker.id}
            ref={(handle) => {
              if (handle) {
                stickerRefs.current.set(sticker.id, handle);
                return;
              }

              stickerRefs.current.delete(sticker.id);
            }}
            color={sticker.color}
            initialTheta={sticker.theta}
            initialVerticalY={sticker.verticalY}
            layerOffset={layerOffset}
            onPointerCancel={handlePointerCancel}
            onPointerDown={(event) => handlePointerDown(sticker.id, event)}
            onPointerMove={handlePointerMove}
            onPointerOut={() => {
              if (dragRef.current.pointerId === null) {
                onCursorChange("default");
              }
            }}
            onPointerOver={() => {
              if (dragRef.current.pointerId === null) {
                onCursorChange("grab");
              }
            }}
            onPointerUp={handlePointerUp}
          />
        );
      })}
    </>
  );
}

export default function StickerSystemSpike() {
  const sceneElementRef = useRef<HTMLDivElement>(null);
  const { isActive } = useGpuSceneActivity({
    id: sceneId,
    elementRef: sceneElementRef,
    priority: 1,
  });
  const [cursor, setCursor] = useState("default");

  return (
    <div
      ref={sceneElementRef}
      className={styles.spike}
      data-cursor={cursor}
    >
      <Canvas
        className={styles.canvas}
        aria-label="Draggable curved sticker on a cylinder"
        camera={{ fov: 35, position: [0, 0, 5] }}
        dpr={[1, gpuSceneConfig.desktopMaxDpr]}
        frameloop={isActive ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[0x080808]} />
        <StickerSystemScene onCursorChange={setCursor} />
      </Canvas>
      <p className={`${styles.note} type-micro`}>
        DRAG THE PATCH ACROSS THE CYLINDER SURFACE
      </p>
    </div>
  );
}
