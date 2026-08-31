"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cncSequenceConfig } from "./cncSequenceConfig";
import styles from "./CncSequencePreview.module.css";

type CncSequencePreviewProps = {
  className?: string;
};

const nearbyPreloadCount = 4;

function getSectionProgress(element: HTMLElement) {
  const section = element.closest<HTMLElement>("[data-cnc-motion-showcase]");

  if (!section) {
    return 0;
  }

  const { top, height } = section.getBoundingClientRect();
  const travel = window.innerHeight + height;

  return Math.min(1, Math.max(0, (window.innerHeight - top) / travel));
}

export default function CncSequencePreview({ className }: CncSequencePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const preview = previewRef.current;

    if (!preview) {
      return;
    }

    let animationFrame: number | null = null;
    let isActive = false;

    const updateFrame = () => {
      animationFrame = null;

      const nextFrameIndex = Math.round(
        getSectionProgress(preview) * (cncSequenceConfig.frames.length - 1),
      );

      setFrameIndex((currentFrameIndex) =>
        currentFrameIndex === nextFrameIndex ? currentFrameIndex : nextFrameIndex,
      );
    };

    const requestFrameUpdate = () => {
      if (isActive && animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateFrame);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isActive = entry.isIntersecting;

        if (isActive) {
          requestFrameUpdate();
        }
      },
      { rootMargin: "20% 0px" },
    );

    observer.observe(preview);
    window.addEventListener("scroll", requestFrameUpdate, { passive: true });
    window.addEventListener("resize", requestFrameUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestFrameUpdate);
      window.removeEventListener("resize", requestFrameUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    const preloadFrames = [
      ...cncSequenceConfig.frames.slice(1, nearbyPreloadCount + 1),
      ...cncSequenceConfig.frames.slice(nearbyPreloadCount + 1),
    ];
    const preload = () => {
      preloadFrames.forEach((source) => {
        const preloadImage = new window.Image();
        preloadImage.src = source;
      });
    };
    const timeoutId = window.setTimeout(preload, 250);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div ref={previewRef} className={`${styles.preview} ${className ?? ""}`.trim()}>
      <Image
        key={cncSequenceConfig.frames[frameIndex]}
        className={styles.frame}
        src={cncSequenceConfig.frames[frameIndex]}
        alt="CNC turning center machining sequence"
        fill
        sizes="(max-width: 680px) 100vw, 50vw"
        unoptimized
      />
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  );
}
