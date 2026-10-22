import type { ProductBadge as Badge } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

const labels: Record<Badge, string> = {
  new: "New",
  bestseller: "Best seller",
  limited: "Limited",
};

export function ProductBadge({ badge, className }: { badge: Badge; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-[0.55rem] font-bold tracking-[0.26em] uppercase backdrop-blur",
        badge === "new" ? "bg-gold-gradient border-transparent text-ink-950" : "border-gold-400/40 bg-ink-950/70 text-gold-200",
        className,
      )}
    >
      {labels[badge]}
    </span>
  );
}
