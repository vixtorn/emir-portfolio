import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./LabShell.module.css";

type LabShellProps = {
  number: string;
  title: string;
  purpose: string;
  children?: ReactNode;
  showBackLink?: boolean;
};

export default function LabShell({
  number,
  title,
  purpose,
  children,
  showBackLink = true,
}: LabShellProps) {
  return (
    <main className={styles.lab}>
      <header className={styles.header}>
        <p className="type-meta">EXPERIMENT {number}</p>
        <h1 className="type-heading">{title}</h1>
        <p className={`${styles.purpose} type-body`}>{purpose}</p>
      </header>

      <section
        className={styles.workspace}
        aria-label={`${title} experiment workspace`}
      >
        {children ?? <p className="type-micro">WORKSPACE RESERVED</p>}
      </section>

      {showBackLink ? (
        <nav className={styles.footer} aria-label="Interaction Lab navigation">
          <Link className="type-meta" href="/__lab">
            ← LAB DIRECTORY
          </Link>
        </nav>
      ) : null}
    </main>
  );
}
