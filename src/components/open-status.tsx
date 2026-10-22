"use client";

import { useSyncExternalStore } from "react";
import { openStatus } from "@/lib/hours";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

const snapshot = () => {
  const s = openStatus();
  return `${s.open ? 1 : 0}|${s.label}`;
};

/** Live "Open now · until 9 PM" pill, computed in the store's time zone. */
export function OpenStatus({ className }: { className?: string }) {
  const value = useSyncExternalStore(subscribe, snapshot, () => null);
  const [flag, label] = value?.split("|") ?? [];
  const open = flag === "1";

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2.5 rounded-full border border-gold-400/25 bg-ink-950/60 px-3.5 text-[0.68rem] font-medium tracking-wide text-cream backdrop-blur-md transition-opacity duration-500",
        value ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <span className="relative flex size-2">
        {open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />}
        <span className={cn("relative size-2 rounded-full", open ? "bg-emerald-400" : "bg-smoke")} />
      </span>
      {label ?? "Checking hours"}
    </span>
  );
}
