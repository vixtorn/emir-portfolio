export type MemoryRole =
  | "hero"
  | "wide"
  | "portrait"
  | "observation"
  | "detail"
  | "supporting";

export type MemoryItem = {
  id: string;
  role: MemoryRole;
  src?: string;
  alt?: string;
  location?: string;
  date?: string;
  caption?: string[];
  showCaption?: boolean;
  aspectRatio: number;
  tone: "light" | "mid" | "dark";
  desktop: {
    x: number;
    y: number;
    width: number;
    rotate: number;
    depth: number;
    scale: number;
    opacity: number;
    layer?: number;
  };
};

export const offScreenMemories: MemoryItem[] = [
  { id: "memory-01", role: "hero", aspectRatio: 1.36, tone: "mid", desktop: { x: 7, y: 8, width: 43, rotate: -1.2, depth: 70, scale: 1.1, opacity: 0.94 } },
  { id: "memory-02", role: "portrait", aspectRatio: 0.76, tone: "light", showCaption: false, desktop: { x: 67, y: 21, width: 18, rotate: 2.1, depth: -70, scale: 0.9, opacity: 0.68 } },
  { id: "memory-03", role: "wide", aspectRatio: 1.62, tone: "dark", desktop: { x: 30, y: 42, width: 37, rotate: -0.8, depth: 0, scale: 1, opacity: 0.84 } },
  { id: "memory-04", role: "observation", aspectRatio: 1.08, tone: "light", showCaption: false, desktop: { x: 10, y: 62, width: 19, rotate: 1.5, depth: -20, scale: 0.87, opacity: 0.68, layer: 2 } },
  { id: "memory-05", role: "supporting", aspectRatio: 1.2, tone: "mid", showCaption: false, desktop: { x: 58, y: 69, width: 27, rotate: -1.2, depth: -20, scale: 0.93, opacity: 0.72 } },
  { id: "memory-06", role: "hero", aspectRatio: 1.3, tone: "dark", desktop: { x: 18, y: 88, width: 42, rotate: 1, depth: 80, scale: 1.08, opacity: 0.92 } },
  { id: "memory-07", role: "detail", aspectRatio: 1, tone: "light", showCaption: false, desktop: { x: 71, y: 106, width: 16, rotate: -2, depth: -100, scale: 0.82, opacity: 0.62 } },
  { id: "memory-08", role: "wide", aspectRatio: 1.7, tone: "mid", desktop: { x: 35, y: 124, width: 40, rotate: 0.4, depth: 0, scale: 1, opacity: 0.82 } },
  { id: "memory-09", role: "portrait", aspectRatio: 0.74, tone: "dark", showCaption: false, desktop: { x: 10, y: 149, width: 23, rotate: 1.4, depth: -45, scale: 0.91, opacity: 0.68 } },
  { id: "memory-10", role: "supporting", aspectRatio: 1.35, tone: "light", desktop: { x: 48, y: 171, width: 31, rotate: -0.5, depth: 24, scale: 0.98, opacity: 0.76 } },
];
