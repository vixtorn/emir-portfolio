export const scratchConfig = {
  brushSize: 32,
  coverageCellSize: 8,
  devicePixelRatioCap: 2,
  unlockThreshold: 0.6,
} as const;

export const scratchInteractionGuard = {
  sourceSize: { width: 800, height: 450 },
  enter: { left: 215, top: 283, right: 476, bottom: 380 },
  exit: { left: 203, top: 271, right: 488, bottom: 392 },
} as const;
