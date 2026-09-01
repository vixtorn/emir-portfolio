"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import StudioEnvironment from "../can/StudioEnvironment";
import { keychainConfig } from "./keychain-config";
import KeychainPendulum from "./KeychainPendulum";
import styles from "./KeychainSpike.module.css";

function useMedia(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setValue(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [query]);

  return value;
}

export default function KeychainSpike() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isActive } = useGpuSceneActivity({
    id: "lab-keychain",
    elementRef,
    priority: 1,
  });
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const finePointer = useMedia("(pointer: fine)");

  return (
    <div ref={elementRef} className={styles.spike}>
      <Canvas
        aria-label="Raze chibi hanging keychain"
        camera={{ fov: 32, position: keychainConfig.cameraPosition }}
        className={styles.canvas}
        dpr={[1, gpuSceneConfig.desktopMaxDpr]}
        frameloop={isActive ? "always" : "never"}
      >
        <color attach="background" args={[0x080808]} />
        <StudioEnvironment />
        <ambientLight intensity={0.2} />
        <hemisphereLight intensity={0.4} />
        <directionalLight intensity={2.1} position={[4, 5, 6]} />
        <directionalLight intensity={0.7} position={[-4, 1.5, 3]} />
        <KeychainPendulum
          finePointer={finePointer}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
