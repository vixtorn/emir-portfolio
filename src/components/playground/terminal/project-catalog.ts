export type TerminalProject = {
  aliases: readonly string[];
  focus: readonly string[];
  id: string;
  index: string;
  route?: string;
  stack: readonly string[];
  status: string;
  summary: string;
  title: string;
  type: string;
};

export const terminalProjects: readonly TerminalProject[] = [
  {
    aliases: ["neo"],
    focus: ["3D INTERACTION", "VISUAL SYSTEMS"],
    id: "neodex",
    index: "01",
    stack: ["NEXT.JS", "THREE.JS", "R3F"],
    status: "IN DEVELOPMENT",
    summary: "creative web / 3D interaction",
    title: "NEODEX",
    type: "CREATIVE WEB EXPERIMENT",
  },
  {
    aliases: ["f1", "museum"],
    focus: ["INTERACTIVE ARCHIVE", "EDITORIAL NAVIGATION"],
    id: "f1-museum",
    index: "02",
    stack: ["NEXT.JS", "REACT", "TYPESCRIPT"],
    status: "IN DEVELOPMENT",
    summary: "interactive motorsport archive",
    title: "F1 DIGITAL MUSEUM",
    type: "INTERACTIVE MOTORSPORT ARCHIVE",
  },
  {
    aliases: ["cargo", "playable"],
    focus: ["MOBILE PLAYABLE INTERACTION", "PERFORMANCE / BUNDLE CONSTRAINTS"],
    id: "playable-cargo",
    index: "03",
    stack: ["HTML5", "PIXIJS", "TYPESCRIPT"],
    status: "IN DEVELOPMENT",
    summary: "HTML5 playable experiment",
    title: "PLAYABLE CARGO",
    type: "HTML5 PLAYABLE EXPERIMENT",
  },
] as const;

export function resolveProject(identifier: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  return terminalProjects.find(
    (project) =>
      project.id === normalizedIdentifier ||
      project.aliases.includes(normalizedIdentifier),
  );
}
