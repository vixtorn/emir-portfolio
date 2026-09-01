export const keychainConfig = {
  modelScale: 50,

  baseRotationY: (170 * Math.PI) / 180,

  topAttachmentY: 0.002625,
  modelOffset: [0, -0.13125, 0] as const,
  swingPivotY: 0.72,

  cameraPosition: [1.8, 0.2, 7.5] as const,

  gravity: 7.5,
  damping: 4.4,
  impulseMultiplier: 0.35,
  pointerVelocityMax: 3.5,
  angularVelocityMax: 1.1,

  absoluteAngleMax: (15 * Math.PI) / 180,
  secondaryXMax: (1.5 * Math.PI) / 180,
  secondaryYMax: (3 * Math.PI) / 180,

  idleResumeDelay: 0.8,
  idleSwayAngle: (0.65 * Math.PI) / 180,
  idleSwayAngularVelocity: 0.78,

  floatAmplitude: 0.035,
  floatAngularVelocity: (2 * Math.PI) / 6,

  twistAngle: (4 * Math.PI) / 180,
  twistAngularVelocity: (2 * Math.PI) / 8.5,
  activeTwistMultiplier: 0.55,
} as const;
