"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Box3, Color, Group, MathUtils, type Material, type Mesh, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import styles from "./SneakerPreview.module.css";

const sneakerPreview = {
  camera: [1.35, 0.7, 2.1] as const,
  targetModelSize: 1.2,
  baseRotation: [-0.08, -0.62, 0.04] as const,
  idleAngularVelocity: (Math.PI * 2) / 22,
  floatAmplitude: 0.035,
  floatAngularVelocity: (Math.PI * 2) / 4.8,
} as const;

const upperSwatches = [
  { color: "#E7E0CF", label: "Bone upper" },
  { color: "#928E84", label: "Stone upper" },
  { color: "#66727A", label: "Slate upper" },
  { color: "#98A08F", label: "Sage upper" },
] as const;

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

function supportsColor(material: Material): material is Material & { color: Color } {
  return "color" in material && material.color instanceof Color;
}

function SneakerModel({
  upperColor,
  isHovered,
  prefersReducedMotion,
}: {
  upperColor: string;
  isHovered: boolean;
  prefersReducedMotion: boolean;
}) {
  const gltf = useLoader(GLTFLoader, "/models/work/sneaker/sneaker-v1.glb");
  const motionRef = useRef<Group>(null);
  const velocityRef = useRef(sneakerPreview.idleAngularVelocity);
  const { invalidate } = useThree();

  const model = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const upperMaterials: (Material & { color: Color })[] = [];

    scene.traverse((object) => {
      if (!("isMesh" in object) || object.isMesh !== true) {
        return;
      }

      const mesh = object as Mesh;
      const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const runtimeMaterials = sourceMaterials.map((material) => material.clone());

      if (mesh.name === "Shoe_Upper") {
        runtimeMaterials.forEach((material) => {
          if (supportsColor(material)) upperMaterials.push(material);
        });
      }

      mesh.material = Array.isArray(mesh.material) ? runtimeMaterials : runtimeMaterials[0];
    });

    scene.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(scene);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z);

    scene.position.sub(center);

    return {
      scene,
      scale: sneakerPreview.targetModelSize / largestDimension,
      upperMaterials,
    };
  }, [gltf]);

  useEffect(() => {
    model.upperMaterials.forEach((material) => material.color.set(upperColor));
    invalidate();
  }, [invalidate, model, upperColor]);

  useFrame((state, delta) => {
    if (!motionRef.current) return;

    if (prefersReducedMotion) {
      motionRef.current.position.y = 0;
      motionRef.current.rotation.set(...sneakerPreview.baseRotation);
      velocityRef.current = 0;
      return;
    }

    const targetVelocity = isHovered ? sneakerPreview.idleAngularVelocity * 0.12 : sneakerPreview.idleAngularVelocity;
    velocityRef.current = MathUtils.damp(velocityRef.current, targetVelocity, 4.5, delta);
    motionRef.current.rotation.y += velocityRef.current * delta;
    motionRef.current.position.y = MathUtils.damp(
      motionRef.current.position.y,
      Math.sin(state.clock.elapsedTime * sneakerPreview.floatAngularVelocity) * sneakerPreview.floatAmplitude,
      8,
      delta,
    );
  });

  return (
    <group ref={motionRef} rotation={sneakerPreview.baseRotation}>
      <primitive object={model.scene} scale={model.scale} />
    </group>
  );
}

function SneakerCanvas({
  upperColor,
  isHovered,
  prefersReducedMotion,
}: {
  upperColor: string;
  isHovered: boolean;
  prefersReducedMotion: boolean;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { isActive } = useGpuSceneActivity({
    id: "work-sneaker-preview",
    elementRef,
    priority: 2,
  });

  return (
    <div ref={elementRef} className={styles.canvasSurface}>
      <Canvas
        camera={{ fov: 32, position: sneakerPreview.camera }}
        dpr={[1, gpuSceneConfig.desktopMaxDpr]}
        frameloop={isActive ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.42} />
        <hemisphereLight args={["#f1eee7", "#2a2a27", 0.8]} />
        <directionalLight position={[3.5, 4.5, 4]} intensity={1.55} color="#fffaf1" />
        <directionalLight position={[-3.5, 1.5, 2]} intensity={0.52} color="#d4d9d8" />
        <Suspense fallback={null}>
          <SneakerModel
            upperColor={upperColor}
            isHovered={isHovered}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function SneakerPreview({ className }: { className: string }) {
  const [upperColor, setUpperColor] = useState<string>(upperSwatches[2].color);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div
      className={`${className} ${styles.preview}`}
      aria-label="Real-time sneaker material study preview"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <SneakerCanvas
        upperColor={upperColor}
        isHovered={isHovered}
        prefersReducedMotion={prefersReducedMotion}
      />
      <div className={styles.header}>
        <span>MATERIAL STUDY / 03</span>
        <span>SURFACE / ACTIVE</span>
      </div>
      <div className={styles.swatches} aria-label="Sneaker upper color options">
        {upperSwatches.map((swatch) => (
          <button
            key={swatch.color}
            type="button"
            aria-label={swatch.label}
            aria-pressed={upperColor === swatch.color}
            className={styles.swatch}
            style={{ "--swatch-color": swatch.color } as React.CSSProperties}
            onClick={() => setUpperColor(swatch.color)}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <span>PRODUCT VIEW</span>
        <span>REAL-TIME MATERIAL PREVIEW</span>
      </div>
    </div>
  );
}
