import type { MutableRefObject } from "react";

import MemoryFrame from "./MemoryFrame";
import { offScreenMemories } from "./off-screen-memory-data";
import styles from "./OffScreenLab.module.css";

type MemoryJourneyDesktopProps = { frameRefs: MutableRefObject<Array<HTMLElement | null>> };

export default function MemoryJourneyDesktop({ frameRefs }: MemoryJourneyDesktopProps) {
  return (
    <div className={styles.desktopJourney} aria-label="Off Screen memory journey">
      {offScreenMemories.map((memory, index) => (
        <MemoryFrame frameRef={(element) => { frameRefs.current[index] = element; }} index={index} key={memory.id} memory={memory} mode="desktop" />
      ))}
    </div>
  );
}
