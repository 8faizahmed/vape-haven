"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Scroll-linked depth for the hero: the scene sinks and zooms while the copy lifts away. */
export function HeroScene({ background, children }: { background: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[calc(100svh-7rem)] items-end overflow-hidden lg:items-center"
    >
      <motion.div style={{ y: sceneY, scale: sceneScale }} className="absolute inset-0 -z-10">
        {background}
      </motion.div>
      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="w-full">
        {children}
      </motion.div>
    </section>
  );
}
