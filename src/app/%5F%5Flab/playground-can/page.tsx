import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: "Playground Can",
};

export default function PlaygroundCanLabPage() {
  return (
    <LabShell
      number="01"
      title="PLAYGROUND CAN"
      purpose="Brushed aluminium can geometry, material, lighting, and future sticker-host testing."
    />
  );
}
