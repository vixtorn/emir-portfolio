"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import styles from "./AboutLab.module.css";

const biography = [
  "Computer Engineering taught me to respect how things work: systems, constraints, the satisfying moment something finally holds together. Building software then changed the question. I started caring just as much about the feeling of an interface—why one decision felt inevitable and another merely functioned.",
  "That curiosity led to visual design, Photoshop, then Blender. Creative development became the practical place for all of it; product thinking made the work ask a little more of itself: who is this for, what earns attention, and what should stay simple?",
  "The engineering never left. It is the structure underneath the visual instinct—and the reason the experiments can survive contact with reality.",
];

export default function AboutLab() {
  const reducedMotion = useReducedMotion();
  const [disrupted, setDisrupted] = useState(false);
  const words = useMemo(() => biography.join(" ").split(" "), []);
  const canDisrupt = !reducedMotion;

  return (
    <section className={styles.section} aria-labelledby="about-title" data-disrupted={disrupted} data-reduced-motion={reducedMotion}>
      <header className={styles.header}>
        <p className="type-meta">08 / ABOUT</p>
      </header>

      <div className={styles.desktopComposition}>
        <figure className={`${styles.object} ${styles.portrait}`}>
          <Image alt="Emir Duman outside a McDonald's restaurant" height={1082} priority sizes="(max-width: 900px) 84vw, 25vw" src="/images/about/about-emir-mcdonalds.jpg" width={806} />
        </figure>

        <div className={`${styles.object} ${styles.foundation}`}>
          <span>COMPUTER ENGINEERING</span>
          <strong>THE FOUNDATION<br />STAYED.</strong>
          <i aria-hidden="true" />
        </div>

        <figure className={`${styles.object} ${styles.designArtifact}`}>
          <Image alt="Blender material study from Emir's Sneaker Configurator project" height={888} sizes="(max-width: 900px) 64vw, 20vw" src="/images/work/solelab/blender-pbr-material-nodes.png" width={1133} />
          <figcaption>BLENDER MATERIAL STUDY</figcaption>
        </figure>

        <div className={styles.storyColumn}>
          <div className={styles.headlineBlock}>
            <h1 id="about-title">ENGINEERING WAS THE START.<br /><em>NOT THE DESTINATION.</em></h1>
          </div>

          <div className={styles.readingCluster}>
            <div className={styles.biographyBlock}>
              <p className={styles.semanticCopy}>{biography.join(" ")}</p>
              <p className={styles.visualCopy} aria-hidden="true">
                {words.map((word, index) => <span key={`${word}-${index}`} style={{ "--word-x": `${(index % 5 - 2) * 5}px`, "--word-y": `${(index % 4 - 1.5) * 6}px`, "--word-r": `${(index % 7 - 3) * 1.6}deg` } as CSSProperties}>{word}&nbsp;</span>)}
              </p>
              <button className={styles.readControl} disabled={!canDisrupt} type="button" onClick={() => setDisrupted((value) => !value)}>
                {canDisrupt ? disrupted ? "PUT IT BACK." : "CAN'T YOU READ? ↗" : "READABLE BY DEFAULT"}
              </button>
            </div>

            <div className={styles.emirInside} aria-label="Emir Inside trademark">
              <span>EMIR</span>
              <strong>INSIDE<sup>™</sup></strong>
            </div>
          </div>
        </div>

        <p className={styles.closing}>Build it carefully.<br />Make it worth touching.</p>
      </div>
    </section>
  );
}
