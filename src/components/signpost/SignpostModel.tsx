"use client";

import { useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import { Group, Mesh, MeshStandardMaterial, Object3D } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useMotion } from "@/components/providers/MotionProvider";

import { signpostConfig, signpostRequiredNodes } from "./signpost-config";

type SignpostModelProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

type LensName = keyof typeof signpostConfig.trafficLight.lenses;
type LensMaterials = Partial<Record<LensName, MeshStandardMaterial>>;
type SignNavigationKey = keyof typeof signpostConfig.navigation;

const signNavigationEntries = Object.entries(signpostConfig.navigation) as Array<
  [SignNavigationKey, (typeof signpostConfig.navigation)[SignNavigationKey]]
>;

function smoothstep(start: number, end: number, value: number) {
  const progress = Math.min(1, Math.max(0, (value - start) / (end - start)));

  return progress * progress * (3 - 2 * progress);
}

function getPartialRevealRotation(progress: number) {
  const { maxRadians, startProgress, peakProgress, returnProgress } =
    signpostConfig.scroll.partialReveal;

  if (progress <= startProgress || progress >= returnProgress) {
    return 0;
  }

  if (progress <= peakProgress) {
    return smoothstep(startProgress, peakProgress, progress) * maxRadians;
  }

  return (
    (1 - smoothstep(peakProgress, returnProgress, progress)) * maxRadians
  );
}

function resolveSignNavigationKey(object: Object3D) {
  let current: Object3D | null = object;

  while (current) {
    const objectName = current.name.toUpperCase();

    for (const [navigationKey, navigation] of signNavigationEntries) {
      if (
        navigation.nodeNames.some((nodeName) =>
          objectName.startsWith(nodeName.toUpperCase()),
        )
      ) {
        return navigationKey;
      }
    }

    current = current.parent;
  }

  return null;
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
  const { scrollTo } = useMotion();
  const gltf = useLoader(GLTFLoader, signpostConfig.modelUrl);
  const presentationGroupRef = useRef<Group>(null);
  const modelRootRef = useRef<Group>(null);
  const lensMaterialsRef = useRef<LensMaterials>({});
  const originalCursorRef = useRef<string | null>(null);
  const missingNodes = useMemo(
    () =>
      signpostRequiredNodes.filter(
        (name) => gltf.scene.getObjectByName(name) === undefined,
      ),
    [gltf.scene],
  );

  const restoreCursor = useCallback(() => {
    if (typeof document === "undefined" || originalCursorRef.current === null) {
      return;
    }

    document.body.style.cursor = originalCursorRef.current;
    originalCursorRef.current = null;
  }, []);

  const updateCursor = useCallback(
    (isNavigable: boolean) => {
      if (typeof document === "undefined") {
        return;
      }

      if (!isNavigable) {
        restoreCursor();
        return;
      }

      if (originalCursorRef.current === null) {
        originalCursorRef.current = document.body.style.cursor;
      }

      document.body.style.cursor = "pointer";
    },
    [restoreCursor],
  );

  const handlePointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      updateCursor(resolveSignNavigationKey(event.object) !== null);
    },
    [updateCursor],
  );

  const handleSignClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      const navigationKey = resolveSignNavigationKey(event.object);

      if (!navigationKey) {
        return;
      }

      event.stopPropagation();
      scrollTo(signpostConfig.navigation[navigationKey].target);
    },
    [scrollTo],
  );

  useEffect(() => restoreCursor, [restoreCursor]);

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

    rotatingAssembly.rotation.y = getPartialRevealRotation(progress);
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
        <primitive
          object={gltf.scene}
          onClick={handleSignClick}
          onPointerMove={handlePointerMove}
          onPointerOut={restoreCursor}
        />
      </group>
    </group>
  );
}
