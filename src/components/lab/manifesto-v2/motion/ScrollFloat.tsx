"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";

import { configureGsap, gsap } from "@/lib/motion/gsap";

type ScrollFloatProps = { children: ReactNode; className?: string; strength?: "soft" | "strong" };

export default function ScrollFloat({ children, className, strength = "soft" }: ScrollFloatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    configureGsap();
    const element = ref.current;
    const context = gsap.context(() => {
      gsap.fromTo(element, { opacity: 0.58, scaleX: 0.97, scaleY: strength === "strong" ? 1.1 : 1.06, yPercent: 8 }, {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: element, start: "top 78%", end: "top 38%", scrub: true },
      });
    }, element);
    return () => context.revert();
  }, [strength]);

  return <div ref={ref} className={className}>{children}</div>;
}
