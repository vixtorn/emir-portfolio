"use client";

import { useState } from "react";

import StickerSystemSpike from "./StickerSystemSpike";

export default function StickerSystemLabHarness() {
  const [rareUnlocked, setRareUnlocked] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setRareUnlocked(true)}
        disabled={rareUnlocked}
      >
        {rareUnlocked ? "RARE UNLOCKED" : "UNLOCK RARE"}
      </button>
      <StickerSystemSpike rareUnlocked={rareUnlocked} />
    </>
  );
}
