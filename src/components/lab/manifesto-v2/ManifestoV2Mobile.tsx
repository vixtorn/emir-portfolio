import styles from "./ManifestoV2.module.css";

export default function ManifestoV2Mobile() {
  return <section className={styles.mobileFlow}>
    <h1>I DON&apos;T JUST BUILD INTERFACES.</h1>
    <h2>I BUILD THE <em>FEELING</em> AROUND THEM.</h2>
    <p>DESIGN SHOULD MOVE.</p>
    <p>CODE SHOULD HAVE PERSONALITY.</p>
    <p>PRODUCTS SHOULD FEEL HUMAN.</p>
    <div className={styles.mobilePaper}><p>I move between design, development, 3D, product thinking and visual experimentation — mostly because choosing only one sounded boring.</p><p className="type-meta">DESIGN × CODE × PRODUCT × 3D × PLAY ×</p></div>
  </section>;
}
