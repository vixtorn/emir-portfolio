"use client";

import { Canvas } from "@react-three/fiber";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import SignpostCameraRig from "./SignpostCameraRig";
import SignpostModel from "./SignpostModel";
import { signpostConfig } from "./signpost-config";
import styles from "./SignpostStage.module.css";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

function useScrollRotationProgress(
  scrollStageRef: RefObject<HTMLDivElement | null>,
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
      const scrollStage = scrollStageRef.current;

      if (!scrollStage) {
        return;
      }

      const start = window.scrollY + scrollStage.getBoundingClientRect().top;
      const travel = Math.max(scrollStage.offsetHeight - window.innerHeight, 1);
      const nextProgress = (window.scrollY - start) / travel;

      const clampedProgress = Math.min(1, Math.max(0, nextProgress));

      if (clampedProgress !== progressRef.current) {
        progressRef.current = clampedProgress;
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
  }, [enabled, onProgressChange, scrollStageRef]);

  return progressRef;
}

export default function SignpostStage() {
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const invalidateRef = useRef<(() => void) | null>(null);
  const requestFrame = useCallback(() => {
    invalidateRef.current?.();
  }, []);
  const { isActive } = useGpuSceneActivity({
    id: "lab-signpost",
    elementRef: scrollStageRef,
    priority: 1,
  });
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rotationProgressRef = useScrollRotationProgress(
    scrollStageRef,
    !reducedMotion,
    requestFrame,
  );

  return (
    <div
      className={styles.scrollStage}
      data-reduced-motion={reducedMotion}
      ref={scrollStageRef}
      style={
        {
          "--signpost-scroll-height": `${signpostConfig.scrollRotation.travelViewportHeights * 100}svh`,
        } as CSSProperties
      }
    >
      <div className={styles.stickyViewport}>
        <div className={styles.stage}>
          <p className={`${styles.label} type-micro`}>SCROLL ROTATION REVIEW</p>
          <Canvas
            aria-label="Scroll-driven 3D signpost model inspection"
            camera={{ fov: signpostConfig.camera.fov }}
            className={styles.canvas}
            dpr={[
              1,
              Math.min(
                signpostConfig.renderer.maxDpr,
                gpuSceneConfig.desktopMaxDpr,
              ),
            ]}
            frameloop={isActive && !reducedMotion ? "always" : "demand"}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            onCreated={({ invalidate }) => {
              invalidateRef.current = invalidate;
              invalidate();
            }}
          >
            <color attach="background" args={["#e5e1d7"]} />
            <SignpostCameraRig
              progressRef={rotationProgressRef}
              reducedMotion={reducedMotion}
            />
            <ambientLight intensity={0.55} />
            <hemisphereLight args={["#fffaf0", "#958e83", 0.45]} />
            <directionalLight intensity={2.4} position={[5, 8, 7]} />
            <directionalLight intensity={1.05} position={[-6, 3, 4]} />
            <directionalLight intensity={0.85} position={[1, 5, 6]} />
            <Suspense fallback={null}>
              <SignpostModel
                reducedMotion={reducedMotion}
                rotationProgressRef={rotationProgressRef}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
