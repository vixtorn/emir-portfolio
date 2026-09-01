import PlaygroundComposition from "./composition/PlaygroundComposition";

export default function PlaygroundSection() {
  return (
    <section id="playground" aria-label="Playground">
      <PlaygroundComposition sceneId="playground" />
    </section>
  );
}
