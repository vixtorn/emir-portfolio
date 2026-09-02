import styles from "./ManifestoLab.module.css";

export default function ManifestoMobile() {
  return (
    <section className={styles.mobileFlow} aria-labelledby="manifesto-mobile-title">
      <header>
        <p className="type-meta">02 / MANIFESTO</p>
        <h1 id="manifesto-mobile-title">I DON&apos;T JUST BUILD INTERFACES.</h1>
      </header>
      <h2>I BUILD THE <em>FEELING</em> AROUND THEM.</h2>
      <div className={styles.mobilePrinciples}>
        <p>DESIGN SHOULD MOVE.</p>
        <p>CODE SHOULD HAVE PERSONALITY.</p>
        <p>PRODUCTS SHOULD FEEL HUMAN.</p>
      </div>
      <div className={styles.mobilePaper}>
        <p>
          I move between design, development, 3D, product thinking and visual experimentation — mostly because choosing only one sounded boring.
        </p>
        <p className="type-meta">DESIGN × CODE × PRODUCT × 3D × PLAY ×</p>
      </div>
    </section>
  );
}
