// Placeholder wordmark until the client's logo arrives. To swap in the real
// logo, drop the SVG in /public/brand and render it with next/image here.

import { cn } from "@/lib/utils";

export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("text-gold-300", className)}>
      <path d="M20 1.5 38.5 20 20 38.5 1.5 20Z" fill="none" stroke="currentColor" strokeWidth="1" pathLength={1} />
      <path d="M20 6 34 20 20 34 6 20Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" pathLength={1} />
      <text
        x="20"
        y="24.2"
        textAnchor="middle"
        fill="currentColor"
        fontSize="11.5"
        letterSpacing="0.6"
        style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600 }}
      >
        VH
      </text>
    </svg>
  );
}

export function Logo({ className, emblem = true }: { className?: string; emblem?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {emblem && <Emblem className="size-9 shrink-0" />}
      <span className="flex flex-col items-center leading-none">
        <span className="font-display text-[1.3rem] font-medium uppercase tracking-[0.26em] text-cream">
          Vape Haven
        </span>
        <span className="mt-1 flex items-center gap-2 text-[0.55rem] font-semibold tracking-[0.55em] text-gold-300">
          <span className="h-px w-4 bg-gold-400/60" />
          369
          <span className="h-px w-4 bg-gold-400/60" />
        </span>
      </span>
    </span>
  );
}
