"use client";

import { useLayoutEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { configureGsap, gsap } from "@/lib/motion/gsap";

import MemoryJourneyDesktop from "./MemoryJourneyDesktop";
import MemoryJourneyMobile from "./MemoryJourneyMobile";
import styles from "./OffScreenLab.module.css";

export default function OffScreenLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    configureGsap();
    const section = sectionRef.current;
    const frames = frameRefs.current.filter((frame): frame is HTMLElement => frame !== null);
    const media = gsap.matchMedia();

    media.add("(min-width: 901px)", () => {
      const context = gsap.context(() => {
        frames.forEach((frame, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          const prominence = Number(frame.dataset.prominence ?? 0.7);
          const restingOpacity = Math.max(prominence - 0.05, 0.82);

          gsap.fromTo(frame, {
            "--memory-motion-scale": 0.96,
            "--memory-motion-x": `${direction * 18}px`,
            "--memory-motion-y": "38px",
            opacity: restingOpacity,
          }, {
            "--memory-motion-scale": 1.02,
            "--memory-motion-x": `${direction * -12}px`,
            "--memory-motion-y": "-30px",
            ease: "none",
            opacity: prominence,
            scrollTrigger: { end: "bottom 10%", scrub: true, start: "top 90%", trigger: frame },
          });
        });
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="off-screen-title" data-reduced-motion={reducedMotion}>
      <header className={styles.opening}>
        <p className={`${styles.index} type-meta`}>06 / OFF SCREEN</p>
        <h2 id="off-screen-title" className={styles.title}>FIELD NOTES<br />FROM ELSEWHERE</h2>
      </header>
      <MemoryJourneyDesktop frameRefs={frameRefs} />
      <MemoryJourneyMobile />
      <div className={styles.release} aria-hidden="true" />
    </section>
  );
}
