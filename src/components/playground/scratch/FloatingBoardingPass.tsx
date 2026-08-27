"use client";

import type { ReactNode } from "react";

import styles from "./FloatingBoardingPass.module.css";

type FloatingBoardingPassProps = {
  children: ReactNode;
  isPaused: boolean;
  prefersReducedMotion: boolean;
};

export default function FloatingBoardingPass({
  children,
  isPaused,
  prefersReducedMotion,
}: FloatingBoardingPassProps) {
  return (
    <div
      className={styles.presentation}
      data-paused={isPaused || undefined}
      data-reduced-motion={prefersReducedMotion || undefined}
    >
      <div aria-hidden="true" className={styles.shadow} />
      {children}
    </div>
  );
}
