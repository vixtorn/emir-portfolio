import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: "Memory",
};

export default function MemoryLabPage() {
  return (
    <LabShell
      number="05"
      title="MEMORY"
      purpose="Off Screen spatial photography spiral, tube, and gallery interaction studies."
    />
  );
}
