"use client";

import { useMediaQuery } from "@/lib/use-media-query";

/** True on mouse/trackpad devices without a reduced-motion preference. */
export function useFinePointer() {
  return useMediaQuery("(pointer: fine) and (prefers-reduced-motion: no-preference)");
}
