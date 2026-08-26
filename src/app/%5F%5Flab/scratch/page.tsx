import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";
import BoardingPassFoil from "@/components/playground/scratch/BoardingPassFoil";

export const metadata: Metadata = {
  title: "Boarding Pass Foil",
};

export default function ScratchLabPage() {
  return (
    <LabShell
      number="03"
      title="BOARDING PASS FOIL"
      purpose="Pointer-reactive iridescent foil treatment for the Playground boarding pass asset."
    >
      <BoardingPassFoil />
    </LabShell>
  );
}
