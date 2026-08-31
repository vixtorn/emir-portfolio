import Image from "next/image";
import Link from "next/link";

import type { CaseStudy } from "@/data/caseStudies";

import styles from "./CaseStudyTemplate.module.css";

type CaseStudyTemplateProps = {
  caseStudy: CaseStudy;
};

function SectionHeading({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <header className={styles.sectionHeading}>
      <p className="type-meta">{index}</p>
      <h2>{children}</h2>
    </header>
  );
}

export default function CaseStudyTemplate({ caseStudy }: CaseStudyTemplateProps) {
  const { heroMedia } = caseStudy;

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="case-study-title">
        <div className={`${styles.container} portfolio-container`}>
          <Link className={styles.backLink} href="/#work">← BACK TO SELECTED WORK</Link>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={`${styles.eyebrow} type-meta`}>{caseStudy.index} / {caseStudy.category}</p>
              <h1 id="case-study-title">{caseStudy.title}</h1>
              <p className={styles.oneLiner}>{caseStudy.oneLiner}</p>
              <div className={styles.heroActions}>
                {caseStudy.liveUrl && <a href={caseStudy.liveUrl} target="_blank" rel="noreferrer">LIVE EXPERIENCE ↗</a>}
                {caseStudy.sourceUrl && <a href={caseStudy.sourceUrl} target="_blank" rel="noreferrer">VIEW SOURCE ↗</a>}
              </div>
            </div>
            {heroMedia && (
              <figure className={styles.heroMedia}>
                <Image src={heroMedia.src} alt={heroMedia.alt} width={heroMedia.width} height={heroMedia.height} priority sizes="(max-width: 860px) 100vw, 58vw" />
              </figure>
            )}
          </div>
        </div>
      </section>

      <section className={`${styles.paperSection} ${styles.introSection}`}>
        <div className={`${styles.container} portfolio-container`}>
          {caseStudy.personalNote && (
            <aside className={styles.personalNote} aria-label="Personal note">
              <p className="type-meta">{caseStudy.personalNote.eyebrow}</p>
              {caseStudy.personalNote.body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </aside>
          )}
          <div className={styles.snapshot}>
            <div>
              <p className="type-meta">ROLE</p>
              <p>{caseStudy.role}</p>
            </div>
            <div>
              <p className="type-meta">FOCUS</p>
              <ul>{caseStudy.focus?.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.paperSection}>
        <div className={`${styles.container} ${styles.proseLayout} portfolio-container`}>
          <SectionHeading index="03 / WHY I BUILT IT">A familiar world, treated like a product.</SectionHeading>
          <div className={styles.prose}>{caseStudy.whyIBuiltIt?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>

      {caseStudy.challenge && (
        <section className={`${styles.darkSection} ${styles.challengeSection}`}>
          <div className={`${styles.container} ${styles.challengeLayout} portfolio-container`}>
            <SectionHeading index="04 / THE CHALLENGE">Keep expression from getting in the way.</SectionHeading>
            <div>
              {caseStudy.challenge.intro && <p className={styles.challengeIntro}>{caseStudy.challenge.intro}</p>}
              <ul className={styles.challengeList}>{caseStudy.challenge.points?.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
          </div>
        </section>
      )}

      {caseStudy.experience && (
        <section className={styles.paperSection}>
          <div className={`${styles.container} portfolio-container`}>
            <SectionHeading index="05 / THE EXPERIENCE">Five modes, one product language.</SectionHeading>
            <div className={styles.experienceGrid}>{caseStudy.experience.map((item, index) => (
              <article key={item.title} className={styles.experienceItem}>
                <p className="type-meta">0{index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}</div>
          </div>
        </section>
      )}

      {caseStudy.decisions && (
        <section className={`${styles.paperSection} ${styles.decisionsSection}`}>
          <div className={`${styles.container} portfolio-container`}>
            <SectionHeading index="06 / KEY DECISIONS">Product decisions with technical consequences.</SectionHeading>
            <div className={styles.decisionList}>{caseStudy.decisions.map((item) => (
              <article key={item.title} className={styles.decisionItem}>
                <p className="type-meta">{item.title}</p>
                <h3>{item.decision}</h3>
                <div>
                  <p><span>WHY</span>{item.reason}</p>
                  {item.tradeoff && <p><span>TRADE-OFF</span>{item.tradeoff}</p>}
                </div>
              </article>
            ))}</div>
          </div>
        </section>
      )}

      <section className={styles.darkSection}>
        <div className={`${styles.container} ${styles.engineeringLayout} portfolio-container`}>
          <SectionHeading index="07 / UNDER THE HOOD">Architecture in service of the experience.</SectionHeading>
          <div>
            <div className={styles.flow} aria-label="NeoDex architecture flow">
              <span>PokeAPI</span><i>↓</i><span>Typed data layer</span><i>↓</i><span>Explore / Detail / Compare / Team</span><i>↓</i><span>Type-driven UI system</span>
            </div>
            <div className={styles.engineeringList}>{caseStudy.engineering?.map((item) => (
              <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>
            ))}</div>
          </div>
        </div>
      </section>

      {caseStudy.techStack && (
        <section className={`${styles.paperSection} ${styles.techSection}`}>
          <div className={`${styles.container} portfolio-container`}>
            <SectionHeading index="08 / THE TOOLKIT">Choices that make the product work.</SectionHeading>
            <ul className={styles.techList}>{caseStudy.techStack.map((item) => <li key={item.name}><strong>{item.name}</strong><span>{item.reason}</span></li>)}</ul>
          </div>
        </section>
      )}

      {caseStudy.iterations && (
        <section className={`${styles.paperSection} ${styles.iterationSection}`}>
          <div className={`${styles.container} portfolio-container`}>
            <SectionHeading index="09 / WHAT CHANGED">A working interface and a well-art-directed interface are not the same thing.</SectionHeading>
            {caseStudy.iterations.map((item) => (
              <article key={item.before} className={styles.iterationItem}>
                <p className="type-meta">{item.before}</p>
                <div><h3>Visual review</h3><p>{item.problem}</p></div>
                <div><h3>Presentation decision</h3><p>{item.decision}</p></div>
                <div><h3>Result</h3><p>{item.result}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.paperSection}>
        <div className={`${styles.container} ${styles.learningLayout} portfolio-container`}>
          <SectionHeading index="10 / WHAT I LEARNED">Take the product seriously. Take the presentation seriously too.</SectionHeading>
          <ul>{caseStudy.learnings?.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      {caseStudy.credits && (
        <section className={styles.creditsSection}>
          <div className={`${styles.container} portfolio-container`}>
            <SectionHeading index="11 / CREDITS + REALITY CHECK">A fan-made study, presented honestly.</SectionHeading>
            <div className={styles.creditsList}>{caseStudy.credits.map((item) => (
              <p key={item.label}><span>{item.label}</span>{item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.detail} ↗</a> : item.detail}</p>
            ))}</div>
          </div>
        </section>
      )}

      <footer className={styles.outro}>
        <div className={`${styles.container} portfolio-container`}>
          <p className="type-meta">12 / BACK TO WORK</p>
          <Link href="/#work">BACK TO SELECTED WORK <span>↗</span></Link>
        </div>
      </footer>
    </main>
  );
}
