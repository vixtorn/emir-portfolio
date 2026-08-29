"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, Group, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import styles from "./DiecastPreview.module.css";

const diecastPreview = {
  camera: [5.8, 3.4, 7.2] as const,
  targetModelSize: 4.9,
  baseRotation: [-0.04, -0.62, 0.015] as const,
  floatAmplitude: 0.045,
  floatAngularVelocity: (Math.PI * 2) / 6.4,
  driftAmplitude: 0.016,
  driftAngularVelocity: (Math.PI * 2) / 8.2,
  pitchAmplitude: (0.45 * Math.PI) / 180,
  pitchAngularVelocity: (Math.PI * 2) / 7.1,
  rollAmplitude: (0.35 * Math.PI) / 180,
  rollAngularVelocity: (Math.PI * 2) / 9.2,
} as const;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}

function DiecastModel({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const gltf = useLoader(GLTFLoader, "/models/playground/diecast/bmw-m3-gtr-v1.glb");
  const motionRef = useRef<Group>(null);
  const { invalidate } = useThree();

  const model = useMemo(() => {
    const scene = gltf.scene.clone(true);

    scene.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(scene);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);

    scene.position.sub(center);

    return {
      scene,
      scale: diecastPreview.targetModelSize / largestDimension,
    };
  }, [gltf]);

  useEffect(() => {
    invalidate();
  }, [invalidate, model]);

  useFrame((state) => {
    if (!motionRef.current) return;

    if (prefersReducedMotion) {
      motionRef.current.position.set(0, 0, 0);
      motionRef.current.rotation.set(...diecastPreview.baseRotation);
      return;
    }

    const elapsedTime = state.clock.elapsedTime;

    motionRef.current.position.set(
      Math.sin(elapsedTime * diecastPreview.driftAngularVelocity + 0.7) * diecastPreview.driftAmplitude,
      Math.sin(elapsedTime * diecastPreview.floatAngularVelocity) * diecastPreview.floatAmplitude,
      0,
    );
    motionRef.current.rotation.set(
      diecastPreview.baseRotation[0] +
        Math.sin(elapsedTime * diecastPreview.pitchAngularVelocity + 0.4) * diecastPreview.pitchAmplitude,
      diecastPreview.baseRotation[1],
      diecastPreview.baseRotation[2] +
        Math.sin(elapsedTime * diecastPreview.rollAngularVelocity + 1.1) * diecastPreview.rollAmplitude,
    );
  });

  return (
    <group ref={motionRef} rotation={diecastPreview.baseRotation}>
      <primitive object={model.scene} scale={model.scale} />
    </group>
  );
}

function DiecastCanvas({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isActive } = useGpuSceneActivity({
    id: "work-diecast-preview",
    elementRef,
    priority: 2,
  });

  return (
    <div ref={elementRef} className={styles.canvasSurface}>
      <Canvas
        camera={{ fov: 29, position: diecastPreview.camera }}
        dpr={[1, gpuSceneConfig.desktopMaxDpr]}
        frameloop={isActive ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.32} />
        <hemisphereLight args={["#e9edf0", "#151719", 0.72]} />
        <directionalLight position={[5.5, 7, 6]} intensity={2.2} color="#fffaf2" />
        <directionalLight position={[-4, 2.5, 5]} intensity={0.85} color="#d8e4ef" />
        <directionalLight position={[-2, 4, -5]} intensity={0.55} color="#cad2dc" />
        <Suspense fallback={null}>
          <DiecastModel prefersReducedMotion={prefersReducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function DiecastPreview({ className }: { className: string }) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div className={`${className} ${styles.preview}`} aria-label="Real-time BMW diecast preview">
      <DiecastCanvas prefersReducedMotion={prefersReducedMotion} />
      <div className={styles.header}>
        <span>DIECAST STUDY / 04</span>
        <span>BMW / E46</span>
      </div>
      <div className={styles.footer}>
        <span>REAL-TIME OBJECT</span>
        <span>MOTION STUDY</span>
      </div>
    </div>
  );
}
