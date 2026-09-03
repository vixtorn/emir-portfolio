"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import ManifestoDesktop from "./ManifestoDesktop";
import ManifestoMobile from "./ManifestoMobile";
import DecryptedText from "./motion/DecryptedText";
import styles from "./ManifestoSection.module.css";

export default function ManifestoSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="manifesto" className={styles.manifesto} data-reduced-motion={reducedMotion}>
      <header className={styles.chapterBeat}>
        <span className={styles.chapterUtility}>02 /</span>
        <span className={styles.chapterWord}><DecryptedText text="MANIFESTO" initialText="M_N_F_ST_" speed={120} /></span>
      </header>
      <ManifestoDesktop reducedMotion={reducedMotion} />
      <ManifestoMobile />
    </section>
  );
}
