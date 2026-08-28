"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import CanModel from "../can/CanModel";
import StudioEnvironment from "../can/StudioEnvironment";
import KeychainPendulum from "../keychain/KeychainPendulum";
import ScratchBoardingPassLab from "../scratch/ScratchBoardingPassLab";
import TamagotchiMotion from "../tamagotchi/TamagotchiMotion";
import PlaygroundTerminal from "../terminal/PlaygroundTerminal";
import TerminalDevice from "../terminal/TerminalDevice";
import styles from "./PlaygroundComposition.module.css";

const layout = {
  can: [0, -0.6, 0] as [number, number, number],
  tamagotchi: [3, -0.3, -1] as [number, number, number],
  keychain: [-4, -1.35, 1] as [number, number, number],
  bmw: [3.79, -2.75, -0.5] as [number, number, number],
  bmwScale: 0.46,
} as const;

function useFinePointer() {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return finePointer;
}

function Motion({
  children,
  position,
  scale,
  spin = 0,
}: {
  children: ReactNode;
  position: [number, number, number];
  scale: number;
  spin?: number;
}) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * (0.7 + spin)) * 0.025;
    ref.current.rotation.y = spin
      ? Math.sin(state.clock.elapsedTime * spin) * 0.08
      : 0;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  );
}

function Bmw() {
  const gltf = useLoader(
    GLTFLoader,
    "/models/playground/diecast/bmw-m3-gtr-v1.glb",
  );
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.elapsedTime;
    ref.current.position.set(
      layout.bmw[0] + Math.sin(time * 0.74 + 0.9) * 0.07,
      layout.bmw[1] + Math.sin(time * 1.01) * 0.055,
      layout.bmw[2],
    );
    ref.current.rotation.set(
      Math.sin(time * 0.71) * 0.009,
      (-35 * Math.PI) / 180 + Math.sin(time * 0.53) * 0.022,
      Math.sin(time * 0.61 + 0.4) * 0.007,
    );
  });

  return (
    <group ref={ref} scale={layout.bmwScale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function TamagotchiArtifact({
  finePointer,
  reducedMotion,
}: {
  finePointer: boolean;
  reducedMotion: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group position={layout.tamagotchi} scale={0.7}>
      <TamagotchiMotion
        finePointer={finePointer}
        isHovered={isHovered}
        onHoverChange={setIsHovered}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

function KeychainArtifact({
  finePointer,
  reducedMotion,
}: {
  finePointer: boolean;
  reducedMotion: boolean;
}) {
  return (
    <group position={layout.keychain} scale={0.7}>
      <KeychainPendulum
        finePointer={finePointer}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

function Scene({
  finePointer,
  reducedMotion,
}: {
  finePointer: boolean;
  reducedMotion: boolean;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Motion position={layout.can} scale={1.45} spin={0.2}>
          <CanModel onPointerOut={() => {}} onPointerOver={() => {}} />
        </Motion>
      </Suspense>
      <Suspense fallback={null}>
        <TamagotchiArtifact
          finePointer={finePointer}
          reducedMotion={reducedMotion}
        />
      </Suspense>
      <Suspense fallback={null}>
        <KeychainArtifact
          finePointer={finePointer}
          reducedMotion={reducedMotion}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Bmw />
      </Suspense>
    </>
  );
}

function isTerminalPowerControl(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest("button") !== null;
}

export default function PlaygroundComposition() {
  const ref = useRef<HTMLDivElement>(null);
  const compactTerminalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasExpandedRef = useRef(false);
  const { isActive } = useGpuSceneActivity({
    id: "lab-playground-composition",
    elementRef: ref,
    priority: 1,
  });
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [isTerminalPowered, setIsTerminalPowered] = useState(true);

  const openTerminal = (event: MouseEvent<HTMLDivElement>) => {
    if (!isTerminalPowered || isTerminalPowerControl(event.target)) return;

    setExpanded(true);
  };

  const closeTerminal = () => setExpanded(false);

  useEffect(() => {
    if (!expanded) {
      if (wasExpandedRef.current) compactTerminalRef.current?.focus();
      return;
    }

    wasExpandedRef.current = true;
    closeButtonRef.current?.focus();

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeTerminal();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [expanded]);

  const handleTerminalKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.currentTarget !== event.target ||
      !isTerminalPowered ||
      isTerminalPowerControl(event.target)
    ) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <section ref={ref} className={styles.composition}>
      <Canvas
        className={styles.canvas}
        camera={{ fov: 34, position: [0, 0, 13] }}
        dpr={[1, gpuSceneConfig.desktopMaxDpr]}
        frameloop={isActive ? "always" : "never"}
      >
        <color attach="background" args={[0x080808]} />
        <StudioEnvironment />
        <ambientLight intensity={0.3} />
        <hemisphereLight intensity={0.45} />
        <directionalLight intensity={2.2} position={[5, 7, 8]} />
        <directionalLight intensity={0.8} position={[-5, 3, 4]} />
        <Scene finePointer={finePointer} reducedMotion={reducedMotion} />
      </Canvas>

      <div className={styles.boarding}>
        <ScratchBoardingPassLab />
      </div>

      <div
        ref={compactTerminalRef}
        aria-label="Expand playground terminal"
        className={styles.terminal}
        onClick={openTerminal}
        onKeyDown={handleTerminalKeyDown}
        role="button"
        tabIndex={0}
      >
        <TerminalDevice onPowerChange={setIsTerminalPowered}>
          <PlaygroundTerminal />
        </TerminalDevice>
      </div>

      {expanded && (
        <div
          aria-label="Expanded playground terminal"
          aria-modal="true"
          className={styles.modal}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) closeTerminal();
          }}
          role="dialog"
        >
          <div className={styles.modalContent}>
            <button
              ref={closeButtonRef}
              className={styles.close}
              type="button"
              onClick={closeTerminal}
            >
              CLOSE ×
            </button>
            <TerminalDevice className={styles.expandedTerminal}>
              <PlaygroundTerminal />
            </TerminalDevice>
          </div>
        </div>
      )}
    </section>
  );
}
