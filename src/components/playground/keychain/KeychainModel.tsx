"use client";
import { useLayoutEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { keychainConfig } from "./keychain-config";
export type KeychainBounds = { center: [number, number, number]; size: [number, number, number] };
export default function KeychainModel({ onBoundsReady }: { onBoundsReady: (bounds: KeychainBounds) => void }) { const gltf = useLoader(GLTFLoader, "/models/playground/keychain/raze-chibi-v1.glb"); useLayoutEffect(() => { gltf.scene.updateMatrixWorld(true); const bounds = new Box3().setFromObject(gltf.scene); const center = bounds.getCenter(new Vector3()); const size = bounds.getSize(new Vector3()); const scale = keychainConfig.modelScale; onBoundsReady({ center: [center.x * scale + keychainConfig.modelOffset[0], center.y * scale + keychainConfig.modelOffset[1] + keychainConfig.swingPivotY, center.z * scale + keychainConfig.modelOffset[2]], size: [size.x * scale, size.y * scale, size.z * scale] }); }, [gltf, onBoundsReady]); return <group position={keychainConfig.modelOffset} scale={keychainConfig.modelScale}><primitive dispose={null} object={gltf.scene} /></group>; }
