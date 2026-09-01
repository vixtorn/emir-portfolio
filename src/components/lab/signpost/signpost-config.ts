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
    activeEmissiveIntensity: 2.4,
    inactiveEmissiveIntensity: 0.04,
    reducedMotionProgress: 1,
    lenses: {
      red: {
        nodeName: "Lens_Red",
        emissiveColor: "#b31d18",
      },
      amber: {
        nodeName: "Lens_Amber",
        emissiveColor: "#e39a22",
      },
      green: {
        nodeName: "Lens_Green",
        emissiveColor: "#168c47",
      },
    },
  },
  presentation: {
    scale: 1.1,
    verticalTravel: 0.34,
  },
  cameraChoreography: {
    presentationVerticalTravel: 0,
    desktopKeyframes: [
      {
        progress: 0,
        position: [2.7, 6.7, 4.3] as const,
        target: [0, 4.55, 0] as const,
      },
      {
        progress: 0.2,
        position: [2.65, 5.8, 4.05] as const,
        target: [0, 3.7, 0] as const,
      },
      {
        progress: 0.4,
        position: [2.5, 4.9, 3.8] as const,
        target: [0, 2.9, 0] as const,
      },
      {
        progress: 0.58,
        position: [0.75, 4.7, 5] as const,
        target: [0, 2.45, 0] as const,
      },
      {
        progress: 0.76,
        position: [-3, 4.5, 4] as const,
        target: [0, 2.5, 0] as const,
      },
      {
        progress: 1,
        position: [2.8, 3.3, 5.2] as const,
        target: [0, 1.3, 0] as const,
      },
    ],
    narrowKeyframes: [
      {
        progress: 0,
        position: [5.1, 7.3, 8.1] as const,
        target: [0, 4.45, 0] as const,
      },
      {
        progress: 0.2,
        position: [4.95, 6.45, 7.65] as const,
        target: [0, 3.75, 0] as const,
      },
      {
        progress: 0.4,
        position: [4.8, 5.5, 7.25] as const,
        target: [0, 2.95, 0] as const,
      },
      {
        progress: 0.58,
        position: [4.7, 4.55, 7.1] as const,
        target: [0, 2.2, 0] as const,
      },
      {
        progress: 0.76,
        position: [4.6, 3.85, 7] as const,
        target: [0, 1.55, 0] as const,
      },
      {
        progress: 1,
        position: [4.9, 2.9, 7.75] as const,
        target: [0, 0.7, 0] as const,
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
