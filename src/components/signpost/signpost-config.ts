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
  scroll: {
    travelViewportHeights: 7,
    partialReveal: {
      maxRadians: (65 * Math.PI) / 180,
      startProgress: 0.18,
      peakProgress: 0.34,
      returnProgress: 0.58,
    },
  },
  presentation: {
    scale: 1.1,
    verticalTravel: 0,
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
  navigation: {
    ABOUT: {
      target: "#about",
      label: "About",
      nodeNames: ["Sign_ABOUT", "Text_ABOUT"],
    },
    PLAYGROUND: {
      target: "#playground",
      label: "Playground",
      nodeNames: ["Sign_PLAYGROUND", "Text_PLAYGROUND"],
    },
    SELECTED_WORK: {
      target: "#work",
      label: "Selected Work",
      nodeNames: ["Sign_SELECTED_WORK", "Text_SELECTED_WORK"],
    },
    HELLO: {
      target: "#contact",
      label: "Contact",
      nodeNames: ["Sign_HELLO", "Text_HELLO"],
    },
  },
  cameraChoreography: {
    desktopKeyframes: [
      {
        progress: 0,
        position: [7.2, 5.4, 11.8] as const,
        target: [0, 2.7, 0] as const,
      },
      {
        progress: 0.08,
        position: [6.8, 6.1, 10.9] as const,
        target: [0, 3.55, 0] as const,
      },
      {
        progress: 0.2,
        position: [2.65, 7.35, 4.05] as const,
        target: [0, 5, 0] as const,
      },
      {
        progress: 0.26,
        position: [2.6, 7.05, 4] as const,
        target: [0, 4.75, 0] as const,
      },
      {
        progress: 0.42,
        position: [2.5, 4.9, 3.8] as const,
        target: [0, 2.9, 0] as const,
      },
      {
        progress: 0.68,
        position: [2.5, 3.8, 4] as const,
        target: [0, 2.4, 0] as const,
      },
      {
        progress: 0.84,
        position: [2.5, 2.7, 3.7] as const,
        target: [0, 1.6, 0] as const,
      },
      {
        progress: 0.94,
        position: [2.5, 2.7, 3.7] as const,
        target: [0, 1.6, 0] as const,
      },
      {
        progress: 1,
        position: [2.5, 1.8, 3.7] as const,
        target: [0, 0.3, 0] as const,
      },
    ],
    narrowKeyframes: [
      {
        progress: 0,
        position: [8.2, 5.8, 13.8] as const,
        target: [0, 2.7, 0] as const,
      },
      {
        progress: 0.08,
        position: [7.9, 6.4, 13.2] as const,
        target: [0, 3.55, 0] as const,
      },
      {
        progress: 0.2,
        position: [4.95, 7.8, 7.6] as const,
        target: [0, 5, 0] as const,
      },
      {
        progress: 0.26,
        position: [4.9, 7.55, 7.5] as const,
        target: [0, 4.75, 0] as const,
      },
      {
        progress: 0.42,
        position: [4.8, 5.35, 7.2] as const,
        target: [0, 2.9, 0] as const,
      },
      {
        progress: 0.68,
        position: [4.8, 4.25, 7.3] as const,
        target: [0, 2.4, 0] as const,
      },
      {
        progress: 0.84,
        position: [4.8, 3.15, 7] as const,
        target: [0, 1.6, 0] as const,
      },
      {
        progress: 0.94,
        position: [4.8, 3.15, 7] as const,
        target: [0, 1.6, 0] as const,
      },
      {
        progress: 1,
        position: [4.8, 2.2, 7] as const,
        target: [0, 0.3, 0] as const,
      },
    ],
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
