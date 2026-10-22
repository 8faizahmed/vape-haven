"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { AGE_VERIFIED_EVENT } from "@/lib/age-gate";
import { isScrollLocked, SCROLL_LOCK_EVENT } from "@/lib/scroll-lock";

/** Inertial wheel scrolling on desktop. Touch devices keep native scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !matchMedia("(pointer: fine)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: true,
      prevent: (node) => node.closest("[data-lenis-prevent], [role=dialog]") !== null,
    });

    const sync = () => {
      const verified = document.documentElement.dataset.ageVerified === "true";
      if (!verified || isScrollLocked()) lenis.stop();
      else lenis.start();
    };
    sync();
    window.addEventListener(SCROLL_LOCK_EVENT, sync);
    window.addEventListener(AGE_VERIFIED_EVENT, sync);
    return () => {
      window.removeEventListener(SCROLL_LOCK_EVENT, sync);
      window.removeEventListener(AGE_VERIFIED_EVENT, sync);
      lenis.destroy();
    };
  }, []);

  return null;
}
