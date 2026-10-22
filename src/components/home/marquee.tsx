import { cn } from "@/lib/utils";

const benefits = [
  "Adults 19+ only",
  "Same-day pickup",
  "Windsor–Essex delivery",
  "Authentic products",
  "Expert advice in store",
  "Battery & device recycling",
];

const categories = ["Disposables", "Pod systems", "E-liquids", "Advanced kits", "Coils & pods", "Accessories"];

function Row({ items, reverse, outline }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  return (
    <div className={cn("animate-marquee flex w-max", reverse && "[animation-direction:reverse]")}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0">
          {items.map((item) => (
            <span
              key={item}
              className={cn(
                "flex items-center gap-10 pr-10 font-display whitespace-nowrap",
                outline
                  ? "text-outline text-5xl font-medium tracking-tight uppercase sm:text-7xl"
                  : "text-2xl text-gold-200/85 italic sm:text-3xl",
              )}
            >
              {item}
              <span className={cn("rotate-45 bg-gold-400/70", outline ? "size-2.5" : "size-1.5")} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div aria-hidden className="relative grid gap-5 overflow-hidden border-y hairline bg-ink-950 py-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
      <Row items={benefits} />
      <Row items={categories} reverse outline />
    </div>
  );
}
