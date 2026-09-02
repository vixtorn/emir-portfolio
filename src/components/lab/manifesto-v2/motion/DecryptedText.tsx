"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import styles from "../ManifestoV2.module.css";

type DecryptedTextProps = { text: string; initialText: string; speed?: number };

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_";

export default function DecryptedText({ text, initialText, speed = 45 }: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(initialText);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const available = useMemo(() => glyphs.split(""), []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHasAnimated(true);
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let revealed = 0;
    const timer = window.setInterval(() => {
      revealed += 1;
      const next = new Set<number>();
      for (let index = 0; index < revealed; index += 1) next.add(index);
      setDisplayText(text.split("").map((character, index) => {
        if (character === " ") return " ";
        return next.has(index) ? character : available[(index + revealed * 3) % available.length];
      }).join(""));
      if (revealed >= text.length) window.clearInterval(timer);
    }, speed);
    return () => window.clearInterval(timer);
  }, [available, hasAnimated, speed, text]);

  return <span ref={containerRef} className={styles.decrypt} aria-label={text}>{displayText || initialText}</span>;
}
