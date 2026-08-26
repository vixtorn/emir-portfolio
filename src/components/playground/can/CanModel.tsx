"use client";

import { useEffect, useMemo } from "react";
import { useLoader, type ThreeEvent } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { canConfig, canMaterialConfig } from "./can-config";
import { createBrushedAluminiumRoughnessTexture } from "./can-material";

const modelPath = "/models/playground/can-v1.glb";

type CanModelProps = {
  onPointerOut: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOver: () => void;
};

export default function CanModel({
  onPointerOut,
  onPointerOver,
}: CanModelProps) {
  const gltf = useLoader(GLTFLoader, modelPath);
  const roughnessTexture = useMemo(
    () => createBrushedAluminiumRoughnessTexture(),
    [],
  );
  const aluminiumMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: canMaterialConfig.color,
        envMapIntensity: canMaterialConfig.envMapIntensity,
        metalness: canMaterialConfig.metalness,
        roughness: canMaterialConfig.roughness,
        roughnessMap: roughnessTexture,
      }),
    [roughnessTexture],
  );
  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((object) => {
      if (object instanceof Mesh) {
        object.userData.canSurface = true;
        object.material = aluminiumMaterial;
      }
    });

    return clone;
  }, [aluminiumMaterial, gltf.scene]);

  useEffect(
    () => () => {
      aluminiumMaterial.dispose();
      roughnessTexture.dispose();
    },
    [aluminiumMaterial, roughnessTexture],
  );

  return (
    <group onPointerOut={onPointerOut} onPointerOver={onPointerOver}>
      <group
        position-y={canConfig.modelPositionY}
        scale={canConfig.modelScale}
      >
        <primitive dispose={null} object={model} />
      </group>
    </group>
  );
}
