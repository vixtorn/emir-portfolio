import Image from "next/image";
import Link from "next/link";

import CncSequencePreview from "./CncSequencePreview";
import styles from "./SelectedWorkSection.module.css";
import SneakerPreview from "./SneakerPreview";

const technologies = ["NEXT.JS", "WEBGL", "MOTION", "UI SYSTEMS"];
const neoDexTechnologies = ["NEXT.JS", "TYPESCRIPT", "REACT THREE FIBER", "THREE.JS"];
const sneakerTechnologies = ["NEXT.JS", "REACT THREE FIBER", "THREE.JS", "REAL-TIME MATERIALS"];
const diecastTechnologies = ["REACT THREE FIBER", "THREE.JS", "WEBGL"];

export default function SelectedWorkSection() {
  return (
    <section id="work" className={`${styles.section} surface-paper`} aria-labelledby="work-title">
      <div className={`${styles.container} portfolio-container`}>
        <header className={styles.sectionHeader}>
          <p className="type-meta">03 / SELECTED WORK</p>
          <p className={`${styles.projectCount} type-meta`}>01 / 04</p>
        </header>

        <div className={styles.composition} data-cnc-motion-showcase>
          <div className={styles.titleBlock}>
            <p className={`${styles.category} type-meta`}>INTERACTIVE SYSTEM / 2026</p>
            <h2 id="work-title" className={styles.title}>
              CNC <span>MOTION SHOWCASE</span>
            </h2>
          </div>

          <CncSequencePreview className={styles.media} />

          <div className={styles.details}>
            <p className={styles.description}>
              A kinetic product study translating industrial control language into a tactile digital
              interface.
            </p>
            <ul className={styles.technologyList} aria-label="Technologies used">
              {technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>

          <Link className={styles.caseStudyLink} href="/work/cnc-motion-showcase" aria-label="View CNC Motion Showcase case study">
            <span>VIEW CASE STUDY</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>

        <article className={styles.neoDexProject} aria-labelledby="neo-dex-title">
          <header className={styles.neoDexHeader}>
            <p className="type-meta">02 / DIGITAL PRODUCT</p>
            <p className={`${styles.projectCount} type-meta`}>02 / 04</p>
          </header>

          <div className={styles.neoDexComposition}>
            <div className={styles.neoDexMedia}>
              <Image
                src="/images/work/neodex/neodex-selected-work-v1.png"
                alt="NeoDex product showcase featuring creature exploration and comparison interfaces"
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 980px) 42vw, 58vw"
              />
            </div>

            <div className={styles.neoDexContent}>
              <p className={`${styles.neoDexCategory} type-meta`}>DIGITAL PRODUCT / 2026</p>
              <h2 id="neo-dex-title" className={styles.neoDexTitle}>
                NEO<span>DEX</span>
              </h2>
              <p className={styles.neoDexDescription}>
                A cinematic creature-exploration interface combining product thinking, interactive UI
                and spatial presentation.
              </p>
              <ul className={styles.neoDexTechnologyList} aria-label="Technologies used">
                {neoDexTechnologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>

            <Link className={styles.neoDexCaseStudyLink} href="/work/neodex" aria-label="View NeoDex case study">
              <span>VIEW CASE STUDY</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </article>

        <article className={styles.sneakerProject} aria-labelledby="sneaker-title">
          <header className={styles.sneakerHeader}>
            <p className="type-meta">03 / PRODUCT EXPERIENCE</p>
            <p className={`${styles.projectCount} type-meta`}>03 / 04</p>
          </header>

          <div className={styles.sneakerComposition}>
            <div className={styles.sneakerTitleBlock}>
              <p className={`${styles.sneakerCategory} type-meta`}>PRODUCT EXPERIENCE / 2026</p>
              <h2 id="sneaker-title" className={styles.sneakerTitle}>
                SNEAKER <span>CONFIGURATOR</span>
              </h2>
            </div>

            <SneakerPreview className={styles.sneakerMedia} />

            <div className={styles.sneakerContent}>
              <p className={styles.sneakerDescription}>
                An interactive product configurator exploring real-time material, color and detail
                customization in 3D.
              </p>
              <ul className={styles.sneakerTechnologyList} aria-label="Technologies used">
                {sneakerTechnologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>

            <a className={styles.sneakerCaseStudyLink} href="#work" aria-label="Sneaker Configurator case study coming soon">
              <span>VIEW CASE STUDY</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </article>

        <article className={styles.diecastProject} aria-labelledby="diecast-title">
          <div className={styles.diecastComposition}>
            <header className={styles.diecastHeader}>
              <p className="type-meta">04 / REAL-TIME AUTOMOTIVE</p>
              <p className="type-meta">04 / 04</p>
            </header>

            <div className={styles.diecastTitleBlock}>
              <p className={`${styles.diecastCategory} type-meta`}>REAL-TIME AUTOMOTIVE / 2026</p>
              <h2 id="diecast-title" className={styles.diecastTitle}>
                DIECAST
              </h2>
            </div>

            <figure className={styles.diecastScreenshot}>
              <Image
                src="/images/work/diecast/diecast-mainpage.png"
                alt="Diecast project collection of sixteen collectible vehicles"
                width={851}
                height={728}
                sizes="(max-width: 980px) 67vw, 61vw"
                unoptimized
              />
              <figcaption className="type-meta">COLLECTION VIEW / 04</figcaption>
            </figure>
            <div className={styles.diecastCopy}>
              <p className={styles.diecastDescription}>
                A real-time automotive study exploring cinematic composition, motion and interactive 3D
                presentation.
              </p>

              <ul className={styles.diecastTechnologyList} aria-label="Technologies used">
                {diecastTechnologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>

              <a className={styles.diecastCaseStudyLink} href="#work" aria-label="Diecast case study coming soon">
                <span>VIEW CASE STUDY</span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
