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
    <section id={id} className={styles.section} aria-label={label}>
      <p className={styles.label}>{label}</p>
    </section>
  );
}
