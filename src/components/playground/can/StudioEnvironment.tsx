"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Mesh, PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export default function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const sceneRef = useRef(scene);

  useEffect(() => {
    const pmremGenerator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = pmremGenerator.fromScene(room).texture;
    const currentScene = sceneRef.current;
    const previousEnvironment = currentScene.environment;

    currentScene.environment = environment;

    return () => {
      currentScene.environment = previousEnvironment;
      environment.dispose();
      pmremGenerator.dispose();
      room.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [gl]);

  return null;
}
