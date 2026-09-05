const links = [
  { label: "Work", href: "#work" },
  { label: "Playground", href: "#playground" },
  { label: "About", href: "#about" },
];

export default function HeroHeader() {
  return (
    <header className="hero-header">
      <a className="brand" href="#top">Emir Duman.</a>
      <nav aria-label="Primary navigation">
        {links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
      </nav>
      <a href="#contact">Contact</a>
    </header>
  );
}
