import type { Metadata } from "next";

import LabIndex from "@/components/lab/LabIndex";

export const metadata: Metadata = {
  title: "Interaction Lab",
};

export default function InteractionLabPage() {
  return <LabIndex />;
}
