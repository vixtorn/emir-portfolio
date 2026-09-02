"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import ManifestoDesktop from "./ManifestoDesktop";
import ManifestoMobile from "./ManifestoMobile";
import styles from "./ManifestoLab.module.css";

export default function ManifestoLab() {
  const reducedMotion = useReducedMotion();

  return (
    <section className={styles.manifesto} data-reduced-motion={reducedMotion}>
      <ManifestoDesktop reducedMotion={reducedMotion} />
      <ManifestoMobile />
    </section>
  );
}
