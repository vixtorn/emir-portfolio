"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import CanArtifact from "./CanArtifact";
import styles from "./PlaygroundCanSpike.module.css";
import StudioEnvironment from "./StudioEnvironment";

const sceneId = "lab-playground-can";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export default function PlaygroundCanSpike() {
  const sceneElementRef = useRef<HTMLDivElement>(null);
  const { isActive } = useGpuSceneActivity({
    id: sceneId,
    elementRef: sceneElementRef,
    priority: 1,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [cursor, setCursor] = useState("default");

  return (
    <div
      ref={sceneElementRef}
      className={styles.spike}
      data-cursor={cursor}
    >
      <Canvas
        aria-label="Unbranded brushed aluminium beverage can"
        camera={{ fov: 32, position: [0, 0.55, 7.5] }}
        className={styles.canvas}
        dpr={[1, gpuSceneConfig.desktopMaxDpr]}
        frameloop={isActive ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <color attach="background" args={[0x080808]} />
        <StudioEnvironment />
        <ambientLight intensity={0.16} />
        <hemisphereLight intensity={0.32} />
        <directionalLight intensity={2.1} position={[4, 5, 6]} />
        <directionalLight intensity={0.75} position={[-4, 1.5, 3]} />
        <CanArtifact
          onCursorChange={setCursor}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
}
