export const motionDuration = {
  micro: 0.2,
  ui: 0.36,
  physical: 0.7,
  cinematic: 1.4,
} as const;

// These GSAP presets intentionally approximate the matching CSS easing tokens.
// CSS custom properties remain the source of truth for DOM transitions.
export const motionEase = {
  ui: "power2.out",
  soft: "power3.out",
  cinematic: "power4.inOut",
} as const;

export const motionGuidance = {
  shortText: "expressive",
  longText: "readable",
  threeDimensions: "physical",
  ui: "precise",
  sectionTransitions: "cinematic",
} as const;
