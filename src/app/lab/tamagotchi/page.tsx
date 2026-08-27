import type { Metadata } from "next";
import LabShell from "@/components/lab/LabShell";
import TamagotchiSpike from "@/components/playground/tamagotchi/TamagotchiSpike";
export const metadata: Metadata = { title: "Playground Tamagotchi" };
export default function TamagotchiLabPage() { return <LabShell number="08" title="PLAYGROUND TAMAGOTCHI" purpose="Raw GLB integration, original material evaluation, and collectible idle-motion testing."><TamagotchiSpike /></LabShell>; }
