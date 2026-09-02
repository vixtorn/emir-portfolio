"use client";

import { useLayoutEffect, useRef } from "react";

import { configureGsap, gsap } from "@/lib/motion/gsap";

import ScrollReveal from "./motion/ScrollReveal";
import ScrollVelocityPunctuation from "./motion/ScrollVelocityPunctuation";
import styles from "./ManifestoV2.module.css";

type Props = {
  reducedMotion: boolean;
};

export default function ManifestoV2Transition({
  reducedMotion,
}: Props) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const darkFieldRef = useRef<HTMLDivElement>(null);
  const paperFieldRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const darkField = darkFieldRef.current;
    const paperField = paperFieldRef.current;

    if (
      reducedMotion ||
      !track ||
      !stage ||
      !darkField ||
      !paperField
    ) {
      return;
    }

    configureGsap();

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // 1. Dark layer slowly recedes.
      timeline.to(
        darkField,
        {
          opacity: 0,
          duration: 0.18,
          ease: "none",
        },
        0.2
      );

      // 2. The SAME full-screen stage slowly changes
      // from near-black to the portfolio paper color.
      timeline.to(
        stage,
        {
          backgroundColor: "#f1eee7",
          duration: 0.62,
          ease: "none",
        },
        0.2
      );

      // 3. Paper content enters only near the end
      // of the surface transition.
      timeline.fromTo(
        paperField,
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "none",
        },
        0.76
      );
    }, track);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={trackRef}
      className={styles.transitionTrack}
    >
      <section
        ref={stageRef}
        className={styles.transitionStage}
      >
        <div
          ref={darkFieldRef}
          className={styles.transitionDarkField}
          aria-hidden="true"
        />

        <div
          ref={paperFieldRef}
          className={styles.transitionPaperField}
        >
          <ScrollReveal>
            I move between design, development, 3D, product thinking and
            visual experimentation — mostly because choosing only one
            sounded boring.
          </ScrollReveal>

          <ScrollVelocityPunctuation
            className={`${styles.exit} type-meta`}
          >
            DESIGN × CODE × PRODUCT × 3D × PLAY ×
          </ScrollVelocityPunctuation>
        </div>
      </section>
    </section>
  );
}