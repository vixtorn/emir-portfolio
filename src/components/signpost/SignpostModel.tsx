"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { signpostConfig, signpostRequiredNodes } from "./signpost-config";

type SignpostModelProps = {
  progressRef: MutableRefObject<number>;
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

function updateLensEmission(lensMaterials: LensMaterials, progress: number) {
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
  progressRef,
  reducedMotion,
}: SignpostModelProps) {
  const gltf = useLoader(GLTFLoader, signpostConfig.modelUrl);
  const presentationGroupRef = useRef<Group>(null);
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
    const presentationGroup = presentationGroupRef.current;
    const rotatingAssembly = modelRootRef.current?.getObjectByName(
      "RotatingAssembly",
    );

    if (rotatingAssembly) {
      rotatingAssembly.rotation.y = 0;
    }

    if (reducedMotion && presentationGroup) {
      presentationGroup.position.y = 0;
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
        signpostConfig.trafficLight.lenses[lensName].nodeName,
      );

      if (
        !(lensNode instanceof Mesh) ||
        !(lensNode.material instanceof MeshStandardMaterial)
      ) {
        throw new Error(
          `Signpost lens ${signpostConfig.trafficLight.lenses[lensName].nodeName} must use MeshStandardMaterial.`,
        );
      }

      const originalMaterial = lensNode.material;
      const runtimeMaterial = originalMaterial.clone();

      runtimeMaterial.emissive.set(
        signpostConfig.trafficLight.lenses[lensName].emissiveColor,
      );
      runtimeMaterial.emissiveIntensity =
        signpostConfig.trafficLight.inactiveEmissiveIntensity;
      runtimeMaterial.toneMapped = false;
      lensNode.material = runtimeMaterial;
      runtimeMaterials[lensName] = runtimeMaterial;
      originalMaterials.push({ mesh: lensNode, material: originalMaterial });
    }

    lensMaterialsRef.current = runtimeMaterials;
    updateLensEmission(
      runtimeMaterials,
      reducedMotion
        ? signpostConfig.trafficLight.reducedMotionProgress
        : progressRef.current,
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
  }, [gltf.scene, progressRef, reducedMotion]);

  useFrame(() => {
    const presentationGroup = presentationGroupRef.current;
    const rotatingAssembly = modelRootRef.current?.getObjectByName(
      "RotatingAssembly",
    );

    if (!presentationGroup || !rotatingAssembly) {
      return;
    }

    if (reducedMotion) {
      presentationGroup.position.y = 0;
      return;
    }

    const progress = progressRef.current;

    rotatingAssembly.rotation.y = progress * signpostConfig.scroll.fullTurnRadians;
    presentationGroup.position.y =
      -smoothstep(0, 1, progress) * signpostConfig.presentation.verticalTravel;
    updateLensEmission(lensMaterialsRef.current, progress);
  });

  if (missingNodes.length > 0) {
    throw new Error(`Signpost GLB is missing: ${missingNodes.join(", ")}`);
  }

  return (
    <group ref={presentationGroupRef} scale={signpostConfig.presentation.scale}>
      <group ref={modelRootRef}>
        <primitive object={gltf.scene} />
      </group>
    </group>
  );
}
