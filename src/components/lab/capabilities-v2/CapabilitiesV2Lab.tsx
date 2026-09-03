"use client";

import { useLayoutEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { configureGsap, gsap } from "@/lib/motion/gsap";

import CapabilityGroup from "./CapabilityGroup";
import { capabilityGroups } from "./capabilities-v2-data";
import styles from "./CapabilitiesV2Lab.module.css";

export default function CapabilitiesV2Lab() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (reducedMotion || !root) return;

    configureGsap();
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 72%", once: true } });
      timeline.from(`.${styles.chapter}`, { opacity: 0, y: 8, duration: 0.35, ease: "power2.out" });
      timeline.from(`.${styles.group}`, { opacity: 0, y: 16, duration: 0.42, stagger: 0.1, ease: "power2.out" }, "<0.08");
      timeline.from(`.${styles.group} li`, { opacity: 0, y: 6, duration: 0.24, stagger: 0.035, ease: "power2.out" }, "<0.06");
    }, root);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <main ref={rootRef} className={styles.capabilities} data-reduced-motion={reducedMotion}>
      <section className={styles.inner} aria-labelledby="capabilities-v2-title">
        <header className={styles.chapter}>
          <h1 id="capabilities-v2-title">07 / CAPABILITIES</h1>
          <span aria-hidden="true" />
        </header>
        <div className={styles.groups}>
          {capabilityGroups.map((group) => <CapabilityGroup key={group.id} group={group} />)}
        </div>
      </section>
    </main>
  );
}
