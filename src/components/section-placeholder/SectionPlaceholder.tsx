import styles from "./SectionPlaceholder.module.css";

type SectionPlaceholderProps = {
  id: string;
  label: string;
};

export default function SectionPlaceholder({
  id,
  label,
}: SectionPlaceholderProps) {
  return (
    <section
      id={id}
      className={`${styles.section} portfolio-section surface-paper`}
      aria-label={label}
    >
      <div className="portfolio-container">
        <p className={`${styles.label} type-meta`}>{label}</p>
      </div>
    </section>
  );
}
