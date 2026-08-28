import styles from "./SelectedWorkSection.module.css";

const technologies = ["NEXT.JS", "WEBGL", "MOTION", "UI SYSTEMS"];
const neoDexTechnologies = ["NEXT.JS", "TYPESCRIPT", "REACT THREE FIBER", "THREE.JS"];

function CncMediaPlaceholder() {
  return (
    <div
      className={styles.media}
      role="img"
      aria-label="Abstract technical media placeholder for CNC Motion Showcase"
    >
      <div className={styles.mediaHeader}>
        <span>MEDIA SLOT / 01</span>
        <span>AXIS / X-Y-Z</span>
      </div>
      <div className={styles.mediaGrid} aria-hidden="true" />
      <div className={styles.toolpath} aria-hidden="true">
        <span className={styles.toolpathPoint} />
      </div>
      <div className={styles.crosshair} aria-hidden="true">
        <span />
        <span />
      </div>
      <div className={styles.mediaReadout}>
        <span>CNC SYSTEM / PREVIEW</span>
        <span>REAL-TIME STUDY</span>
      </div>
    </div>
  );
}

function NeoDexMediaPlaceholder() {
  return (
    <div
      className={styles.neoDexMedia}
      role="img"
      aria-label="Abstract catalogue media placeholder for NeoDex"
    >
      <div className={styles.neoDexMediaHeader}>
        <span>DEX INDEX / 002</span>
        <span>FILTER STATE / ACTIVE</span>
      </div>
      <div className={styles.neoDexRail} aria-hidden="true">
        <span>GEN / INDEX</span>
        <span>002</span>
      </div>
      <div className={styles.neoDexSpecimen} aria-hidden="true">
        <span className={styles.neoDexSpecimenInner} />
      </div>
      <div className={styles.neoDexMediaFooter}>
        <span>SPECIMEN VIEW</span>
        <span>INTERFACE PREVIEW</span>
      </div>
    </div>
  );
}

export default function SelectedWorkSection() {
  return (
    <section id="work" className={`${styles.section} surface-paper`} aria-labelledby="work-title">
      <div className={`${styles.container} portfolio-container`}>
        <header className={styles.sectionHeader}>
          <p className="type-meta">03 / SELECTED WORK</p>
          <p className={`${styles.projectCount} type-meta`}>01 / 04</p>
        </header>

        <div className={styles.composition}>
          <div className={styles.titleBlock}>
            <p className={`${styles.category} type-meta`}>INTERACTIVE SYSTEM / 2026</p>
            <h2 id="work-title" className={styles.title}>
              CNC <span>MOTION SHOWCASE</span>
            </h2>
          </div>

          <CncMediaPlaceholder />

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

          <a className={styles.caseStudyLink} href="#work" aria-label="CNC Motion Showcase case study coming soon">
            <span>VIEW CASE STUDY</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <article className={styles.neoDexProject} aria-labelledby="neo-dex-title">
          <header className={styles.neoDexHeader}>
            <p className="type-meta">02 / DIGITAL PRODUCT</p>
            <p className={`${styles.projectCount} type-meta`}>02 / 04</p>
          </header>

          <div className={styles.neoDexComposition}>
            <NeoDexMediaPlaceholder />

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

            <a className={styles.neoDexCaseStudyLink} href="#work" aria-label="NeoDex case study coming soon">
              <span>VIEW CASE STUDY</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
