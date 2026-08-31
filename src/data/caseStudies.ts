export type CaseStudyMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  category: string;
  oneLiner: string;
  liveUrl?: string;
  sourceUrl?: string;
  role?: string;
  focus?: string[];
  personalNote?: { eyebrow?: string; body: string };
  whyIBuiltIt?: string[];
  challenge?: { intro?: string; points?: string[] };
  experience?: Array<{ title: string; description: string }>;
  decisions?: Array<{ title: string; decision: string; reason: string; tradeoff?: string }>;
  techStack?: Array<{ name: string; reason?: string }>;
  engineering?: Array<{ title: string; body: string }>;
  iterations?: Array<{ before: string; problem: string; decision: string; result: string }>;
  learnings?: string[];
  credits?: Array<{ label: string; detail: string; url?: string }>;
  heroMedia?: CaseStudyMedia;
  gallery?: CaseStudyMedia[];
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "neodex",
    index: "02",
    title: "NEODEX",
    category: "DIGITAL PRODUCT",
    oneLiner: "A cinematic creature-data experience built around exploration, comparison and playful product interaction.",
    liveUrl: "https://neodex-flax.vercel.app/",
    sourceUrl: "https://github.com/vixtorn/neodex",
    role: "Product-minded Creative Developer",
    focus: ["Product UI", "Data exploration", "Interaction", "3D presentation"],
    personalNote: {
      eyebrow: "A SMALL NOTE",
      body: "Who doesn't love Pokémon?\n\nNeoDex started as an excuse to revisit something that instantly takes me back to childhood — then ask what a Pokédex might feel like if it were designed as a modern digital product instead of a static database.",
    },
    whyIBuiltIt: [
      "I wanted to combine something emotionally familiar with the things I was learning about product design, structured data, interaction and spatial presentation.",
      "The goal wasn't simply to list Pokémon. I wanted browsing, comparing and building a team to feel like parts of one coherent product experience.",
    ],
    challenge: {
      intro: "The challenge was to make a large, structured dataset expressive without letting the interface become harder to read or use.",
      points: [
        "Keep a clear information hierarchy across dense creature data.",
        "Support Explore, Detail, Compare, Team Builder and Type System flows as one product.",
        "Use visual identity as part of the data system, not as decoration over it.",
        "Make every interaction useful: discovery, comparison, selection or recall.",
      ],
    },
    experience: [
      {
        title: "Explore",
        description: "Search by name, filter by type and sort through responsive creature cards without turning discovery into a table of raw fields.",
      },
      {
        title: "Detail",
        description: "Dynamic Pokémon pages bring stats, abilities and type-driven styling into a focused, addressable view.",
      },
      {
        title: "Compare",
        description: "Two Pokémon can be read side by side through a Stat Difference system, with swap, reset and copy-link actions built into the product flow.",
      },
      {
        title: "Build a team",
        description: "A six-slot Team Builder prevents duplicates, persists selections and exposes averages and composition information without needing an account.",
      },
      {
        title: "Read the type system",
        description: "All 18 types carry identity, example Pokémon and colors that feed back into the interface system.",
      },
    ],
    decisions: [
      {
        title: "01 / SHAREABLE COMPARISON STATE",
        decision: "Store the selected comparison pair in URL query parameters.",
        reason: "A matchup should be a shareable product state, not only temporary local UI state.",
        tradeoff: "The controls and route state need deliberate synchronization.",
      },
      {
        title: "02 / PERSISTENT TEAM BUILDER",
        decision: "Persist team selection with localStorage.",
        reason: "A carefully assembled team should survive a refresh.",
        tradeoff: "It stays lightweight, but does not offer account-based cross-device persistence.",
      },
      {
        title: "03 / TYPE-DRIVEN VISUAL LANGUAGE",
        decision: "Use Pokémon type information inside the interface design system.",
        reason: "Type data already carries meaningful identity and makes scanning faster.",
        tradeoff: "Strong type colors require restraint so readable data remains dominant.",
      },
      {
        title: "04 / ONE PRODUCT, MANY MODES",
        decision: "Explorer, Detail, Compare, Team Builder and Type screens share one visual language.",
        reason: "The experience should read as one product ecosystem instead of disconnected mini-products.",
      },
    ],
    techStack: [
      { name: "Next.js 16", reason: "App Router keeps the product’s routes addressable." },
      { name: "React 19", reason: "Reusable product views and interactive client state." },
      { name: "TypeScript", reason: "Typed API responses make data-heavy screens safer to compose." },
      { name: "Tailwind CSS 4", reason: "A fast way to maintain a repeated visual system." },
      { name: "Three.js", reason: "Spatial presentation where it adds to the product feeling." },
      { name: "PokeAPI", reason: "Public Pokémon data behind the explorer and detail views." },
      { name: "URL query state", reason: "Specific comparisons stay shareable." },
      { name: "localStorage", reason: "Teams persist between sessions without a backend." },
    ],
    engineering: [
      { title: "Addressable product state", body: "Dynamic Pokémon routes and compare query state make individual detail pages and matchups linkable rather than trapped inside a session." },
      { title: "A typed data boundary", body: "Typed API response handling gives reusable components a reliable shape to render across Explorer, Detail and Compare." },
      { title: "Design tokens from data", body: "Type information becomes card, badge, border and accent styling—while the underlying hierarchy stays consistent." },
      { title: "Client state with a purpose", body: "localStorage supports the Team Builder’s persistent selections; it is used for a clear product need, not as a substitute for architecture." },
    ],
    iterations: [
      {
        before: "WORKING PRODUCT",
        problem: "NeoDex was built before the current portfolio and before its visual direction had matured to this level.",
        decision: "Revisit the way the project is presented in the portfolio, rather than pretending the original application was visually perfect.",
        result: "Art-directed portfolio media now communicates the product more truthfully and more clearly. The live application remains the real application.",
      },
    ],
    learnings: [
      "Visual polish and product clarity are different skills.",
      "A feature needs a user purpose, not only visual novelty.",
      "Route and state architecture can materially improve shareability.",
      "Repeated visual systems benefit from data-driven design tokens.",
      "Presenting an older project honestly is stronger than pretending it was perfect.",
    ],
    credits: [
      { label: "Reality check", detail: "NeoDex is an unofficial fan-made portfolio project and is not affiliated with Nintendo, Game Freak, Creatures Inc. or The Pokémon Company." },
      { label: "Pokémon data", detail: "Public Pokémon data is provided through PokeAPI.", url: "https://pokeapi.co/" },
    ],
    heroMedia: {
      src: "/images/work/neodex/neodex-selected-work-v1.png",
      alt: "NeoDex product showcase featuring creature exploration and comparison interfaces",
      width: 1586,
      height: 992,
    },
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
