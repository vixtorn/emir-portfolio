import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: "Work Stack",
};

export default function WorkStackLabPage() {
  return (
    <LabShell
      number="04"
      title="WORK STACK"
      purpose="Selected Work stack depth, scroll choreography, and project-card transitions."
    />
  );
}
