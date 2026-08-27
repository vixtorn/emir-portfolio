"use client";
import { useLoader, type ThreeEvent } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { tamagotchiConfig } from "./tamagotchi-config";
const modelPath = "/models/playground/tamagotchi/tamagotchi-v1.glb";
export default function TamagotchiModel({ onPointerMove, onPointerOut, onPointerOver }: { onPointerMove: (event: ThreeEvent<PointerEvent>) => void; onPointerOut: (event: ThreeEvent<PointerEvent>) => void; onPointerOver: () => void }) { const gltf = useLoader(GLTFLoader, modelPath); return <group onPointerMove={onPointerMove} onPointerOut={onPointerOut} onPointerOver={onPointerOver}><group position={tamagotchiConfig.modelPosition} scale={tamagotchiConfig.modelScale}><primitive dispose={null} object={gltf.scene} /></group></group>; }
