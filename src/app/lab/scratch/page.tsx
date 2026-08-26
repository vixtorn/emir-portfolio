import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";
import ScratchBoardingPassLab from "@/components/playground/scratch/ScratchBoardingPassLab";

export const metadata: Metadata = {
  title: "Scratch Boarding Pass",
};

export default function ScratchLabPage() {
  return (
    <LabShell
      number="03"
      title="SCRATCH BOARDING PASS"
      purpose="Exact-panel Canvas scratching with a temporary technical unlock reveal."
    >
      <ScratchBoardingPassLab />
    </LabShell>
  );
}
