export const signpostConfig = {
  modelUrl: "/models/signpost/signpost-v1.glb",
  camera: {
    fov: 32,
    desktopPosition: [7.2, 5.4, 11.8] as const,
    narrowPosition: [8.2, 5.8, 13.8] as const,
    target: [0, 2.7, 0] as const,
  },
  renderer: {
    maxDpr: 1.75,
  },
  scrollRotation: {
    travelViewportHeights: 2,
    fullTurnRadians: Math.PI * 2,
  },
  trafficLight: {
    redToAmber: {
      start: 0.68,
      end: 0.72,
    },
    amberToGreen: {
      start: 0.9,
      end: 0.94,
    },
    activeEmissiveIntensity: 1.15,
    inactiveEmissiveIntensity: 0.04,
    reducedMotionProgress: 1,
    lenses: {
      red: "Lens_Red",
      amber: "Lens_Amber",
      green: "Lens_Green",
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
