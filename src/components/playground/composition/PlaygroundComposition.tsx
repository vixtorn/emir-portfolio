"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useGpuSceneActivity } from "@/hooks/useGpuSceneActivity";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gpuSceneConfig } from "@/lib/performance/gpu-config";

import CanArtifact from "../can/CanArtifact";
import StudioEnvironment from "../can/StudioEnvironment";
import KeychainPendulum from "../keychain/KeychainPendulum";
import ScratchBoardingPassLab from "../scratch/ScratchBoardingPassLab";
import TamagotchiMotion from "../tamagotchi/TamagotchiMotion";
import PlaygroundTerminal from "../terminal/PlaygroundTerminal";
import TerminalDevice from "../terminal/TerminalDevice";
import styles from "./PlaygroundComposition.module.css";

type CompositionLayout = {
  can: { position: [number, number, number]; scale: number };
  tamagotchi: { position: [number, number, number]; scale: number };
  keychain: { position: [number, number, number]; scale: number };
  bmw: { position: [number, number, number]; scale: number };
};

const desktopLayout: CompositionLayout = {
  can: { position: [0, -0.6, 0], scale: 1.45 },
  tamagotchi: { position: [3, -0.3, -1], scale: 0.7 },
  keychain: { position: [-4, -1.35, 1], scale: 0.7 },
  bmw: { position: [3.79, -2.75, -0.5], scale: 0.46 },
};

const tabletLayout: CompositionLayout = {
  can: { position: [0, -0.6, 0], scale: 1.2 },
  tamagotchi: { position: [2.35, -0.65, -1], scale: 0.62 },
  keychain: { position: [-3, -1.55, 1], scale: 0.62 },
  bmw: { position: [2.9, -2.55, -0.5], scale: 0.4 },
};

const mobileLayout: CompositionLayout = {
  can: { position: [0, -0.35, 0], scale: 0.82 },
  tamagotchi: { position: [1.1, -1.05, -1], scale: 0.42 },
  keychain: { position: [-1.2, -1.25, 1], scale: 0.42 },
  bmw: { position: [1.3, -2.05, -0.5], scale: 0.26 },
};

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

function useCompositionLayout() {
  const [layout, setLayout] = useState<CompositionLayout>(desktopLayout);

  useEffect(() => {
    const tabletQuery = window.matchMedia("(max-width: 1199px)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateLayout = () => {
      setLayout(
        mobileQuery.matches
          ? mobileLayout
          : tabletQuery.matches
            ? tabletLayout
            : desktopLayout,
      );
    };

    updateLayout();
    tabletQuery.addEventListener("change", updateLayout);
    mobileQuery.addEventListener("change", updateLayout);

    return () => {
      tabletQuery.removeEventListener("change", updateLayout);
      mobileQuery.removeEventListener("change", updateLayout);
    };
  }, []);

  return layout;
}

function Bmw({ layout }: { layout: CompositionLayout }) {
  const gltf = useLoader(
    GLTFLoader,
    "/models/playground/diecast/bmw-m3-gtr-v1.glb",
  );
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const time = state.clock.elapsedTime;
    ref.current.position.set(
      layout.bmw.position[0] + Math.sin(time * 0.74 + 0.9) * 0.07,
      layout.bmw.position[1] + Math.sin(time * 1.01) * 0.055,
      layout.bmw.position[2],
    );
    ref.current.rotation.set(
      Math.sin(time * 0.71) * 0.009,
      (-35 * Math.PI) / 180 + Math.sin(time * 0.53) * 0.022,
      Math.sin(time * 0.61 + 0.4) * 0.007,
    );
  });

  return (
    <group ref={ref} scale={layout.bmw.scale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function TamagotchiArtifact({
  finePointer,
  layout,
  reducedMotion,
}: {
  finePointer: boolean;
  layout: CompositionLayout;
  reducedMotion: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group position={layout.tamagotchi.position} scale={layout.tamagotchi.scale}>
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
  layout,
  reducedMotion,
}: {
  finePointer: boolean;
  layout: CompositionLayout;
  reducedMotion: boolean;
}) {
  return (
    <group position={layout.keychain.position} scale={layout.keychain.scale}>
      <KeychainPendulum
        finePointer={finePointer}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

function Scene({
  onCanCursorChange,
  finePointer,
  layout,
  reducedMotion,
}: {
  onCanCursorChange: (cursor: string) => void;
  finePointer: boolean;
  layout: CompositionLayout;
  reducedMotion: boolean;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <group position={layout.can.position} scale={layout.can.scale}>
          <CanArtifact
            onCursorChange={onCanCursorChange}
            prefersReducedMotion={reducedMotion}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <TamagotchiArtifact
          finePointer={finePointer}
          layout={layout}
          reducedMotion={reducedMotion}
        />
      </Suspense>
      <Suspense fallback={null}>
        <KeychainArtifact
          finePointer={finePointer}
          layout={layout}
          reducedMotion={reducedMotion}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Bmw layout={layout} />
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
  const layout = useCompositionLayout();
  const reducedMotion = useReducedMotion();
  const [canCursor, setCanCursor] = useState("default");
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
        style={{ cursor: canCursor }}
      >
        <color attach="background" args={[0x080808]} />
        <StudioEnvironment />
        <ambientLight intensity={0.3} />
        <hemisphereLight intensity={0.45} />
        <directionalLight intensity={2.2} position={[5, 7, 8]} />
        <directionalLight intensity={0.8} position={[-5, 3, 4]} />
        <Scene
          finePointer={finePointer}
          layout={layout}
          onCanCursorChange={setCanCursor}
          reducedMotion={reducedMotion}
        />
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
        <TerminalDevice
          className={styles.compactTerminalDevice}
          onPowerChange={setIsTerminalPowered}
        >
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
