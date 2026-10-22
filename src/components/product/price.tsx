import { cn, formatPrice } from "@/lib/utils";

export function Price({
  price,
  compareAt,
  className,
}: {
  price: number;
  compareAt?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-2 tabular-nums", className)}>
      <span className="text-gold-100">{formatPrice(price)}</span>
      {compareAt && compareAt > price && (
        <s className="text-[0.85em] text-smoke">
          <span className="sr-only">Was </span>
          {formatPrice(compareAt)}
        </s>
      )}
    </span>
  );
}
