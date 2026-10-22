"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin gold reading-progress line along the bottom edge of the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div aria-hidden style={{ scaleX }} className="bg-gold-gradient absolute inset-x-0 -bottom-px h-px origin-left" />
  );
}
