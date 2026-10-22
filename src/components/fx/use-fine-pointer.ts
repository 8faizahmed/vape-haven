"use client";

import { useMediaQuery } from "@/lib/use-media-query";

/** Desktop hover effects stay off phone/tablet layouts, including with a paired mouse. */
export function useFinePointer() {
  return useMediaQuery("(min-width: 64rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
}
