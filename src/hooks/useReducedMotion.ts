"use client";

import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(reducedMotionQuery).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(reducedMotionQuery);
    const updatePreference = () => setReduced(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);

    return () => query.removeEventListener("change", updatePreference);
  }, []);

  return reduced;
}
