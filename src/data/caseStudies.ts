export type CaseStudyMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type CaseStudySectionHeadings = Partial<{
  whyIBuiltIt: string;
  challenge: string;
  experience: string;
  decisions: string;
  engineering: string;
  toolkit: string;
  iteration: string;
  learnings: string;
  credits: string;
}>;

export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  heroTitleSize?: "compact";
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
  sectionHeadings?: CaseStudySectionHeadings;
  architecture?: { title: string; description: string; center: string; branches: string[]; ariaLabel: string };
  pipeline?: { title: string; description: string; steps: string[]; ariaLabel: string };
  performance?: { label: string; before: string; after: string; detail: string };
  heroMedia?: CaseStudyMedia;
  gallery?: CaseStudyMedia[];
  gallerySection?: { index: string; title: string; description?: string };
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "sneaker-configurator",
    index: "03",
    title: "SOLELAB",
    category: "INTERACTIVE 3D SNEAKER CONFIGURATOR",
    oneLiner: "A real-time sneaker customization experience built around material systems, configurable geometry and a Blender-to-web asset pipeline.",
    liveUrl: "https://solelab-lyart.vercel.app/",
    sourceUrl: "https://github.com/vixtorn/sneaker-configurator",
    role: "Creative Developer / 3D Product Engineer",
    focus: ["Real-time 3D", "Material systems", "Asset pipeline", "Product interaction", "Responsive WebGL"],
    personalNote: {
      eyebrow: "A MATERIAL NOTE",
      body: "This is the project where I learned that UVs and textures can humble you very quickly.\n\nI spent far more time fighting UV maps, texel density and material behaviour than I expected.\n\nAlso, yes — there's only one shoe.\n\nI lost the other one somewhere between the UVs and texture nodes.",
    },
    whyIBuiltIt: [
      "I didn't want to place a 3D model on a webpage and call it an interactive product. I wanted the model itself to become configurable — individual parts, colors and materials controlled in real time while the sneaker remained a coherent product.",
      "The project became an excuse to understand what has to happen between a Blender asset and a reliable browser-based product configurator.",
    ],
    challenge: {
      intro: "The challenge was to make a prepared base asset behave like a deliberate product system in the browser, without claiming the original sneaker geometry as my own modelling work.",
      points: [
        "Keep Upper, Toe, Tongue, Laces and Sole independently addressable.",
        "Make material presets read consistently across configurable regions.",
        "Prevent interactive changes from mutating loader-cached GLTF materials.",
        "Hand the first-load cinematic naturally to direct orbit interaction.",
        "Support a full-bleed desktop viewer and a practical stacked mobile layout with the same model.",
      ],
    },
    experience: [
      { title: "Choose a region", description: "Upper, Toe, Tongue, Laces and Sole are named product regions, not anonymous GLTF fragments." },
      { title: "Tune the surface", description: "Upper regions can combine a selected color with Smooth Leather, Pebbled Leather, Suede, Canvas or Denim." },
      { title: "Set the finish", description: "Preset swatches and validated custom HEX input update the active configurable region in real time." },
      { title: "Separate laces", description: "Laces keep an independent color state instead of inheriting the upper configuration." },
      { title: "Switch the sole", description: "The outsole exposes Standard and Gum variants as a distinct product choice." },
    ],
    decisions: [
      { title: "01 / ADDRESSABLE MESHES", decision: "Prepare and name configurable sneaker regions in Blender before web integration.", reason: "A product configurator needs to address Upper, Toe, Tongue, Laces and Sole—not arbitrary GLTF mesh fragments.", tradeoff: "The asset hierarchy becomes part of the product architecture, so preparation work happens before UI work." },
      { title: "02 / DEDICATED UV_WEB", decision: "Prepare a dedicated UV_Web channel for predictable browser material behaviour.", reason: "Checker textures expose stretching, orientation, texel density and inconsistent scale before Suede, Canvas, Denim and Leather presets reach the runtime.", tradeoff: "UV preparation adds Blender-side work, but makes browser material behaviour far easier to control." },
      { title: "03 / PBR MATERIAL TESTING", decision: "Visually test Base Color, Roughness, Normal Map, Mapping and Principled BSDF combinations before creating runtime presets.", reason: "The browser uses color, normal and roughness maps, so surface response is considered before implementation—not guessed later.", tradeoff: "The project deliberately avoids claiming displacement where it is not used." },
      { title: "04 / RUNTIME-OWNED MATERIALS", decision: "Load the GLB once, deep-clone its scene, then build owned material instances for named configurable meshes.", reason: "Interactive color and material changes should not mutate loader-cached shared GLTF resources.", tradeoff: "Material and cloned-texture lifecycle needs explicit ownership and disposal." },
      { title: "05 / CONFIGURATION STATE", decision: "Keep product configuration in Zustand, separate from the 3D scene.", reason: "The UI describes the desired product; React Three Fiber renders that state onto the prepared mesh hierarchy.", tradeoff: "Refreshing currently returns to the default configuration because persistence is intentionally not implemented." },
      { title: "06 / ONE MODEL, TWO MOMENTS", decision: "Use the same Canvas and runtime GLB for the cinematic reveal and interactive configurator.", reason: "The lace macro, camera pullback and UI reveal hand their final state to OrbitControls instead of cutting to a duplicate scene.", tradeoff: "Camera and controls need precise coordination at the handoff." },
    ],
    pipeline: {
      title: "BLENDER → WEB",
      description: "The original base asset was prepared and adapted for configuration. The web product is the result of this pipeline, not simply a model dropped into a canvas.",
      steps: ["BASE 3D ASSET", "BLENDER INSPECTION", "MESH SEPARATION + NAMING", "UV_WEB", "CHECKER VALIDATION", "PBR MATERIAL TESTING", "GLB EXPORT", "REACT THREE FIBER", "RUNTIME MATERIAL SYSTEM", "ZUSTAND CONFIGURATION", "INTERACTIVE PRODUCT"],
      ariaLabel: "SOLELAB Blender to web asset pipeline",
    },
    engineering: [
      { title: "Owned runtime materials", body: "Known material presets are created once and assigned to named Upper, Toe and Tongue meshes. Lace and outsole colors update their own owned material sets directly." },
      { title: "Independent configuration", body: "Zustand keeps Upper, Toe, Tongue, Laces and Sole state separate. Material/preset/HEX selections are scoped to upper regions; laces and sole own their distinct controls." },
      { title: "Cinematic to interactive", body: "The first load begins on the lace and eyelet region, pulls back, reveals the interface, then hands the final camera and target to OrbitControls using the same Canvas and scene." },
      { title: "Responsive viewer architecture", body: "Desktop uses a viewport-wide Canvas beneath editorial layers. Tablet and mobile keep the same model but switch to a dedicated viewer height and stacked document flow." },
    ],
    gallerySection: { index: "08 / THE PREPARATION", title: "The technical mess was part of the material system.", description: "Authentic Blender captures show the work that made runtime configuration predictable: mesh segmentation, UV_Web inspection, checker validation and PBR surface testing." },
    gallery: [
      { src: "/images/work/solelab/blender-mesh-segmentation.png", alt: "Configurable sneaker meshes named and separated in Blender", width: 2009, height: 1106 },
      { src: "/images/work/solelab/blender-uv-web-layout.png", alt: "Dedicated UV_Web layout prepared in Blender", width: 1590, height: 1057 },
      { src: "/images/work/solelab/blender-uv-checker-validation.png", alt: "Checker texture validation on the prepared sneaker model", width: 1296, height: 544 },
      { src: "/images/work/solelab/blender-pbr-material-nodes.png", alt: "PBR material node setup in Blender", width: 1133, height: 888 },
      { src: "/images/work/solelab/blender-suede-material-preview.png", alt: "Suede material preview on the prepared sneaker geometry in Blender", width: 1295, height: 681 },
    ],
    techStack: [
      { name: "Next.js 16", reason: "Application structure and the responsive product interface." },
      { name: "React 19 + TypeScript", reason: "Typed, reusable configuration and UI systems." },
      { name: "Three.js + R3F", reason: "Real-time rendering and runtime material assignment." },
      { name: "Drei", reason: "GLB loading, bounds, centering, controls, overlays and contact shadows." },
      { name: "Zustand", reason: "Independent product configuration state." },
      { name: "react-colorful", reason: "Custom HEX color interaction." },
      { name: "Blender", reason: "Asset preparation, mesh hierarchy, UV validation and material testing." },
      { name: "Vercel", reason: "Deployment for the live product experience." },
    ],
    iterations: [
      { before: "DISPLAYED MODEL", problem: "Loading a 3D model is not enough for a dependable product configurator; its meshes, UVs and materials need predictable runtime behaviour.", decision: "Separate meaningful regions, create UV_Web, validate with checker textures, test materials, export the GLB, then build runtime-owned materials around named meshes.", result: "The prepared asset becomes an addressable product system rather than a passive 3D object." },
      { before: "SHARED LOADER MATERIALS", problem: "Mutating loaded materials directly is simple, but cached GLTF resources can be shared across uses.", decision: "Deep-clone the scene and create runtime-owned material instances before interactive material/color changes occur.", result: "The configurator owns the material resources it changes." },
    ],
    learnings: [
      "Before SOLELAB, I mostly thought of a 3D asset as geometry. Afterwards, hierarchy, UV ownership, texel density, runtime addressability and material lifecycle became part of the application architecture.",
      "Web-ready 3D begins before the GLB reaches the browser.",
      "Asset structure and product interaction are connected.",
      "UV problems cannot always be fixed with runtime code.",
      "Reusable material systems need ownership discipline.",
      "Cinematic presentation should hand off naturally to interaction.",
      "Responsive 3D requires layout decisions as much as rendering decisions.",
    ],
    credits: [
      { label: "Asset reality check", detail: "SOLELAB-specific work includes Blender asset preparation, configurable mesh separation, scene-object naming, lace organization, UV_Web preparation, UV validation, material testing, GLB integration, runtime material architecture, interface implementation and the responsive cinematic viewer. The repository does not clearly establish original model-source or texture-source licensing; the original base asset is not claimed as SOLELAB-authored geometry." },
      { label: "Future directions", detail: "Possible next steps include shareable configuration URLs, saved designs, PNG preview export, additional configurable parts and material presets, KTX2 texture compression, and lower-end mobile GPU profiling. These are not implemented features." },
    ],
    sectionHeadings: {
      whyIBuiltIt: "A product configuration starts before the browser.",
      challenge: "Make one prepared asset behave like a real product system.",
      experience: "Five controls, one coherent sneaker.",
      decisions: "Six decisions from mesh hierarchy to product state.",
      engineering: "The Blender-to-web pipeline is the product architecture.",
      toolkit: "Tools with clear material and interaction responsibilities.",
      iteration: "From a displayed model to an addressable product system.",
      learnings: "The asset is part of the application architecture.",
      credits: "Be exact about the work—and the asset source.",
    },
    heroMedia: { src: "/images/work/solelab/solelab-configurator-hero.png", alt: "SOLELAB interactive 3D sneaker configurator interface", width: 1910, height: 1020 },
  },
  {
    slug: "cnc-motion-showcase",
    index: "01",
    title: "CNC MOTION SHOWCASE",
    heroTitleSize: "compact",
    category: "INTERACTIVE SYSTEM",
    oneLiner: "An interactive 3D CNC experience that turns machine motion, manufacturing logic and industrial UI language into one coherent digital system.",
    liveUrl: "https://cnc-motion-showcase.vercel.app/",
    sourceUrl: "https://github.com/vixtorn/cnc-motion-showcase",
    role: "Creative Developer / 3D Interaction / Technical Direction",
    focus: ["Real-time 3D", "Motion Systems", "Interaction Design", "Performance", "Industrial UI"],
    personalNote: {
      eyebrow: "A FACTORY NOTE",
      body: "As a kid, I had two very specific dreams.\n\n1. Hang from the back of a garbage truck.\n2. Model the systems inside a huge factory and somehow control the workflow.\n\nI never managed the first one.\n\nCNC Motion Showcase got me surprisingly close to the second.",
    },
    whyIBuiltIt: [
      "I have always been drawn to industrial machines — not only because they look powerful, but because they are systems. Every movement has a reason. Every component has a responsibility. Every process has a sequence.",
      "This project explores a simple question: What if a CNC machine was presented not as a static 3D model, but as a digital experience you could understand, explore and operate?",
    ],
    challenge: {
      intro: "The challenge was not simply rendering a complex machine. It was designing a system where cinematic storytelling, interactive control and technical clarity could coexist.",
      points: [
        "Make a complex CNC model feel understandable without oversimplifying it.",
        "Keep scroll-driven motion cinematic instead of mechanical.",
        "Allow direct interaction without breaking the narrative flow.",
        "Manage multiple operating modes without visual chaos.",
        "Keep the experience smooth enough to feel premium.",
      ],
    },
    experience: [
      { title: "Scroll cinematic", description: "A guided progression through the machine, built around a canonical timeline rather than independent animation fragments." },
      { title: "System overview", description: "A transition from cinematic framing into an operator-oriented system view with meaningful controls." },
      { title: "Direct machine interaction", description: "Click machine parts such as the chuck, turret, tailstock, front door and workpiece to inspect real assemblies." },
      { title: "Machining sequence", description: "A controlled process sequence that moves the machine through a readable, deterministic state progression." },
      { title: "Process playground", description: "A sandbox-like mode for exploring the machine without competing with the cinematic narrative." },
      { title: "Machine anatomy", description: "A guided anatomy layer that explains CNC components through the visual model itself." },
    ],
    decisions: [
      { title: "01 / ONE CANONICAL TIMELINE", decision: "Drive cinematic machine motion from one canonical GSAP timeline.", reason: "One source of truth keeps doors, spindle, turret, tailstock, coolant and camera progression coordinated.", tradeoff: "The timeline needs careful authoring, but avoids competing animation systems." },
      { title: "02 / DETERMINISTIC STATES", decision: "Model machine behavior as explicit state instead of incidental animation.", reason: "The same scroll progress or interaction always produces the same motion and visual result.", tradeoff: "Less freeform than simulation, but far easier to reason about and present." },
      { title: "03 / LOGICAL ASSEMBLIES", decision: "Animate meaningful Blender groups rather than arbitrary mesh fragments.", reason: "The code maps directly to CNC vocabulary: door, chuck, tailstock, turret carriage and turret index.", tradeoff: "The hierarchy has to be prepared deliberately before runtime work begins." },
      { title: "04 / RAW TO FINISHED GEOMETRY", decision: "Use separate raw and finished workpiece geometry for the machining reveal.", reason: "The visual transformation stays readable and reliable inside a real-time portfolio experience.", tradeoff: "It is a presentation decision, not a physically accurate material-removal simulation." },
      { title: "05 / SHARED INTERACTION STATE", decision: "Coordinate camera, machine transforms, effects and interaction through shared ownership.", reason: "Cinematic, operator and anatomy modes can coexist without fighting over the same scene state.", tradeoff: "Mode transitions require more deliberate orchestration." },
    ],
    architecture: {
      title: "ONE MACHINE. ONE SCENE. MULTIPLE EXPERIENCES.",
      description: "Cinematic storytelling, inspection and the process sandbox all reuse the same model and shared scene state instead of duplicating assets or motion logic.",
      center: "ONE CNC SCENE",
      branches: ["SCROLL CINEMATIC", "GUIDED OPERATOR", "PROCESS PLAYGROUND", "MACHINE ANATOMY"],
      ariaLabel: "CNC Motion Showcase architecture diagram",
    },
    engineering: [
      { title: "Frame-rate independent scroll", body: "Lenis document scroll becomes normalized progress, then feeds a damped response into the canonical GSAP machine timeline." },
      { title: "Controlled machine behavior", body: "Door, spindle, tailstock, turret, coolant, sparks and workpiece state are deterministic systems rather than decorative loops." },
      { title: "Interaction through the model", body: "Direct picking resolves mesh descendants back to meaningful CNC assemblies, then applies an orange outline for clear feedback." },
      { title: "Effects with a job to do", body: "Sparks, hot chips and coolant/mist only appear when the machining state calls for them, keeping the scene legible." },
    ],
    performance: {
      label: "PRODUCTION MODEL / TEXTURE OPTIMIZATION",
      before: "24.5 MB",
      after: "17.45 MB",
      detail: "A texture-only WebP optimization reduced the model payload while preserving hierarchy, transforms and machine behavior. Runtime work also keeps one WebGL canvas, one model scene, adaptive DPR, demand-driven rendering and effects only when required.",
    },
    gallerySection: { index: "08 / MACHINE ANATOMY", title: "The interface speaks in machine parts, not abstract meshes.", description: "The runtime model preserves logical assemblies so the experience can identify and explain the real system being explored." },
    gallery: [
      { src: "/images/work/cnc/chuck.png", alt: "CNC Motion Showcase machine anatomy view focused on the chuck", width: 1440, height: 810 },
      { src: "/images/work/cnc/tailstock.png", alt: "CNC Motion Showcase machine anatomy view focused on the tailstock", width: 1440, height: 810 },
      { src: "/images/work/cnc/finished-workpiece.png", alt: "CNC Motion Showcase machine anatomy view focused on the finished workpiece", width: 1440, height: 810 },
    ],
    techStack: [
      { name: "React 19", reason: "Composes the operating modes and interaction surfaces." },
      { name: "TypeScript", reason: "Keeps machine state, component ownership and interactions explicit." },
      { name: "Three.js", reason: "Provides the scene graph and real-time rendering layer." },
      { name: "React Three Fiber", reason: "Connects the CNC scene to reusable React systems." },
      { name: "Drei", reason: "Supports practical R3F scene utilities without rebuilding fundamentals." },
      { name: "GSAP + Lenis", reason: "Coordinates the canonical timeline with smooth document-driven progression." },
      { name: "Blender", reason: "Defines the model, logical assembly hierarchy and animation-ready pivots." },
      { name: "Vite + Vercel", reason: "Keeps development lightweight and the experience easy to ship." },
    ],
    iterations: [
      { before: "EARLY VERSION", problem: "The initial experience relied on a shorter scroll animation with fewer interactions and less system separation.", decision: "Move toward a longer scroll-driven sequence, separate cinematic and interactive modes, and use explicit interaction state ownership.", result: "The final experience feels more intentional, easier to understand and more technically stable." },
    ],
    learnings: [
      "A 3D scene becomes meaningful when it communicates system logic, not only visual spectacle.",
      "Animation is strongest when motion has responsibility.",
      "Interaction design and system design are inseparable in real-time 3D.",
      "Complexity needs choreography, not just capability.",
      "Performance work is part of interaction design, not a final polish pass.",
      "A single well-organized scene can support multiple experiences without duplicated assets.",
    ],
    credits: [
      { label: "Reality check", detail: "CNC Motion Showcase is an interactive visualization and engineering study. It is not CNC control software, a production machine interface or a physically accurate manufacturing simulation." },
    ],
    sectionHeadings: {
      whyIBuiltIt: "Industrial logic, made explorable.",
      challenge: "Let cinematic motion and machine clarity coexist.",
      experience: "Six ways into the same machine.",
      decisions: "Five decisions that keep the system coherent.",
      engineering: "One scene with clear ownership.",
      toolkit: "A real-time stack with distinct responsibilities.",
      iteration: "From shorter animation to deliberate system choreography.",
      learnings: "Complexity becomes legible through structure.",
      credits: "A visualization study, presented honestly.",
    },
    heroMedia: { src: "/media/work/cnc/cnc-poster.webp", alt: "CNC turning center chamber showing the chuck, workpiece and turret", width: 1440, height: 810 },
  },
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
