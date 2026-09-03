import type { CapabilityGroup as CapabilityGroupData } from "./capabilities-v2-data";
import styles from "./CapabilitiesV2Lab.module.css";

export default function CapabilityGroup({ group }: { group: CapabilityGroupData }) {
  const headingId = `capability-v2-${group.id}`;

  return (
    <section className={`${styles.group} ${styles[group.id]}`} aria-labelledby={headingId}>
      <p className={styles.groupIndex}>{group.index}</p>
      <h2 id={headingId}>{group.label}</h2>
      <ul>
        {group.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
