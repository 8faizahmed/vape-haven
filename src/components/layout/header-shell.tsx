"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DESKTOP_QUERY } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Sticky header that slides away while scrolling down on mobile and returns
 * on any scroll up, like a native app bar. Always visible on desktop.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const desktop = matchMedia(DESKTOP_QUERY);
    let last = scrollY;
    let travel = 0;
    const onScroll = () => {
      const y = scrollY;
      const dy = y - last;
      last = y;
      if (desktop.matches || y < 160) return setHidden(false);
      // Require a little travel in one direction so small jitters don't toggle it.
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      if (travel > 24) setHidden(true);
      else if (travel < -12) setHidden(false);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b hairline bg-ink-900/80 backdrop-blur-xl transition-transform duration-500 ease-luxe",
        hidden && "-translate-y-full",
      )}
    >
      {children}
    </header>
  );
}
