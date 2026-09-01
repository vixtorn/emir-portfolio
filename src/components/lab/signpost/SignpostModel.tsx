"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { signpostConfig, signpostRequiredNodes } from "./signpost-config";

type SignpostModelProps = {
  rotationProgressRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

type LensName = keyof typeof signpostConfig.trafficLight.lenses;
type LensMaterials = Partial<Record<LensName, MeshStandardMaterial>>;

function smoothstep(start: number, end: number, value: number) {
  const progress = Math.min(1, Math.max(0, (value - start) / (end - start)));

  return progress * progress * (3 - 2 * progress);
}

function getTrafficLightWeights(progress: number) {
  const redToAmber = smoothstep(
    signpostConfig.trafficLight.redToAmber.start,
    signpostConfig.trafficLight.redToAmber.end,
    progress,
  );
  const amberToGreen = smoothstep(
    signpostConfig.trafficLight.amberToGreen.start,
    signpostConfig.trafficLight.amberToGreen.end,
    progress,
  );

  return {
    red: 1 - redToAmber,
    amber: redToAmber * (1 - amberToGreen),
    green: amberToGreen,
  };
}

function applyTrafficLightEmissive(
  lensMaterials: LensMaterials,
  progress: number,
) {
  const weights = getTrafficLightWeights(progress);
  const { activeEmissiveIntensity, inactiveEmissiveIntensity } =
    signpostConfig.trafficLight;

  for (const lensName of Object.keys(weights) as LensName[]) {
    const material = lensMaterials[lensName];

    if (material) {
      material.emissiveIntensity =
        inactiveEmissiveIntensity +
        (activeEmissiveIntensity - inactiveEmissiveIntensity) *
          weights[lensName];
    }
  }
}

export default function SignpostModel({
  rotationProgressRef,
  reducedMotion,
}: SignpostModelProps) {
  const gltf = useLoader(GLTFLoader, signpostConfig.modelUrl);
  const modelRootRef = useRef<Group>(null);
  const lensMaterialsRef = useRef<LensMaterials>({});

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

  useEffect(() => {
    const runtimeMaterials: LensMaterials = {};
    const originalMaterials: Array<{
      mesh: Mesh;
      material: MeshStandardMaterial;
    }> = [];

    for (const lensName of Object.keys(
      signpostConfig.trafficLight.lenses,
    ) as LensName[]) {
      const lensNode = modelRootRef.current?.getObjectByName(
        signpostConfig.trafficLight.lenses[lensName],
      );

      if (!(lensNode instanceof Mesh) || !(lensNode.material instanceof MeshStandardMaterial)) {
        throw new Error(
          `Signpost lens ${signpostConfig.trafficLight.lenses[lensName]} must use MeshStandardMaterial.`,
        );
      }

      const originalMaterial = lensNode.material;
      const runtimeMaterial = originalMaterial.clone();

      runtimeMaterial.emissive.copy(runtimeMaterial.color);
      runtimeMaterial.emissiveIntensity =
        signpostConfig.trafficLight.inactiveEmissiveIntensity;
      lensNode.material = runtimeMaterial;
      runtimeMaterials[lensName] = runtimeMaterial;
      originalMaterials.push({ mesh: lensNode, material: originalMaterial });
    }

    lensMaterialsRef.current = runtimeMaterials;
    applyTrafficLightEmissive(
      runtimeMaterials,
      reducedMotion
        ? signpostConfig.trafficLight.reducedMotionProgress
        : rotationProgressRef.current,
    );

    return () => {
      for (const { mesh, material } of originalMaterials) {
        mesh.material = material;
      }

      for (const material of Object.values(runtimeMaterials)) {
        material?.dispose();
      }

      lensMaterialsRef.current = {};
    };
  }, [gltf.scene, reducedMotion, rotationProgressRef]);

  useFrame(() => {
    const rotatingAssembly = modelRootRef.current?.getObjectByName(
      "RotatingAssembly",
    );

    if (!rotatingAssembly || reducedMotion) {
      return;
    }

    rotatingAssembly.rotation.y =
      rotationProgressRef.current * signpostConfig.scrollRotation.fullTurnRadians;

    applyTrafficLightEmissive(lensMaterialsRef.current, rotationProgressRef.current);
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
