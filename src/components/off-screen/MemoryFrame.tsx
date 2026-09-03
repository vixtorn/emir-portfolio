import Image from "next/image";
import type { CSSProperties } from "react";

import type { MemoryItem } from "./off-screen-memory-data";
import styles from "./OffScreenSection.module.css";

type MemoryFrameProps = {
  memory: MemoryItem;
  index: number;
  mode: "desktop" | "mobile";
  frameRef?: (element: HTMLElement | null) => void;
  hovered?: boolean;
  onHoverChange?: (memoryId: string | null) => void;
};

export default function MemoryFrame({ memory, index, mode, frameRef, hovered = false, onHoverChange }: MemoryFrameProps) {
  const metadata = [memory.location, memory.date].filter(Boolean).join(" / ") || "LOCATION / YEAR";
  const style =
    mode === "desktop"
      ? ({
          "--memory-depth": `${memory.desktop.depth}px`,
          "--memory-layer": memory.desktop.layer ?? 1,
          "--memory-opacity": memory.desktop.opacity,
          "--memory-rotate": `${memory.desktop.rotate}deg`,
          "--memory-scale": memory.desktop.scale,
          "--memory-width": `${memory.desktop.width}vw`,
          "--memory-x": `${memory.desktop.x}vw`,
          "--memory-y": `${memory.desktop.y}svh`,
          zIndex: hovered ? 50 : memory.desktop.layer ?? 1,
        } as CSSProperties)
      : ({ "--memory-rotate": `${memory.desktop.rotate * 0.45}deg` } as CSSProperties);

  return (
    <div
      ref={frameRef}
      data-hovered-memory={hovered || undefined}
      data-memory-id={memory.id}
      data-prominence={memory.desktop.opacity}
      className={`${styles.memoryPosition} ${mode === "desktop" ? styles.desktopMemoryPosition : styles.mobileMemoryPosition}`}
      style={style}
    >
      <figure data-role={memory.role} className={`${styles.memoryFrame} ${styles[`tone${memory.tone}`]} ${mode === "desktop" ? styles.desktopFrame : styles.mobileFrame}`}>
        <div className={styles.imageArea} style={{ aspectRatio: memory.aspectRatio }}>
          {memory.src ? (
            <Image alt={memory.alt ?? ""} fill priority={index === 0} sizes={mode === "desktop" ? "43vw" : "88vw"} src={memory.src} />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              <span className="type-micro">MEMORY {String(index + 1).padStart(2, "0")}</span>
              <strong>{memory.role.toUpperCase()} MEMORY</strong>
            </div>
          )}
        </div>
        {memory.showCaption !== false && (
          <figcaption className={styles.caption}>
            <span className="type-micro">{metadata}</span>
            {memory.caption?.map((line) => <span key={line}>{line}</span>)}
          </figcaption>
        )}
      </figure>
      {mode === "desktop" && (
        <div
          aria-hidden="true"
          className={styles.desktopHitTarget}
          onPointerEnter={() => onHoverChange?.(memory.id)}
          onPointerLeave={() => onHoverChange?.(null)}
        />
      )}
    </div>
  );
}
