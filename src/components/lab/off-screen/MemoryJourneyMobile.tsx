import MemoryFrame from "./MemoryFrame";
import { offScreenMemories } from "./off-screen-memory-data";
import styles from "./OffScreenLab.module.css";

export default function MemoryJourneyMobile() {
  return (
    <div className={styles.mobileJourney} aria-label="Off Screen memory sequence">
      {offScreenMemories.map((memory, index) => (
        <MemoryFrame index={index} key={memory.id} memory={memory} mode="mobile" />
      ))}
    </div>
  );
}
