import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";
import ScratchBoardingPassLab from "@/components/playground/scratch/ScratchBoardingPassLab";

export const metadata: Metadata = {
  title: "Scratch",
};

export default function ScratchLabPage() {
  return (
    <LabShell
      number="03"
      title="SCRATCH"
      purpose="Scratchable boarding-pass masking, completion detection, and rare-sticker unlock state."
    >
      <ScratchBoardingPassLab />
    </LabShell>
  );
}
