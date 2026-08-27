import type { Metadata } from "next";

import LabShell from "@/components/lab/LabShell";
import PlaygroundTerminal from "@/components/playground/terminal/PlaygroundTerminal";

export const metadata: Metadata = {
  title: "Playground Terminal",
};

export default function PlaygroundTerminalLabPage() {
  return (
    <LabShell
      number="07"
      title="PLAYGROUND TERMINAL"
      purpose="Keyboard input, curated commands, command history, and focused terminal-object behavior."
    >
      <PlaygroundTerminal />
    </LabShell>
  );
}
