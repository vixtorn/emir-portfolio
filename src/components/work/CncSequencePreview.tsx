"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import styles from "./CncSequencePreview.module.css";

type CncSequencePreviewProps = {
  className?: string;
};

export default function CncSequencePreview({ className }: CncSequencePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const preview = previewRef.current;
    const video = videoRef.current;

    if (!preview || !video) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;

    const updatePlayback = () => {
      if (reducedMotionQuery.matches || !isVisible) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // Autoplay may be unavailable; the poster remains visible without a console error.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.25 },
    );

    observer.observe(preview);
    reducedMotionQuery.addEventListener("change", updatePlayback);

    return () => {
      observer.disconnect();
      reducedMotionQuery.removeEventListener("change", updatePlayback);
      video.pause();
    };
  }, []);

  return (
    <div ref={previewRef} className={`${styles.preview} ${className ?? ""}`.trim()}>
      <video
        ref={videoRef}
        className={styles.video}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster="/media/work/cnc/cnc-poster.webp"
        aria-label="CNC turning center machining sequence"
      >
        <source src="/media/work/cnc/cnc-preview.webm" type="video/webm" />
        <source src="/media/work/cnc/cnc-preview.mp4" type="video/mp4" />
      </video>
      <Image
        className={styles.poster}
        src="/media/work/cnc/cnc-poster.webp"
        alt="CNC turning center machining sequence"
        fill
        sizes="(max-width: 680px) 100vw, 50vw"
        unoptimized
      />
      <div className={styles.vignette} aria-hidden="true" />
    </div>
  );
}
