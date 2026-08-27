import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";

export const metadata: Metadata = {
  title: "Signpost",
};

export default function SignpostLabPage() {
  return (
    <LabShell
      number="06"
      title="SIGNPOST"
      purpose="Blender signpost integration, 3D navigation, and GPU lifecycle testing."
    />
  );
}
