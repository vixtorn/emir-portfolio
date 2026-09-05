import styles from "./OutroSection.module.css";

export default function OutroSection() {
  return (
    <section id="contact" className={styles.outro} aria-labelledby="contact-title">
      <div className={styles.invitation}>
        <p className={`${styles.label} type-meta`}>09 / CONTACT</p>

        <div className={styles.invitationContent}>
          <h2 id="contact-title">
            SO...
            <br />
            MAKE SOMETHING?
          </h2>

          <p className={styles.supporting}>
            Product. Website. Weird WebGL thing.
            <br />
            I&apos;m listening.
          </p>
        </div>

        <nav className={styles.links} aria-label="Contact links">
          <a href="mailto:emirduman90@gmail.com">EMAIL</a>

          <a
            href="https://www.linkedin.com/in/emirtayfunduman/"
            target="_blank"
            rel="noreferrer"
          >
            LINKEDIN
          </a>

          <a
            href="https://github.com/vixtorn"
            target="_blank"
            rel="noreferrer"
          >
            GITHUB
          </a>
        </nav>
      </div>

      <div className={styles.finalFrame}>
        <p className={styles.name} aria-label="Emir Duman">
          EMIR
          <br />
          <em>DUMAN.</em>
        </p>
      </div>
    </section>
  );
}