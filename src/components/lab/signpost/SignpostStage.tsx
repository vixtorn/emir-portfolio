"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Vector3 } from "three";

import SignpostModel from "./SignpostModel";
import { signpostConfig } from "./signpost-config";
import styles from "./SignpostStage.module.css";

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

export default function SignpostStage() {
  return (
    <div className={styles.stage}>
      <p className={`${styles.label} type-micro`}>STATIC MODEL REVIEW</p>
      <Canvas
        aria-label="Static 3D signpost model inspection"
        camera={{ fov: signpostConfig.camera.fov }}
        className={styles.canvas}
        dpr={[1, signpostConfig.renderer.maxDpr]}
        frameloop="demand"
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#e5e1d7"]} />
        <CameraFraming />
        <ambientLight intensity={0.55} />
        <hemisphereLight args={["#fffaf0", "#958e83", 0.45]} />
        <directionalLight
          intensity={2.4}
          position={[5, 8, 7]}
        />
        <directionalLight intensity={1.05} position={[-6, 3, 4]} />
        <directionalLight intensity={0.85} position={[1, 5, 6]} />
        <Suspense fallback={null}>
          <SignpostModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
