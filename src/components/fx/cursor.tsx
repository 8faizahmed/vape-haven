"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "./use-fine-pointer";

type Variant = "default" | "link" | "view" | "text" | "hidden";

const INTERACTIVE = "a, button, [role=button], label, summary, select";
const TEXT = "input, textarea, [contenteditable=true]";

/**
 * Gold cursor: a precise dot plus a trailing ring that grows over links and
 * shows "View" over anything marked data-cursor="view". Desktop only.
 */
export function Cursor() {
  const enabled = useFinePointer();
  const [variant, setVariant] = useState<Variant>("hidden");
  const [pressed, setPressed] = useState(false);
  const current = useRef<Variant>("hidden");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const set = (v: Variant) => {
      if (current.current !== v) {
        current.current = v;
        setVariant(v);
      }
    };
    const classify = (target: Element | null) => {
      if (target?.closest("[data-cursor=view]")) set("view");
      else if (target?.closest(TEXT)) set("text");
      else if (target?.closest(INTERACTIVE)) set("link");
      else set("default");
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      classify(e.target as Element | null);
    };
    // Content moves under a still pointer when scrolling or navigating — re-check it.
    let frame = 0;
    const onScroll = () => {
      if (current.current === "hidden" || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        classify(document.elementFromPoint(x.get(), y.get()));
      });
    };
    const onLeave = () => set("hidden");
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ring = {
    default: "size-9 border-gold-300/50",
    link: "size-14 border-gold-300 bg-gold-400/10",
    view: "size-24 border-transparent bg-gold-300/95",
    text: "size-2 border-transparent bg-transparent",
    hidden: "size-0 border-transparent",
  }[variant];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300]">
      <motion.div style={{ x: ringX, y: ringY }} className="absolute top-0 left-0">
        <div
          className={cn(
            "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color,scale] duration-300 ease-luxe",
            ring,
            pressed && "scale-90",
          )}
        >
          <span
            className={cn(
              "text-[0.6rem] font-bold tracking-[0.24em] text-ink-950 uppercase transition-opacity duration-200",
              variant === "view" ? "opacity-100" : "opacity-0",
            )}
          >
            View
          </span>
        </div>
      </motion.div>
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <div
          className={cn(
            "size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-200 transition-opacity duration-200",
            (variant === "view" || variant === "hidden") && "opacity-0",
          )}
        />
      </motion.div>
    </div>
  );
}
