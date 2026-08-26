"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import StickerCollection from "./StickerCollection";
import styles from "./StickerSystemSpike.module.css";

const sceneId = "lab-sticker-system";

export default function StickerSystemSpike({
  rareUnlocked = false,
}: {
  rareUnlocked?: boolean;
}) {
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
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1.2} position={[3, 4, 5]} />
        <StickerCollection
          onCursorChange={setCursor}
          rareUnlocked={rareUnlocked}
          showInteractionSurface
        />
      </Canvas>
      <p className={`${styles.note} type-micro`}>
        DRAG THE PATCH ACROSS THE CYLINDER SURFACE
      </p>
    </div>
  );
}
