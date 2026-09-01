"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { signpostConfig, signpostRequiredNodes } from "./signpost-config";

type SignpostModelProps = {
  rotationProgressRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

export default function SignpostModel({
  rotationProgressRef,
  reducedMotion,
}: SignpostModelProps) {
  const gltf = useLoader(GLTFLoader, signpostConfig.modelUrl);
  const modelRootRef = useRef<Group>(null);

  const missingNodes = useMemo(
    () =>
      signpostRequiredNodes.filter(
        (name) => gltf.scene.getObjectByName(name) === undefined,
      ),
    [gltf.scene],
  );
  useEffect(() => {
    const rotatingAssembly = modelRootRef.current?.getObjectByName(
      "RotatingAssembly",
    );

    if (rotatingAssembly) {
      rotatingAssembly.rotation.y = 0;
    }
  }, [reducedMotion]);

  useFrame(() => {
    const rotatingAssembly = modelRootRef.current?.getObjectByName(
      "RotatingAssembly",
    );

    if (!rotatingAssembly || reducedMotion) {
      return;
    }

    rotatingAssembly.rotation.y =
      rotationProgressRef.current * signpostConfig.scrollRotation.fullTurnRadians;
  });

  if (missingNodes.length > 0) {
    throw new Error(`Signpost GLB is missing: ${missingNodes.join(", ")}`);
  }

  return (
    <group ref={modelRootRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}
