import SignpostExperience from "./SignpostExperience";
import styles from "./SignpostSection.module.css";

export default function SignpostSection() {
  return (
    <section id="signpost" className={styles.section} aria-label="Signpost">
      <SignpostExperience />
    </section>
  );
}
