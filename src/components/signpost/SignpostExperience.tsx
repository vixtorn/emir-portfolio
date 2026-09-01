"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";
import { Vector3 } from "three";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import SignpostModel from "./SignpostModel";
import { signpostConfig } from "./signpost-config";
import styles from "./SignpostSection.module.css";

function CameraFraming() {
  const { camera, invalidate, size } = useThree();

  useEffect(() => {
    const position =
      size.width < 760
        ? signpostConfig.camera.narrowPosition
        : signpostConfig.camera.desktopPosition;

    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(new Vector3(...signpostConfig.camera.target));
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, size.width]);

  return null;
}

function useScrollProgress(
  stageRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onProgressChange: () => void,
) {
  const progressRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      progressRef.current = 0;
      return;
    }

    const updateProgress = () => {
      const stage = stageRef.current;

      if (!stage) {
        return;
      }

      const start = window.scrollY + stage.getBoundingClientRect().top;
      const travel = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const normalizedProgress = (window.scrollY - start) / travel;

      const nextProgress = Math.min(1, Math.max(0, normalizedProgress));

      if (nextProgress !== progressRef.current) {
        progressRef.current = nextProgress;
        onProgressChange();
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [enabled, onProgressChange, stageRef]);

  return progressRef;
}

export default function SignpostExperience() {
  const stageRef = useRef<HTMLDivElement>(null);
  const invalidateRef = useRef<(() => void) | null>(null);
  const requestFrame = useCallback(() => {
    invalidateRef.current?.();
  }, []);
  const reducedMotion = useReducedMotion();
  const { isActive } = useGpuSceneActivity({
    id: "signpost",
    elementRef: stageRef,
    priority: 1,
  });
  const progressRef = useScrollProgress(stageRef, !reducedMotion, requestFrame);

  return (
    <div
      ref={stageRef}
      className={styles.scrollStage}
      data-reduced-motion={reducedMotion}
      style={
        {
          "--signpost-scroll-height": `${signpostConfig.scroll.travelViewportHeights * 100}svh`,
        } as CSSProperties
      }
    >
      <div className={styles.stickyViewport}>
        <Canvas
          aria-label="Interactive 3D signpost"
          camera={{ fov: signpostConfig.camera.fov }}
          className={styles.canvas}
          dpr={[1, gpuSceneConfig.desktopMaxDpr]}
          frameloop={isActive && !reducedMotion ? "always" : "demand"}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ invalidate }) => {
            invalidateRef.current = invalidate;
            invalidate();
          }}
        >
          <color attach="background" args={["#e5e1d7"]} />
          <CameraFraming />
          <ambientLight intensity={0.55} />
          <hemisphereLight args={["#fffaf0", "#958e83", 0.45]} />
          <directionalLight intensity={2.4} position={[5, 8, 7]} />
          <directionalLight intensity={1.05} position={[-6, 3, 4]} />
          <directionalLight intensity={0.85} position={[1, 5, 6]} />
          <Suspense fallback={null}>
            <SignpostModel progressRef={progressRef} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
