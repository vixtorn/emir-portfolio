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
