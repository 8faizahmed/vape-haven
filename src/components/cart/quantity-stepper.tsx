"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_LINE_QUANTITY } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const button =
    "flex h-full items-center justify-center text-mist transition-colors hover:text-gold-200 disabled:opacity-30";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center border hairline",
        size === "sm" ? "h-9 w-[6.5rem]" : "h-12 w-32",
      )}
    >
      <button type="button" aria-label="Decrease quantity" className={cn(button, "w-1/3")} disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="size-3.5" />
      </button>
      <span aria-live="polite" className="w-1/3 text-center text-sm tabular-nums">
        {value}
      </span>
      <button type="button" aria-label="Increase quantity" className={cn(button, "w-1/3")} disabled={value >= MAX_LINE_QUANTITY} onClick={() => onChange(value + 1)}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
