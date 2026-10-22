"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DESKTOP_QUERY } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Browser navigation stays visible. Installed apps can hide their logo header
 * while scrolling because their navigation remains in the bottom tab bar.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const desktop = matchMedia(DESKTOP_QUERY);
    const standalone = matchMedia("(display-mode: standalone)");
    let last = scrollY;
    let travel = 0;
    const onScroll = () => {
      const y = scrollY;
      const dy = y - last;
      last = y;
      if (desktop.matches || !standalone.matches || y < 160) return setHidden(false);
      // Require a little travel in one direction so small jitters don't toggle it.
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      if (travel > 24) setHidden(true);
      else if (travel < -12) setHidden(false);
    };
    const reset = () => {
      last = scrollY;
      travel = 0;
      setHidden(false);
    };
    addEventListener("scroll", onScroll, { passive: true });
    standalone.addEventListener("change", reset);
    desktop.addEventListener("change", reset);
    return () => {
      removeEventListener("scroll", onScroll);
      standalone.removeEventListener("change", reset);
      desktop.removeEventListener("change", reset);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b hairline bg-ink-900/80 backdrop-blur-xl transition-transform duration-500 ease-luxe",
        hidden && "-translate-y-full lg:translate-y-0",
      )}
    >
      {children}
    </header>
  );
}
