"use client";

import { useEffect, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";

import { canConfig, canMaterialConfig } from "./can-config";
import { createBrushedAluminiumRoughnessTexture } from "./can-material";

type CanMeshProps = {
  onPointerOut: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOver: () => void;
};

export default function CanMesh({ onPointerOut, onPointerOver }: CanMeshProps) {
  const roughnessTexture = useMemo(
    () => createBrushedAluminiumRoughnessTexture(),
    [],
  );
  const bodyHalfHeight = canConfig.bodyHeight / 2;
  const topY = bodyHalfHeight + canConfig.shoulderHeight;
  const bottomY = -bodyHalfHeight - canConfig.bottomTaperHeight;

  useEffect(() => () => roughnessTexture.dispose(), [roughnessTexture]);

  return (
    <group onPointerOut={onPointerOut} onPointerOver={onPointerOver}>
      <mesh userData={{ canSurface: true }}>
        <cylinderGeometry
          args={[
            canConfig.bodyRadius,
            canConfig.bodyRadius,
            canConfig.bodyHeight,
            canConfig.radialSegments,
            1,
            true,
          ]}
        />
        <meshStandardMaterial
          color={canMaterialConfig.color}
          envMapIntensity={canMaterialConfig.envMapIntensity}
          metalness={canMaterialConfig.metalness}
          roughness={canMaterialConfig.roughness}
          roughnessMap={roughnessTexture}
        />
      </mesh>

      <mesh
        position={[0, bodyHalfHeight + canConfig.shoulderHeight / 2, 0]}
        userData={{ canSurface: true }}
      >
        <cylinderGeometry
          args={[
            canConfig.neckRadius,
            canConfig.bodyRadius,
            canConfig.shoulderHeight,
            canConfig.radialSegments,
            1,
            true,
          ]}
        />
        <meshStandardMaterial
          color={canMaterialConfig.color}
          envMapIntensity={canMaterialConfig.envMapIntensity}
          metalness={canMaterialConfig.metalness}
          roughness={canMaterialConfig.roughness}
          roughnessMap={roughnessTexture}
        />
      </mesh>

      <mesh
        position={[0, topY, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        userData={{ canSurface: true }}
      >
        <torusGeometry
          args={[
            canConfig.rimRadius,
            canConfig.rimTubeRadius,
            12,
            canConfig.radialSegments,
          ]}
        />
        <meshStandardMaterial
          color={canMaterialConfig.color}
          envMapIntensity={canMaterialConfig.envMapIntensity}
          metalness={canMaterialConfig.metalness}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, topY - 0.018, 0]} userData={{ canSurface: true }}>
        <cylinderGeometry
          args={[
            canConfig.insetRadius,
            canConfig.insetRadius,
            0.025,
            canConfig.radialSegments,
          ]}
        />
        <meshStandardMaterial
          color={canMaterialConfig.color}
          envMapIntensity={canMaterialConfig.envMapIntensity * 0.75}
          metalness={canMaterialConfig.metalness}
          roughness={0.45}
          roughnessMap={roughnessTexture}
        />
      </mesh>

      <mesh
        position={[0, -bodyHalfHeight - canConfig.bottomTaperHeight / 2, 0]}
        userData={{ canSurface: true }}
      >
        <cylinderGeometry
          args={[
            canConfig.bodyRadius,
            canConfig.neckRadius,
            canConfig.bottomTaperHeight,
            canConfig.radialSegments,
            1,
            true,
          ]}
        />
        <meshStandardMaterial
          color={canMaterialConfig.color}
          envMapIntensity={canMaterialConfig.envMapIntensity}
          metalness={canMaterialConfig.metalness}
          roughness={canMaterialConfig.roughness}
          roughnessMap={roughnessTexture}
        />
      </mesh>

      <mesh
        position={[0, bottomY, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        userData={{ canSurface: true }}
      >
        <torusGeometry
          args={[
            canConfig.rimRadius,
            canConfig.rimTubeRadius,
            12,
            canConfig.radialSegments,
          ]}
        />
        <meshStandardMaterial
          color={canMaterialConfig.color}
          envMapIntensity={canMaterialConfig.envMapIntensity}
          metalness={canMaterialConfig.metalness}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, bottomY + 0.012, 0]} userData={{ canSurface: true }}>
        <cylinderGeometry
          args={[
            canConfig.insetRadius,
            canConfig.insetRadius,
            0.024,
            canConfig.radialSegments,
          ]}
        />
        <meshStandardMaterial
          color={canMaterialConfig.color}
          envMapIntensity={canMaterialConfig.envMapIntensity * 0.7}
          metalness={canMaterialConfig.metalness}
          roughness={0.48}
        />
      </mesh>
    </group>
  );
}
