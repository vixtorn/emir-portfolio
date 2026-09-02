"use client";

import { useLayoutEffect, useRef } from "react";

import { configureGsap, gsap } from "@/lib/motion/gsap";

import ManifestoChapter from "./ManifestoChapter";
import ManifestoStatement from "./ManifestoStatement";
import styles from "./ManifestoLab.module.css";

type ManifestoDesktopProps = {
  reducedMotion: boolean;
};

export default function ManifestoDesktop({ reducedMotion }: ManifestoDesktopProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const statementOneRef = useRef<HTMLElement>(null);
  const statementTwoRef = useRef<HTMLElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion || !trackRef.current || !stageRef.current) return;

    configureGsap();
    const track = trackRef.current;
    const stage = stageRef.current;
    const statementOne = statementOneRef.current;
    const statementTwo = statementTwoRef.current;
    const darkField = stage.querySelector<HTMLElement>("[data-dark-field]");
    const principles = principlesRef.current?.querySelectorAll<HTMLElement>("[data-principle]");
    const paper = paperRef.current;
    const exit = exitRef.current;
    const media = gsap.matchMedia();

    media.add("(min-width: 901px)", () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            end: "bottom bottom",
            scrub: true,
            start: "top top",
            trigger: track,
            onUpdate: (trigger) => {
              if (!exit) return;

              const offset = Math.max(-36, Math.min(36, trigger.getVelocity() * 0.012));
              gsap.to(exit, { duration: 0.35, ease: "power2.out", overwrite: true, x: offset });
            },
          },
        });

        const statementOneLine = statementOne?.querySelector("span");
        const statementTwoLine = statementTwo?.querySelector("span");
        const principleLines = Array.from(principles ?? [])
          .map((principle) => principle.querySelector("span"))
          .filter((line): line is HTMLSpanElement => line !== null);
        const revealLines = [statementOneLine, statementTwoLine, ...principleLines]
          .filter((line): line is HTMLSpanElement => line !== null);

        timeline.set(revealLines, { scale: 0.96, yPercent: 108 }, 0);

        if (statementOne && statementOneLine) {
          timeline.to(statementOneLine, { duration: 0.12, ease: "none", scale: 1, yPercent: 0 }, 0.1);
          timeline.to(statementOne, { duration: 0.1, ease: "none", opacity: 0.16, yPercent: -7 }, 0.34);
        }

        if (statementTwo && statementTwoLine) {
          timeline.to(statementTwoLine, { duration: 0.12, ease: "none", scale: 1, yPercent: 0 }, 0.34);
          timeline.to(statementTwo, { duration: 0.1, ease: "none", opacity: 0.16, yPercent: -5 }, 0.61);
        }

        principles?.forEach((principle, index) => {
          const line = principle.querySelector("span");
          const revealAt = 0.58 + index * 0.09;

          if (line) {
            timeline.to(line, { duration: 0.1, ease: "none", scale: 1, yPercent: 0 }, revealAt);
          }

          timeline.fromTo(principle, { opacity: 0.2 }, { duration: 0.1, ease: "none", opacity: 1 }, revealAt);
        });

        timeline.to(darkField, { duration: 0.08, ease: "none", opacity: 0 }, 0.88);
        timeline.to(stage, { backgroundColor: "#f1eee7", duration: 0.1, ease: "none" }, 0.88);

        if (paper) {
          timeline.fromTo(paper, { opacity: 0, y: 22 }, { duration: 0.13, ease: "none", opacity: 1, y: 0 }, 0.95);
        }
      }, track);

      return () => context.revert();
    });

    return () => media.revert();
  }, [reducedMotion]);

  return (
    <div ref={trackRef} className={styles.desktopTrack}>
      <section ref={stageRef} className={styles.desktopStage} aria-labelledby="manifesto-title">
        <h1 id="manifesto-title" className={styles.srOnly}>Manifesto</h1>
        <div className={styles.darkField} data-dark-field>
          <header className={styles.chapter}>
            <ManifestoChapter reducedMotion={reducedMotion} />
          </header>
          <ManifestoStatement ref={statementOneRef} className={styles.statementOne} heading="h2">
            I DON&apos;T JUST BUILD INTERFACES.
          </ManifestoStatement>
          <ManifestoStatement ref={statementTwoRef} className={styles.statementTwo} heading="h2">
            I BUILD THE <em>FEELING</em> AROUND THEM.
          </ManifestoStatement>
          <div ref={principlesRef} className={styles.principles}>
            <ManifestoStatement className={styles.principleOne} data-principle>
              DESIGN SHOULD MOVE.
            </ManifestoStatement>
            <ManifestoStatement className={styles.principleTwo} data-principle>
              CODE SHOULD HAVE PERSONALITY.
            </ManifestoStatement>
            <ManifestoStatement className={styles.principleThree} data-principle>
              PRODUCTS SHOULD FEEL HUMAN.
            </ManifestoStatement>
          </div>
        </div>
        <div ref={paperRef} className={styles.paperField}>
          <p className={styles.supporting}>
            I move between design, development, 3D, product thinking and visual experimentation — mostly because choosing only one sounded boring.
          </p>
          <p ref={exitRef} className={`${styles.exit} type-meta`}>
            DESIGN × CODE × PRODUCT × 3D × PLAY ×
          </p>
        </div>
      </section>
    </div>
  );
}
