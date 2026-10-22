"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

/** Contain keyboard focus while a modal is open, then return it to its trigger. */
export function useDialogFocus(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onEscape?: () => void,
) {
  const escape = useEffectEvent(() => onEscape?.());

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const site = document.getElementById("site");
    const wasInert = site?.inert ?? false;
    if (site) site.inert = true;
    // Focus the panel instead of an input so opening it doesn't summon a phone keyboard.
    const frame = requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") escape();
      if (event.key !== "Tab" || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.matches(":disabled") && element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = items[0];
      const last = items.at(-1);
      if (!first || !last) {
        event.preventDefault();
        ref.current.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      if (site) site.inert = wasInert;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, ref]);
}
