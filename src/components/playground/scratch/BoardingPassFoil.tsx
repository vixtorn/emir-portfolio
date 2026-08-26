"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./BoardingPassFoil.module.css";

const boardingPassSrc = "/images/playground/boarding-pass/boarding-pass-v1.png";
const damping = 0.14;

type FoilMotion = {
  mx: number;
  my: number;
  rx: number;
  ry: number;
};

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

export default function BoardingPassFoil() {
  const passRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const currentMotionRef = useRef<FoilMotion>({ mx: 50, my: 50, rx: 0, ry: 0 });
  const targetMotionRef = useRef<FoilMotion>({ mx: 50, my: 50, rx: 0, ry: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

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

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  return (
    <div
      ref={passRef}
      className={styles.pass}
      data-reduced-motion={prefersReducedMotion}
      onPointerLeave={() => {
        if (prefersReducedMotion) return;

        targetMotionRef.current = { mx: 50, my: 50, rx: 0, ry: 0 };
        queueMotion();
      }}
      onPointerMove={(event) => {
        if (prefersReducedMotion) return;

        const bounds = event.currentTarget.getBoundingClientRect();
        const mx = ((event.clientX - bounds.left) / bounds.width) * 100;
        const my = ((event.clientY - bounds.top) / bounds.height) * 100;

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
        <Image
          alt="Boarding pass for the Playground experience"
          className={styles.image}
          height={416}
          priority
          sizes="(max-width: 680px) calc(100vw - 3rem), min(100vw - 4rem, 52rem)"
          src={boardingPassSrc}
          width={800}
        />
        <div aria-hidden="true" className={styles.foil}>
          <div className={styles.glare} />
        </div>
      </div>
    </div>
  );
}
