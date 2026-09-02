"use client";

import { useLayoutEffect, useRef } from "react";

import { configureGsap, ScrollTrigger } from "@/lib/motion/gsap";

import ScrollFloat from "./motion/ScrollFloat";
import ScrollReveal from "./motion/ScrollReveal";
import ScrollVelocityPunctuation from "./motion/ScrollVelocityPunctuation";
import VerticalCutReveal, { type VerticalCutRevealHandle } from "./motion/VerticalCutReveal";
import styles from "./ManifestoV2.module.css";

type Props = { reducedMotion: boolean };

const statementOne = "I DON'T JUST BUILD INTERFACES.";
const statementTwo = "I BUILD THE FEELING AROUND THEM.";

export default function ManifestoV2Desktop({ reducedMotion }: Props) {
  const statementOneRef = useRef<VerticalCutRevealHandle>(null);
  const statementTwoRef = useRef<VerticalCutRevealHandle>(null);
  const principleDesignRef = useRef<VerticalCutRevealHandle>(null);
  const principleCodeRef = useRef<VerticalCutRevealHandle>(null);
  const principleProductsRef = useRef<VerticalCutRevealHandle>(null);
  const statementOneBeat = useRef<HTMLElement>(null);
  const statementTwoBeat = useRef<HTMLElement>(null);
  const principleDesignBeat = useRef<HTMLElement>(null);
  const principleCodeBeat = useRef<HTMLElement>(null);
  const principleProductsBeat = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    configureGsap();
    const triggers = [
      statementOneBeat.current && ScrollTrigger.create({ trigger: statementOneBeat.current, start: "top 62%", onEnter: () => statementOneRef.current?.startAnimation(), onLeaveBack: () => statementOneRef.current?.reset() }),
      statementTwoBeat.current && ScrollTrigger.create({ trigger: statementTwoBeat.current, start: "top 61%", onEnter: () => statementTwoRef.current?.startAnimation(), onLeaveBack: () => statementTwoRef.current?.reset() }),
      principleDesignBeat.current && ScrollTrigger.create({ trigger: principleDesignBeat.current, start: "top 64%", onEnter: () => principleDesignRef.current?.startAnimation(), onLeaveBack: () => principleDesignRef.current?.reset() }),
      principleCodeBeat.current && ScrollTrigger.create({ trigger: principleCodeBeat.current, start: "top 64%", onEnter: () => principleCodeRef.current?.startAnimation(), onLeaveBack: () => principleCodeRef.current?.reset() }),
      principleProductsBeat.current && ScrollTrigger.create({ trigger: principleProductsBeat.current, start: "top 64%", onEnter: () => principleProductsRef.current?.startAnimation(), onLeaveBack: () => principleProductsRef.current?.reset() }),
    ].filter((trigger): trigger is ScrollTrigger => Boolean(trigger));

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [reducedMotion]);

  return (
    <div className={styles.desktopFlow}>
      <section ref={statementOneBeat} className={`${styles.beat} ${styles.statementBeatOne}`}>
        <div className={styles.beatInner}>
          <ScrollFloat className={styles.statementOneFloat}>
            <VerticalCutReveal ref={statementOneRef} text={statementOne} splitBy="characters" staggerDuration={0.068} staggerFrom="first" spring={{ stiffness: 106, damping: 25 }} className={styles.statementOne} />
          </ScrollFloat>
        </div>
      </section>
      <section ref={statementTwoBeat} className={`${styles.beat} ${styles.statementBeatTwo}`}>
        <div className={styles.beatInner}>
          <ScrollFloat className={styles.statementTwoFloat} strength="strong">
            <VerticalCutReveal ref={statementTwoRef} text={statementTwo} splitBy="characters" staggerDuration={0.086} staggerFrom="center" spring={{ stiffness: 102, damping: 25 }} className={styles.statementTwo} wordClassName={(word) => word === "FEELING" ? styles.feeling : undefined} />
          </ScrollFloat>
        </div>
      </section>
      <section ref={principleDesignBeat} className={`${styles.principleBeat} ${styles.principleDesignBeat}`}><VerticalCutReveal ref={principleDesignRef} text="DESIGN SHOULD MOVE." splitBy="words" staggerDuration={0.26} staggerFrom="first" spring={{ stiffness: 110, damping: 25 }} className={`${styles.principle} ${styles.principleDesign}`} /></section>
      <section ref={principleCodeBeat} className={`${styles.principleBeat} ${styles.principleCodeBeat}`}><VerticalCutReveal ref={principleCodeRef} text="CODE SHOULD HAVE PERSONALITY." splitBy="words" staggerDuration={0.26} staggerFrom="center" spring={{ stiffness: 110, damping: 25 }} className={`${styles.principle} ${styles.principleCode}`} /></section>
      <section ref={principleProductsBeat} className={`${styles.principleBeat} ${styles.principleProductsBeat}`}><VerticalCutReveal ref={principleProductsRef} text="PRODUCTS SHOULD FEEL HUMAN." splitBy="words" staggerDuration={0.26} staggerFrom="last" spring={{ stiffness: 110, damping: 25 }} className={`${styles.principle} ${styles.principleProducts}`} /></section>
      <section className={styles.paperBeat}>
        <ScrollReveal>I move between design, development, 3D, product thinking and visual experimentation — mostly because choosing only one sounded boring.</ScrollReveal>
        <ScrollVelocityPunctuation className={`${styles.exit} type-meta`}>DESIGN × CODE × PRODUCT × 3D × PLAY ×</ScrollVelocityPunctuation>
      </section>
    </div>
  );
}
