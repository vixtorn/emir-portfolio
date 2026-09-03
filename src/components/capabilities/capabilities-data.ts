export type CapabilityGroup = {
  id: "create" | "design" | "build" | "think";
  index: "01" | "02" | "03" | "04";
  label: string;
  items: string[];
};

export const capabilityGroups: CapabilityGroup[] = [
  { id: "create", index: "01", label: "CREATE", items: ["Creative Development", "Interaction Design", "Motion", "Shaders", "WebGL"] },
  { id: "design", index: "02", label: "DESIGN", items: ["Visual Direction", "UI/UX", "Typography", "Figma", "Photoshop", "Blender"] },
  { id: "build", index: "03", label: "BUILD", items: ["React", "Next.js", "TypeScript", ".NET / C#", "REST", "SQL", "Vercel"] },
  { id: "think", index: "04", label: "THINK", items: ["Product Thinking", "UX Reasoning", "Prototyping", "Feature Discovery", "Experimentation"] },
];
