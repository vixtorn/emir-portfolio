export const signpostConfig = {
  modelUrl: "/models/signpost/signpost-v1.glb",
  camera: {
    fov: 32,
    desktopPosition: [7.2, 5.4, 11.8] as const,
    narrowPosition: [8.2, 5.8, 13.8] as const,
    target: [0, 2.7, 0] as const,
  },
  scroll: {
    travelViewportHeights: 2,
    fullTurnRadians: Math.PI * 2,
  },
  presentation: {
    scale: 1.1,
    verticalTravel: 0.34,
  },
  trafficLight: {
    redToAmber: { start: 0.68, end: 0.72 },
    amberToGreen: { start: 0.9, end: 0.94 },
    activeEmissiveIntensity: 2.4,
    inactiveEmissiveIntensity: 0.04,
    reducedMotionProgress: 1,
    lenses: {
      red: { nodeName: "Lens_Red", emissiveColor: "#b31d18" },
      amber: { nodeName: "Lens_Amber", emissiveColor: "#e39a22" },
      green: { nodeName: "Lens_Green", emissiveColor: "#168c47" },
    },
  },
} as const;

export const signpostRequiredNodes = [
  "SignpostRoot",
  "Base_Static",
  "RotatingAssembly",
  "Sign_ABOUT",
  "Sign_PLAYGROUND",
  "Sign_SELECTED_WORK",
  "Sign_HELLO",
  "TrafficLightAssembly",
  "Lens_Red",
  "Lens_Amber",
  "Lens_Green",
] as const;
