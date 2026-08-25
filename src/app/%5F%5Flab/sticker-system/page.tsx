import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";
import StickerSystemSpike from "@/components/playground/stickers/StickerSystemSpike";

export const metadata: Metadata = {
  title: "Sticker System",
};

export default function StickerSystemLabPage() {
  return (
    <LabShell
      number="02"
      title="STICKER SYSTEM"
      purpose="Raycast-constrained curved sticker drag on a simple cylindrical surface."
    >
      <StickerSystemSpike />
    </LabShell>
  );
}
