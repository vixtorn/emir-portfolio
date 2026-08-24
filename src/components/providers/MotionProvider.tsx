"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { configureGsap, gsap, ScrollTrigger } from "@/lib/motion/gsap";

type ScrollTarget = number | string | HTMLElement;

type MotionContextValue = {
  reducedMotion: boolean;
  scrollTo: (target: ScrollTarget) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function useMotion() {
  const context = useContext(MotionContext);

  if (!context) {
    throw new Error("useMotion must be used within a MotionProvider.");
  }

  return context;
}

export default function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  const scrollTo = useCallback((target: ScrollTarget) => {
    const lenis = lenisRef.current;

    if (lenis) {
      lenis.scrollTo(target);
      return;
    }

    if (typeof target === "number") {
      window.scrollTo({ top: target });
      return;
    }

    const element =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;

    element?.scrollIntoView();
  }, []);

  useEffect(() => {
    configureGsap();

    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    const unsubscribeScroll = lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      unsubscribeScroll();
      lenis.destroy();

      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, [reducedMotion]);

  const value = useMemo(
    () => ({ reducedMotion, scrollTo }),
    [reducedMotion, scrollTo],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
