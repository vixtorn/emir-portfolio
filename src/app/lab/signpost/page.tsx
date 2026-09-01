import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";
import SignpostStage from "@/components/lab/signpost/SignpostStage";

export const metadata: Metadata = {
  title: "Signpost",
};

export default function SignpostLabPage() {
  return (
    <LabShell
      number="06"
      title="SIGNPOST"
      purpose="Static production GLB review for camera, lighting, material, and hierarchy validation."
    >
      <SignpostStage />
    </LabShell>
  );
}
