"use client";

import { useCallback, useState } from "react";

import ScratchBoardingPass from "./ScratchBoardingPass";
import styles from "./ScratchBoardingPass.module.css";

export default function ScratchBoardingPassLab() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const reset = useCallback(() => {
    setIsUnlocked(false);
    setResetKey((currentKey) => currentKey + 1);
  }, []);

  return (
    <div className={styles.lab}>
      <div className={styles.status} aria-live="polite">
        <p className="type-meta">STATUS: {isUnlocked ? "UNLOCKED" : "LOCKED"}</p>
        <button className={`${styles.reset} type-meta`} type="button" onClick={reset}>
          RESET
        </button>
      </div>
      <ScratchBoardingPass
        resetKey={resetKey}
        onUnlockedChange={setIsUnlocked}
      />
    </div>
  );
}
