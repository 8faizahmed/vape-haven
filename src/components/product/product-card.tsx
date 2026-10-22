import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { Tilt } from "@/components/fx/tilt";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";
import { Price } from "./price";
import { ProductBadge } from "./product-badge";
import { QuickAdd } from "./quick-add";

function optionSummary(product: Product) {
  const main = product.options.find((o) => o.values.length > 1);
  if (!main) return product.highlights[0] ?? "";
  const noun = main.name.toLowerCase().replace(/^pod /, "");
  return `${main.values.length} ${noun === "flavour" ? "flavours" : `${noun} options`}`;
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const href = `/products/${product.slug}`;
  return (
    <article className={cn("group relative flex flex-col transition-transform duration-200 active:scale-[0.98] lg:active:scale-100", className)}>
      <Tilt className="aspect-square overflow-hidden border hairline bg-ink-950 transition-colors duration-500 group-hover:border-gold-400/40">
        <Link href={href} aria-label={product.name} data-cursor="view" data-product-image className="absolute inset-0">
          <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
              className={cn(
                "object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]",
                !product.inStock && "opacity-50 grayscale-[40%]",
              )}
            />
          </ViewTransition>
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {!product.inStock && <span className="border border-ink-500 bg-ink-950/80 px-2.5 py-1 text-[0.55rem] font-bold tracking-[0.26em] text-mist uppercase">Sold out</span>}
          {product.inStock && product.badges?.map((b) => <ProductBadge key={b} badge={b} />)}
        </div>
        <div className="absolute right-2.5 bottom-2.5 lg:hidden">
          <QuickAdd product={product} variant="round" />
        </div>
        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full transition-transform duration-500 ease-luxe group-focus-within:translate-y-0 group-hover:translate-y-0 lg:block">
          <QuickAdd product={product} />
        </div>
      </Tilt>

      <div className="mt-4 min-w-0">
        <p className="text-[0.6rem] font-semibold tracking-[0.28em] text-gold-300 uppercase">{product.brand}</p>
        <h3 className="mt-1.5 font-display text-xl leading-tight text-cream sm:text-[1.35rem]">
          <Link href={href} className="transition-colors hover:text-gold-200">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <Price price={product.price} compareAt={product.compareAtPrice} className="text-sm" />
          <p className="line-clamp-1 text-xs text-smoke">{optionSummary(product)}</p>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4", className)}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
