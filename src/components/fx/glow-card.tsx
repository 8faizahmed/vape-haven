"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card with a soft gold light that follows the cursor across its surface. */
export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={cn("group/glow relative isolate overflow-hidden", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/glow:opacity-100"
        style={{
          background: "radial-gradient(420px circle at var(--x) var(--y), rgb(212 171 85 / 0.14), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
