import { useState, type MutableRefObject } from "react";

import MemoryFrame from "./MemoryFrame";
import { offScreenMemories } from "./off-screen-memory-data";
import styles from "./OffScreenSection.module.css";

type MemoryJourneyDesktopProps = { frameRefs: MutableRefObject<Array<HTMLElement | null>> };

export default function MemoryJourneyDesktop({ frameRefs }: MemoryJourneyDesktopProps) {
  const [hoveredMemoryId, setHoveredMemoryId] = useState<string | null>(null);

  return (
    <div className={styles.desktopJourney} aria-label="Off Screen memory journey" data-has-hovered-memory={hoveredMemoryId !== null}>
      {offScreenMemories.map((memory, index) => (
        <MemoryFrame
          frameRef={(element) => { frameRefs.current[index] = element; }}
          hovered={hoveredMemoryId === memory.id}
          index={index}
          key={memory.id}
          memory={memory}
          mode="desktop"
          onHoverChange={setHoveredMemoryId}
        />
      ))}
    </div>
  );
}
