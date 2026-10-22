"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** Oversized outlined wordmark that fills with gold as the footer scrolls into view. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const clipPath = useTransform(scrollYProgress, [0.1, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const type =
    "block pb-[3vw] text-center font-display text-[17.5vw] leading-[0.9] font-medium tracking-[-0.02em] whitespace-nowrap";

  return (
    <div ref={ref} aria-hidden className="relative mt-16 overflow-hidden select-none">
      <span className={`${type} text-outline`}>Vape Haven</span>
      <motion.span style={{ clipPath }} className={`${type} text-gold-gradient absolute inset-0`}>
        Vape Haven
      </motion.span>
    </div>
  );
}
