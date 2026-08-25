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
  idleAngularVelocity: (Math.PI * 2) / 24,
} as const;

export const canMaterialConfig = {
  color: 0xb8bab7,
  metalness: 0.97,
  roughness: 0.38,
  envMapIntensity: 0.8,
} as const;
