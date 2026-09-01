const CNC_FRAME_START = 10;
const CNC_FRAME_END = 45;

function frameFileName(frame: number) {
  return `cnc-${String(frame).padStart(3, "0")}.webp`;
}

export const cncSequenceConfig = {
  frameRange: {
    start: CNC_FRAME_START,
    end: CNC_FRAME_END,
  },
  frames: Array.from(
    { length: CNC_FRAME_END - CNC_FRAME_START + 1 },
    (_, offset) => `/media/work/cnc/frames/${frameFileName(CNC_FRAME_START + offset)}`,
  ),
} as const;
