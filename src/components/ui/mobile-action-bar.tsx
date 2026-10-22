"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Portal } from "@/components/ui/portal";

/**
 * Sticky action bar pinned to the bottom of phone layouts (above the tab bar
 * in the installed app) whenever the page's own call to action (`anchor`) is
 * off screen. Hidden on desktop.
 *
 * It renders at the end of <body>: the page content gets a CSS filter while
 * overlays are open, which would otherwise re-anchor this fixed bar to the
 * page. Buttons that submit a form need a `form` attribute for the same reason.
 */
export function MobileActionBar({ anchor, children }: { anchor: RefObject<HTMLElement | null>; children: ReactNode }) {
  const [show, setShow] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    // The bottom of the viewport is covered by the tab bar and this bar.
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), {
      rootMargin: "0px 0px -144px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [anchor]);

  // Publish the bar's height so the floating browser menu button can sit above it.
  useEffect(() => {
    const el = bar.current;
    const root = document.documentElement;
    if (!show || !el) return;
    const ro = new ResizeObserver(() => root.style.setProperty("--action-bar-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--action-bar-h");
    };
  }, [show]);

  return (
    <Portal>
      <AnimatePresence>
        {show && (
          <motion.div
            ref={bar}
            // Sits on the installed app's tab bar, or pads the home indicator in a browser.
            className="page-layer fixed inset-x-0 bottom-[var(--tabbar-space)] z-30 border-t hairline bg-ink-900/90 pt-3 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(0.75rem,calc(0.75rem+env(safe-area-inset-bottom)-var(--tabbar-space)))] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-xl lg:hidden"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
