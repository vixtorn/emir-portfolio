"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, type CSSProperties, type MutableRefObject, type RefObject } from "react";
import { Box3, Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";
import SignpostCameraRig from "@/components/signpost/SignpostCameraRig";
import SignpostModel from "@/components/signpost/SignpostModel";
import { signpostConfig } from "@/components/signpost/signpost-config";

import styles from "./SignpostTransitionExperience.module.css";

const coneMotion = {
  finalX: -1.25,
  initialTiltZ: (4 * Math.PI) / 180,
  initialX: -1.55,
  initialY: 8.4,
  settleProgress: 0.075,
  slideEndProgress: 0.055,
  z: 0.16,
} as const;

function smoothstep(start: number, end: number, value: number) {
  const normalized = Math.min(1, Math.max(0, (value - start) / (end - start)));

  return normalized * normalized * (3 - 2 * normalized);
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

      if (!stage) return;

      const start = window.scrollY + stage.getBoundingClientRect().top;
      const travel = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / travel));

      if (progress !== progressRef.current) {
        progressRef.current = progress;
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

function TrafficCone({
  progressRef,
  reducedMotion,
}: {
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const gltf = useLoader(GLTFLoader, "/models/signpost/traffic-cone-v1.glb");
  const coneRef = useRef<Group>(null);
  const bounds = useMemo(() => {
    gltf.scene.updateMatrixWorld(true);
    return new Box3().setFromObject(gltf.scene);
  }, [gltf.scene]);
  const groundOffset = -bounds.min.y;

  useFrame(() => {
    const cone = coneRef.current;

    if (!cone) return;

    const progress = reducedMotion ? coneMotion.settleProgress : progressRef.current;
    const slide = smoothstep(0, coneMotion.slideEndProgress, progress);
    const settle = smoothstep(
      coneMotion.slideEndProgress,
      coneMotion.settleProgress,
      progress,
    );

    cone.position.x =
      coneMotion.initialX + (coneMotion.finalX - coneMotion.initialX) * slide;
    cone.position.y = coneMotion.initialY * (1 - slide);
    cone.rotation.z = coneMotion.initialTiltZ * (1 - settle);
  });

  return (
    <group
      ref={coneRef}
      position={[coneMotion.initialX, coneMotion.initialY, coneMotion.z]}
      scale={2}
    >
      <primitive object={gltf.scene} position={[0, groundOffset, 0]} />
    </group>
  );
}

export default function SignpostTransitionExperience() {
  const stageRef = useRef<HTMLDivElement>(null);
  const invalidateRef = useRef<(() => void) | null>(null);
  const reducedMotion = useReducedMotion();
  const requestFrame = useCallback(() => invalidateRef.current?.(), []);
  const progressRef = useScrollProgress(stageRef, !reducedMotion, requestFrame);
  const { isActive } = useGpuSceneActivity({
    id: "lab-signpost-transition",
    elementRef: stageRef,
    priority: 1,
  });

  return (
    <section className={styles.section} aria-label="Signpost transition experiment">
      <p className={`${styles.label} type-meta`}>SIGNPOST TRANSITION LAB</p>
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
            aria-label="Traffic cone and signpost transition experiment"
            camera={{ fov: signpostConfig.camera.fov }}
            className={styles.canvas}
            dpr={[1, Math.min(signpostConfig.renderer.maxDpr, gpuSceneConfig.desktopMaxDpr)]}
            frameloop={isActive && !reducedMotion ? "always" : "demand"}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            onCreated={({ invalidate }) => {
              invalidateRef.current = invalidate;
              invalidate();
            }}
          >
            <SignpostCameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
            <ambientLight intensity={0.55} />
            <hemisphereLight args={["#fffaf0", "#958e83", 0.45]} />
            <directionalLight intensity={2.4} position={[5, 8, 7]} />
            <directionalLight intensity={1.05} position={[-6, 3, 4]} />
            <directionalLight intensity={0.85} position={[1, 5, 6]} />
            <Suspense fallback={null}>
              <TrafficCone progressRef={progressRef} reducedMotion={reducedMotion} />
              <SignpostModel progressRef={progressRef} reducedMotion={reducedMotion} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}
