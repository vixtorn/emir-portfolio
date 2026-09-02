"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import ManifestoV2Desktop from "./ManifestoV2Desktop";
import ManifestoV2Mobile from "./ManifestoV2Mobile";
import DecryptedText from "./motion/DecryptedText";
import styles from "./ManifestoV2.module.css";

export default function ManifestoV2Lab() {
  const reducedMotion = useReducedMotion();
  return (
    <section className={styles.manifesto} data-reduced-motion={reducedMotion}>
      <header className={styles.chapterBeat}>
        <span className={styles.chapterUtility}>02 /</span>
        <span className={styles.chapterWord}><DecryptedText text="MANIFESTO" initialText="M_N_F_ST_" speed={120} /></span>
      </header>
      <ManifestoV2Desktop reducedMotion={reducedMotion} />
      <ManifestoV2Mobile />
    </section>
  );
}
