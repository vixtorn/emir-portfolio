import styles from "./SelectedWorkSection.module.css";

const technologies = ["NEXT.JS", "WEBGL", "MOTION", "UI SYSTEMS"];

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
      </div>
    </section>
  );
}
