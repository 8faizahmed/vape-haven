"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode, type RefObject } from "react";

/**
 * Sticky action bar pinned to the bottom of phone layouts (above the tab bar
 * in the installed app) whenever the page's own call to action (`anchor`) is
 * off screen. Hidden on desktop.
 */
export function MobileActionBar({ anchor, children }: { anchor: RefObject<HTMLElement | null>; children: ReactNode }) {
  const [show, setShow] = useState(false);

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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          // Sits on the installed app's tab bar, or pads the home indicator in a browser.
          className="fixed inset-x-0 bottom-[var(--tabbar-space)] z-30 border-t hairline bg-ink-900/90 pt-3 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(0.75rem,calc(0.75rem+env(safe-area-inset-bottom)-var(--tabbar-space)))] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-xl lg:hidden"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
