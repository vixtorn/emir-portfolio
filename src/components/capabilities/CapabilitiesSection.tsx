"use client";

import { useLayoutEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { configureGsap, gsap } from "@/lib/motion/gsap";

import CapabilityGroup from "./CapabilityGroup";
import { capabilityGroups } from "./capabilities-data";
import styles from "./CapabilitiesSection.module.css";

export default function CapabilitiesSection() {
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
    <section id="capabilities" ref={rootRef} className={styles.capabilities} data-reduced-motion={reducedMotion} aria-labelledby="capabilities-title">
      <div className={styles.inner}>
        <header className={styles.chapter}>
          <h1 id="capabilities-title">07 / CAPABILITIES</h1>
          <span aria-hidden="true" />
        </header>
        <div className={styles.groups}>
          {capabilityGroups.map((group) => <CapabilityGroup key={group.id} group={group} />)}
        </div>
      </div>
    </section>
  );
}
