import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";
import KeychainSpike from "@/components/playground/keychain/KeychainSpike";

export const metadata: Metadata = {
  title: "Playground Keychain",
};

export default function PlaygroundKeychainLabPage() {
  return (
    <LabShell
      number="08"
      title="PLAYGROUND KEYCHAIN"
      purpose="Raw Raze chibi GLB integration and a top-pivot damped-pendulum interaction."
    >
      <KeychainSpike />
    </LabShell>
  );
}
