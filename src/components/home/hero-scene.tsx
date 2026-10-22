"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";

/** Scroll-linked depth for the hero: the scene sinks and zooms while the copy lifts away. */
export function HeroScene({ background, overlay, children }: { background: ReactNode; overlay?: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const measure = () => {
      section.style.setProperty("--hero-top", `${section.getBoundingClientRect().top + scrollY}px`);
    };
    const observer = new ResizeObserver(measure);
    for (const element of document.querySelectorAll('header, aside[aria-label="Health warning"]')) observer.observe(element);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", desktop ? "18%" : "6%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, desktop ? 1.12 : 1.04]);
  // A tall phone hero must remain readable all the way to its bottom edge.
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", desktop ? "-22%" : "0%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, desktop ? 0 : 1]);

  return (
    <section
      ref={ref}
      className="mobile-hero relative isolate flex items-end overflow-hidden lg:items-center"
    >
      <motion.div style={{ y: reducedMotion ? 0 : sceneY, scale: reducedMotion ? 1 : sceneScale }} className="absolute inset-0 -z-10">
        {background}
      </motion.div>
      {overlay}
      <motion.div style={{ y: reducedMotion ? 0 : copyY, opacity: reducedMotion ? 1 : copyOpacity }} className="w-full">
        {children}
      </motion.div>
    </section>
  );
}
