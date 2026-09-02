"use client";

import { useEffect, useRef, useState } from "react";

const labelFrames = [
  "02 / M_N_F_ST_",
  "02 / MAN_F_ST_",
  "02 / MANIF_ST_",
  "02 / MANIFEST_",
  "02 / MANIFESTO",
] as const;

type ManifestoChapterProps = {
  reducedMotion: boolean;
};

export default function ManifestoChapter({ reducedMotion }: ManifestoChapterProps) {
  const [frame, setFrame] = useState(reducedMotion ? labelFrames.length - 1 : 0);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const didResolve = useRef(reducedMotion);

  useEffect(() => {
    if (reducedMotion || !labelRef.current || didResolve.current) return;

    const timeouts: number[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || didResolve.current) return;

      didResolve.current = true;
      labelFrames.slice(1).forEach((_, index) => {
        timeouts.push(window.setTimeout(() => setFrame(index + 1), (index + 1) * 175));
      });
      observer.disconnect();
    }, { threshold: 0.6 });

    observer.observe(labelRef.current);

    return () => {
      observer.disconnect();
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [reducedMotion]);

  return (
    <p ref={labelRef} aria-label="02 / MANIFESTO" className="type-meta">
      <span aria-hidden="true">{labelFrames[frame]}</span>
    </p>
  );
}
