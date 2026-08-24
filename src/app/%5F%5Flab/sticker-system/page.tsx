import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: "Sticker System",
};

export default function StickerSystemLabPage() {
  return (
    <LabShell
      number="02"
      title="STICKER SYSTEM"
      purpose="Cylindrical sticker projection, drag constraints, overlap, and settle behavior."
    />
  );
}
