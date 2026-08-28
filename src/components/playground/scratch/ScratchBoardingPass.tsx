"use client";

import ScratchSurface from "./ScratchSurface";
import styles from "./ScratchBoardingPass.module.css";

type ScratchBoardingPassProps = {
  onProgressChange?: (progress: number) => void;
  onUnlock?: () => void;
  onUnlockedChange?: (unlocked: boolean) => void;
  resetKey?: number;
};

export default function ScratchBoardingPass({
  onProgressChange,
  onUnlock,
  onUnlockedChange,
  resetKey,
}: ScratchBoardingPassProps) {
  return (
    <article className={styles.card}>
      <div className={styles.result} aria-live="polite">
        <p className="type-meta">TECHNICAL RESULT</p>
        <strong>RARE UNLOCKED</strong>
      </div>
      <ScratchSurface
        className={styles.surface}
        resetKey={resetKey}
        onProgressChange={onProgressChange}
        onUnlock={onUnlock}
        onUnlockedChange={onUnlockedChange}
      />
      <p id="scratch-surface-description" className="sr-only">
        This experiment uses a scratch gesture. A non-gesture alternative will
        be required before production use.
      </p>
    </article>
  );
}
