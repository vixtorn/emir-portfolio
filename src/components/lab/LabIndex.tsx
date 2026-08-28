import Link from "next/link";

import styles from "./LabIndex.module.css";

const experiments = [
  { number: "01", href: "/__lab/playground-can", label: "PLAYGROUND CAN" },
  { number: "02", href: "/__lab/sticker-system", label: "STICKER SYSTEM" },
  { number: "03", href: "/__lab/scratch", label: "SCRATCH" },
  { number: "04", href: "/__lab/work-stack", label: "WORK STACK" },
  { number: "05", href: "/__lab/memory", label: "MEMORY" },
  { number: "06", href: "/__lab/signpost", label: "SIGNPOST" },
  { number: "07", href: "/__lab/terminal", label: "PLAYGROUND TERMINAL" },
  { number: "08", href: "/__lab/tamagotchi", label: "PLAYGROUND TAMAGOTCHI" },
  { number: "09", href: "/__lab/keychain", label: "PLAYGROUND KEYCHAIN" },
  { number: "10", href: "/__lab/diecast", label: "PLAYGROUND DIE-CAST" },
];

export default function LabIndex() {
  return (
    <main className={styles.index}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className="type-meta">INTERNAL / DEVELOPMENT</p>
          <h1 className="type-heading">INTERACTION LAB</h1>
        </header>

        <nav aria-label="Interaction Lab experiments">
          <ol className={styles.list}>
            {experiments.map((experiment) => (
              <li key={experiment.href}>
                <Link className={styles.link} href={experiment.href}>
                  <span className="type-meta">{experiment.number}</span>
                  <span className="type-meta">{experiment.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </main>
  );
}
