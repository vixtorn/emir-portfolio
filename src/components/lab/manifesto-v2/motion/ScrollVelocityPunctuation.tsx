"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

export default function ScrollVelocityPunctuation({ children, className }: { children: string; className?: string }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const x = useTransform(smoothVelocity, [-2500, 0, 2500], [-40, 0, 40], { clamp: true });

  return <motion.p className={className} style={{ x }}>{children}</motion.p>;
}
