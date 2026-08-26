"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Group, MathUtils } from "three";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import CanModel from "./CanModel";
import { canConfig } from "./can-config";
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

function CanScene({
  isHovered,
  prefersReducedMotion,
  onHoverChange,
}: {
  isHovered: boolean;
  prefersReducedMotion: boolean;
  onHoverChange: (hovered: boolean) => void;
}) {
  const rotationGroupRef = useRef<Group>(null);
  const floatingGroupRef = useRef<Group>(null);
  const rotationVelocityRef = useRef(canConfig.idleAngularVelocity);

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      rotationVelocityRef.current = 0;

      if (rotationGroupRef.current) {
        rotationGroupRef.current.rotation.y = 0;
      }
      if (floatingGroupRef.current) {
        floatingGroupRef.current.position.y = 0;
      }

      return;
    }

    const targetVelocity = isHovered ? 0 : canConfig.idleAngularVelocity;

    rotationVelocityRef.current = MathUtils.damp(
      rotationVelocityRef.current,
      targetVelocity,
      4,
      delta,
    );
    if (rotationGroupRef.current) {
      rotationGroupRef.current.rotation.y += rotationVelocityRef.current * delta;
    }
    if (floatingGroupRef.current) {
      floatingGroupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * canConfig.floatAngularVelocity) *
        canConfig.floatAmplitude;
    }
  });

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    const isStillOverCan = event.intersections.some(
      (intersection) => intersection.object.userData.canSurface === true,
    );

    if (!isStillOverCan) {
      onHoverChange(false);
    }
  };

  return (
    <group ref={rotationGroupRef}>
      <group
        ref={floatingGroupRef}
        rotation={[canConfig.idleTiltX, 0, canConfig.idleTiltZ]}
      >
        <Suspense fallback={null}>
          <CanModel
            onPointerOut={handlePointerOut}
            onPointerOver={() => onHoverChange(true)}
          />
        </Suspense>
      </group>
    </group>
  );
}

export default function PlaygroundCanSpike() {
  const sceneElementRef = useRef<HTMLDivElement>(null);
  const { isActive } = useGpuSceneActivity({
    id: sceneId,
    elementRef: sceneElementRef,
    priority: 1,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div ref={sceneElementRef} className={styles.spike}>
      <Canvas
        className={styles.canvas}
        aria-label="Unbranded brushed aluminium beverage can"
        camera={{ fov: 32, position: [0, 0.55, 7.5] }}
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
        <CanScene
          isHovered={isHovered}
          onHoverChange={setIsHovered}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
}
