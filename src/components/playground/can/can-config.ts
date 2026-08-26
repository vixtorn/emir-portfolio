export const canConfig = {
  bodyRadius: 1,
  bodyHeight: 2.52,
  shoulderHeight: 0.18,
  neckRadius: 0.9,
  rimRadius: 0.91,
  rimTubeRadius: 0.045,
  insetRadius: 0.85,
  bottomTaperHeight: 0.16,
  radialSegments: 96,
  idleRotationDuration: 24,
  // Negative Y rotation reads clockwise when viewed from above.
  idleAngularVelocity: -(Math.PI * 2) / 24,
  floatAmplitude: 0.04,
  floatDuration: 4.8,
  floatAngularVelocity: (Math.PI * 2) / 4.8,
  idleTiltX: 0,
  idleTiltZ: -(4.5 * Math.PI) / 180,
  lightSweepIntensity: 0.16,
  lightSweepDuration: 10,
  lightSweepAngularVelocity: (Math.PI * 2) / 10,
  lightSweepTravel: 1.6,
  // The Blender GLB is the production geometry source of truth.
  modelScale: 1,
  // Offsets the raw GLB bounds center (-0.00010991096 on Y).
  modelPositionY: 0.00010991096496582031,
} as const;

export const canMaterialConfig = {
  color: 0xb8bab7,
  metalness: 0.97,
  roughness: 0.38,
  envMapIntensity: 0.8,
} as const;
