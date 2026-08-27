"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import styles from "./BoardingPassFoil.module.css";
import FloatingBoardingPass from "./FloatingBoardingPass";
import { scratchInteractionGuard } from "./scratch-config";
import ScratchSurface from "./ScratchSurface";
import { tearConfig } from "./tear-config";
import TearOffStub from "./TearOffStub";

const boardingPassSrc = "/images/playground/boarding-pass/boarding-pass-v1.png";
const damping = 0.14;

type FoilMotion = {
  mx: number;
  my: number;
  rx: number;
  ry: number;
};

type SourceBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type BoardingPassFoilProps = {
  onUnlock?: () => void;
  onUnlockedChange?: (unlocked: boolean) => void;
  resetKey?: number;
};

function isWithinSourceBounds(
  normalizedX: number,
  normalizedY: number,
  bounds: SourceBounds,
  sourceSize: { width: number; height: number },
) {
  const { width, height } = sourceSize;

  return (
    normalizedX >= bounds.left / width &&
    normalizedX <= bounds.right / width &&
    normalizedY >= bounds.top / height &&
    normalizedY <= bounds.bottom / height
  );
}

const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export default function BoardingPassFoil({
  onUnlock,
  onUnlockedChange,
  resetKey,
}: BoardingPassFoilProps) {
  const passRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const currentMotionRef = useRef<FoilMotion>({ mx: 50, my: 50, rx: 0, ry: 0 });
  const targetMotionRef = useRef<FoilMotion>({ mx: 50, my: 50, rx: 0, ry: 0 });
  const scratchGuardActiveRef = useRef(false);
  const scratchingRef = useRef(false);
  const tearGuardActiveRef = useRef(false);
  const tearingRef = useRef(false);
  const [isScratchGuardActive, setIsScratchGuardActive] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [isTearGuardActive, setIsTearGuardActive] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const [isStubTorn, setIsStubTorn] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const interactionMotionLocked =
    isScratchGuardActive || isScratching || isTearGuardActive || isTearing;
  const isPresentationPaused = interactionMotionLocked || isStubTorn;

  const applyMotion = useCallback(() => {
    const pass = passRef.current;
    if (!pass) return;

    const current = currentMotionRef.current;

    pass.style.setProperty("--mx", `${current.mx}%`);
    pass.style.setProperty("--my", `${current.my}%`);
    pass.style.setProperty("--rx", `${current.rx}deg`);
    pass.style.setProperty("--ry", `${current.ry}deg`);
    pass.style.setProperty("--foil-x", `${current.mx}%`);
    pass.style.setProperty("--foil-y", `${current.my}%`);

    const dx = current.mx - 50;
    const dy = current.my - 50;
    const pointerDistance = Math.min(
      1,
      Math.hypot(dx, dy) / Math.hypot(50, 50),
    );
    const foilAngle =
      pointerDistance < 0.015 ? 132 : (Math.atan2(dy, dx) * 180) / Math.PI;

    pass.style.setProperty("--foil-angle", `${(foilAngle + 360) % 360}deg`);
    pass.style.setProperty("--foil-intensity", `${1.08 + pointerDistance * 0.58}`);
    pass.style.setProperty("--foil-brightness", `${0.98 + pointerDistance * 0.15}`);
    pass.style.setProperty("--foil-opacity", `${0.72 + pointerDistance * 0.18}`);
    pass.style.setProperty("--foil-glare", `${0.38 + pointerDistance * 0.38}`);
  }, []);

  const animateMotion = useCallback(function animateMotion() {
    const current = currentMotionRef.current;
    const target = targetMotionRef.current;

    current.mx += (target.mx - current.mx) * damping;
    current.my += (target.my - current.my) * damping;
    current.rx += (target.rx - current.rx) * damping;
    current.ry += (target.ry - current.ry) * damping;
    applyMotion();

    const remainingMotion = Math.max(
      Math.abs(target.mx - current.mx),
      Math.abs(target.my - current.my),
      Math.abs(target.rx - current.rx),
      Math.abs(target.ry - current.ry),
    );

    if (remainingMotion > 0.02) {
      frameRef.current = requestAnimationFrame(animateMotion);
      return;
    }

    currentMotionRef.current = { ...target };
    applyMotion();
    frameRef.current = null;
  }, [applyMotion]);

  const queueMotion = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(animateMotion);
    }
  }, [animateMotion]);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    targetMotionRef.current = { mx: 50, my: 50, rx: 0, ry: 0 };
    currentMotionRef.current = { mx: 50, my: 50, rx: 0, ry: 0 };
    applyMotion();
  }, [applyMotion, prefersReducedMotion]);

  useEffect(() => {
    setIsStubTorn(false);
  }, [resetKey]);

  const neutralizeScratchMotion = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    currentMotionRef.current.rx = 0;
    currentMotionRef.current.ry = 0;
    targetMotionRef.current = {
      ...currentMotionRef.current,
      rx: 0,
      ry: 0,
    };
    applyMotion();
  }, [applyMotion]);

  useLayoutEffect(() => {
    if (!interactionMotionLocked) return;

    neutralizeScratchMotion();
  }, [interactionMotionLocked, neutralizeScratchMotion]);

  const setScratchGuardActive = useCallback((isActive: boolean) => {
    if (scratchGuardActiveRef.current === isActive) return;

    scratchGuardActiveRef.current = isActive;
    setIsScratchGuardActive(isActive);
    if (isActive) {
      neutralizeScratchMotion();
    }
  }, [neutralizeScratchMotion]);

  const handleScratchActiveChange = useCallback((isActive: boolean) => {
    scratchingRef.current = isActive;
    setIsScratching(isActive);
    if (isActive) {
      neutralizeScratchMotion();
    }
  }, [neutralizeScratchMotion]);

  const setTearGuardActive = useCallback((isActive: boolean) => {
    if (tearGuardActiveRef.current === isActive) return;

    tearGuardActiveRef.current = isActive;
    setIsTearGuardActive(isActive);
    if (isActive) {
      neutralizeScratchMotion();
    }
  }, [neutralizeScratchMotion]);

  const handleTearDragChange = useCallback((isActive: boolean) => {
    tearingRef.current = isActive;
    setIsTearing(isActive);
    if (isActive) {
      neutralizeScratchMotion();
    }
  }, [neutralizeScratchMotion]);

  const handleTearHoverChange = useCallback((isActive: boolean) => {
    if (!tearingRef.current) {
      setTearGuardActive(isActive);
    }
  }, [setTearGuardActive]);

  const handleTear = useCallback(() => {
    setIsStubTorn(true);
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  return (
    <FloatingBoardingPass
      isPaused={isPresentationPaused}
      prefersReducedMotion={prefersReducedMotion}
    >
      <div
        ref={passRef}
        className={styles.pass}
        data-reduced-motion={prefersReducedMotion}
        onPointerLeave={() => {
          if (prefersReducedMotion || scratchingRef.current || tearingRef.current) return;

          setScratchGuardActive(false);
          setTearGuardActive(false);

          targetMotionRef.current = { mx: 50, my: 50, rx: 0, ry: 0 };
          queueMotion();
        }}
        onPointerMove={(event) => {
          if (prefersReducedMotion) return;

          const bounds = passRef.current?.getBoundingClientRect();
          if (!bounds) return;

          const normalizedX = (event.clientX - bounds.left) / bounds.width;
          const normalizedY = (event.clientY - bounds.top) / bounds.height;
          const scratchGuard = scratchGuardActiveRef.current
            ? scratchInteractionGuard.exit
            : scratchInteractionGuard.enter;
          const isWithinScratchGuard = isWithinSourceBounds(
            normalizedX,
            normalizedY,
            scratchGuard,
            scratchInteractionGuard.sourceSize,
          );
          const isWithinTearGuard = isWithinSourceBounds(
            normalizedX,
            normalizedY,
            tearConfig.preActivationGuard,
            tearConfig.sourceSize,
          );

          if (!scratchingRef.current) {
            setScratchGuardActive(isWithinScratchGuard);
          }
          if (!tearingRef.current) {
            setTearGuardActive(isWithinTearGuard);
          }

          if (
            scratchGuardActiveRef.current ||
            scratchingRef.current ||
            tearGuardActiveRef.current ||
            tearingRef.current
          ) {
            return;
          }

          const mx = normalizedX * 100;
          const my = normalizedY * 100;

          targetMotionRef.current = {
            mx: Math.min(100, Math.max(0, mx)),
            my: Math.min(100, Math.max(0, my)),
            rx: (50 - my) * 0.045,
            ry: (mx - 50) * 0.055,
          };
          queueMotion();
        }}
      >
      <div className={styles.ticket}>
        <div
          className={styles.mainArtwork}
          style={{ width: toPercent(tearConfig.tearX, tearConfig.sourceSize.width) }}
        >
          <Image
            alt="Boarding pass for the Playground experience"
            className={`${styles.image} ${styles.mainImage}`}
            height={416}
            priority
            sizes="(max-width: 680px) calc(100vw - 3rem), min(100vw - 4rem, 52rem)"
            src={boardingPassSrc}
            style={{
              width: toPercent(tearConfig.sourceSize.width, tearConfig.tearX),
            }}
            width={800}
          />
        </div>
        <TearOffStub
          key={resetKey}
          onDragChange={handleTearDragChange}
          onHoverChange={handleTearHoverChange}
          onTear={handleTear}
        />
        <div aria-hidden="true" className={styles.foil}>
          <div className={styles.glare} />
        </div>
        <div className={styles.scratchReveal} aria-live="polite">
          <span className="type-meta">RARE</span>
          <strong>UNLOCKED</strong>
        </div>
        <ScratchSurface
          className={styles.scratchSurface}
          resetKey={resetKey}
          onScratchActiveChange={handleScratchActiveChange}
          onUnlock={onUnlock}
          onUnlockedChange={onUnlockedChange}
        />
        <p id="scratch-surface-description" className="sr-only">
          Scratch the gray panel to reveal the technical result.
        </p>
      </div>
      </div>
    </FloatingBoardingPass>
  );
}
