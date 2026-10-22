"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { flyToCart } from "@/components/fx/fly-to-cart";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

type QuickAddProduct = Pick<Product, "id" | "slug" | "name" | "brand" | "price" | "images" | "options" | "inStock">;

const style =
  "flex h-11 w-full items-center justify-center gap-2 bg-ink-950/85 text-[0.62rem] font-semibold tracking-[0.24em] text-gold-100 uppercase backdrop-blur-md transition-colors hover:bg-gold-400 hover:text-ink-950";

/** Adds single-variant products straight to the cart; others link to choose options. */
export function QuickAdd({ product, className }: { product: QuickAddProduct; className?: string }) {
  const add = useCart((s) => s.add);
  const needsChoice = product.options.some((o) => o.values.length > 1);

  if (!product.inStock) return null;

  if (needsChoice) {
    return (
      <Link href={`/products/${product.slug}`} className={cn(style, className)}>
        Choose options
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(style, className)}
      onClick={(e) => {
        const card = e.currentTarget.closest("article");
        flyToCart(card?.querySelector("[data-product-image]"), product.images[0]);
        add(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            image: product.images[0],
            price: product.price,
            options: Object.fromEntries(product.options.map((o) => [o.name, o.values[0]])),
          },
          1,
          { open: false },
        );
      }}
    >
      <Plus className="size-3.5" /> Add to cart
    </button>
  );
}
