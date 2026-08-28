"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import StudioEnvironment from "../can/StudioEnvironment";
import { tamagotchiConfig } from "./tamagotchi-config";
import TamagotchiMotion from "./TamagotchiMotion";
import styles from "./TamagotchiSpike.module.css";

const sceneId = "lab-tamagotchi";

function useMedia(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setValue(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [query]);

  return value;
}

export default function TamagotchiSpike() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isActive } = useGpuSceneActivity({
    id: sceneId,
    elementRef,
    priority: 1,
  });
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const finePointer = useMedia("(pointer: fine)");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={elementRef}
      className={styles.spike}
      data-hovered={isHovered || undefined}
    >
      <Canvas
        aria-label="Tamagotchi collectible device"
        camera={{ fov: 32, position: tamagotchiConfig.cameraPosition }}
        className={styles.canvas}
        dpr={[1, gpuSceneConfig.desktopMaxDpr]}
        frameloop={isActive ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <color attach="background" args={[0x080808]} />
        <StudioEnvironment />
        <ambientLight intensity={0.18} />
        <hemisphereLight groundColor={0x11110f} intensity={0.4} />
        <directionalLight intensity={2} position={[4, 5, 6]} />
        <directionalLight intensity={0.7} position={[-4, 1.5, 3]} />
        <directionalLight intensity={0.45} position={[1, -2, 3]} />
        <TamagotchiMotion
          finePointer={finePointer}
          isHovered={isHovered}
          onHoverChange={setIsHovered}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
