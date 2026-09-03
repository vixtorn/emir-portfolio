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
  { id: "memory-01", role: "hero", src: "/images/off-screen/36.jpg", alt: "Emir smiling beside the Adriatic Sea in Montenegro", location: "Adriatic Sea, Montenegro", date: "2 Aug 2025", caption: ["the best sea I’ve ever swum in"], aspectRatio: 1.333, tone: "mid", desktop: { x: 7, y: 8, width: 43, rotate: -1.2, depth: 70, scale: 1.1, opacity: 0.98, layer: 3 } },
  { id: "memory-02", role: "portrait", src: "/images/off-screen/9.jpg", alt: "Emir as a child at kindergarten in Beylikdüzü", location: "Beylikdüzü, Istanbul", date: "2005–2007", caption: ["probably my first kiss"], aspectRatio: 0.75, tone: "light", desktop: { x: 67, y: 21, width: 18, rotate: 2.1, depth: -70, scale: 0.9, opacity: 0.88 } },
  { id: "memory-03", role: "wide", src: "/images/off-screen/29.jpg", alt: "Emir at his first football derby at Rams Park", location: "Rams Park, Istanbul", date: "26 Apr 2026", caption: ["my first match turned out to be a derby"], aspectRatio: 1.333, tone: "dark", desktop: { x: 30, y: 42, width: 37, rotate: -0.8, depth: 0, scale: 1, opacity: 0.95 } },
  { id: "memory-04", role: "observation", src: "/images/off-screen/17.jpg", alt: "Colourful escalators at M6 metro station in Istanbul", location: "M6 Station, Istanbul", date: "3 Sep 2022", caption: ["still my favourite metro stop in the city"], aspectRatio: 0.75, tone: "light", desktop: { x: 10, y: 67, width: 19, rotate: 1.5, depth: -20, scale: 0.87, opacity: 0.86, layer: 2 } },
  { id: "memory-05", role: "supporting", src: "/images/off-screen/1.jpg", alt: "Bahçeşehir University building in Istanbul", location: "Bahçeşehir University, Istanbul", date: "20 Oct 2025", caption: ["the place where I used to work"], aspectRatio: 0.75, tone: "mid", desktop: { x: 58, y: 77, width: 20, rotate: -1.2, depth: -20, scale: 0.93, opacity: 0.9 } },
  { id: "memory-06", role: "hero", src: "/images/off-screen/31.jpg", alt: "Emir and Emre together at Bahçeşehir University", location: "Beylikdüzü, Istanbul", date: "30 Aug 2026", caption: ["Emre — friends since 2002"], aspectRatio: 1.333, tone: "dark", desktop: { x: 18, y: 100, width: 42, rotate: 1, depth: 80, scale: 1.08, opacity: 0.98 } },
  { id: "memory-07", role: "detail", src: "/images/off-screen/30.jpg", alt: "Üzüm, a stray dog cared for at Bahçeşehir University", location: "Bahçeşehir University", date: "11 Apr 2025", caption: ["Üzüm, found in the woods and adopted by campus"], aspectRatio: 0.75, tone: "light", desktop: { x: 71, y: 120, width: 16, rotate: -2, depth: -100, scale: 0.82, opacity: 0.84 } },
  { id: "memory-08", role: "supporting", src: "/images/off-screen/21.jpg", alt: "Emir and his friends gathered around a red truck in Istanbul", location: "Istanbul", date: "3 Mar 2026", caption: ["Samet got the red truck. We made a night of it."], aspectRatio: 0.75, tone: "mid", desktop: { x: 72, y: 151, width: 20, rotate: 0.4, depth: 22, scale: 1.01, opacity: 0.92, layer: 2 } },
  { id: "memory-09", role: "portrait", src: "/images/off-screen/10.jpg", alt: "Perast waterfront in Montenegro during a family trip", location: "Perast, Montenegro", date: "Aug 2025", caption: ["had a ridiculously good steak here with my family"], aspectRatio: 0.75, tone: "dark", desktop: { x: 10, y: 164, width: 23, rotate: 1.4, depth: -45, scale: 0.91, opacity: 0.86 } },
  { id: "memory-10", role: "supporting", src: "/images/off-screen/8.jpg", alt: "Goethe-Institut building in Taksim, Istanbul", location: "Goethe-Institut, Istanbul", date: "22 Nov 2025", caption: ["where German became real"], aspectRatio: 0.75, tone: "light", desktop: { x: 48, y: 30, width: 16, rotate: -0.5, depth: 24, scale: 0.98, opacity: 0.9 } },
];
