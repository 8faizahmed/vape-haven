"use client";

import { useSyncExternalStore } from "react";

/** Live result of a CSS media query. Always false during server rendering. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

/** Desktop layout breakpoint (Tailwind `lg`). Below it the site runs as a mobile app shell. */
export const DESKTOP_QUERY = "(min-width: 64rem)";
