import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isConfigured = false;

export function configureGsap() {
  if (typeof window === "undefined" || isConfigured) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Lenis is driven by GSAP's ticker. Disabling lag smoothing keeps their
  // clocks aligned after a tab resumes or a frame stalls.
  gsap.ticker.lagSmoothing(0);
  isConfigured = true;
}

export { gsap, ScrollTrigger };
