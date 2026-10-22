"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useReducedMotion();
  const visible = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: desktop ? 28 : 14 }}
      animate={reducedMotion ? visible : undefined}
      whileInView={visible}
      viewport={{ once: true, margin: desktop ? "-60px" : "-20px" }}
      transition={{ duration: reducedMotion ? 0 : desktop ? 0.9 : 0.5, delay: reducedMotion ? 0 : desktop ? delay : Math.min(delay, 0.12), ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
