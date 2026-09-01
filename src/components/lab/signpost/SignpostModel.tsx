"use client";

import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { signpostConfig, signpostRequiredNodes } from "./signpost-config";

export default function SignpostModel() {
  const gltf = useLoader(GLTFLoader, signpostConfig.modelUrl);

  const missingNodes = useMemo(
    () =>
      signpostRequiredNodes.filter(
        (name) => gltf.scene.getObjectByName(name) === undefined,
      ),
    [gltf.scene],
  );

  if (missingNodes.length > 0) {
    throw new Error(`Signpost GLB is missing: ${missingNodes.join(", ")}`);
  }

  return <primitive object={gltf.scene} />;
}
