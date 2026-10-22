"use client";

import { Check, IdCard, Store, Truck } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Button } from "@/components/ui/button";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { siteConfig } from "@/config/site";
import { flyToCart } from "@/components/fx/fly-to-cart";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/commerce/types";
import { cn, formatPrice } from "@/lib/utils";

export function ProductPurchase({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const actions = useRef<HTMLDivElement>(null);
  const barImage = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]])),
  );

  const handleAdd = (source: Element | null = document.querySelector("[data-gallery-image]")) => {
    flyToCart(source, product.images[0]);
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: product.price,
        options: selected,
      },
      quantity,
      { open: false },
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      {product.options.map((option) => (
        <fieldset key={option.name}>
          <legend className="flex w-full items-baseline justify-between text-[0.65rem] font-semibold tracking-[0.26em] text-mist uppercase">
            {option.name}
            <span className="font-sans text-xs tracking-normal text-gold-200 normal-case">{selected[option.name]}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const active = selected[option.name] === value;
              return (
                <label
                  key={value}
                  className={cn(
                    "cursor-pointer border px-4 py-2.5 text-sm transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-gold-300",
                    active
                      ? "border-gold-300 bg-gold-400/10 text-gold-100"
                      : "border-ink-500 text-mist hover:border-gold-400/50 hover:text-cream",
                  )}
                >
                  <input
                    type="radio"
                    name={option.name}
                    value={value}
                    checked={active}
                    onChange={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                    className="sr-only"
                  />
                  {value}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div ref={actions} className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Button
          size="lg"
          onClick={() => handleAdd()}
          disabled={!product.inStock}
          className="min-w-0 flex-1 basis-56"
        >
          {!product.inStock ? (
            "Sold out"
          ) : added ? (
            <>
              <Check className="size-4" /> Added to cart
            </>
          ) : (
            <>Add to cart · {formatPrice(product.price * quantity)}</>
          )}
        </Button>
      </div>

      {product.inStock && (
        <MobileActionBar anchor={actions}>
          <div className="flex items-center gap-3">
            <span ref={barImage} className="relative size-11 shrink-0 overflow-hidden border hairline bg-ink-950">
              <Image src={product.images[0]} alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-lg leading-tight">{product.name}</span>
              <span className="block truncate text-xs text-smoke">
                {[...Object.values(selected), quantity > 1 && `× ${quantity}`].filter(Boolean).join(" · ") ||
                  formatPrice(product.price)}
              </span>
            </span>
            <Button size="sm" onClick={() => handleAdd(barImage.current)} className="shrink-0 px-4">
              {added ? <Check className="size-4" /> : <>Add · {formatPrice(product.price * quantity)}</>}
            </Button>
          </div>
        </MobileActionBar>
      )}

      <ul className="grid gap-4 border-y hairline py-6 text-sm">
        <li className="flex gap-4">
          <Store className="mt-0.5 size-4 shrink-0 text-gold-300" strokeWidth={1.5} />
          <span>
            <span className="text-cream">{siteConfig.fulfillment.pickup.label} — free.</span>{" "}
            <span className="text-mist">{siteConfig.fulfillment.pickup.description}</span>
          </span>
        </li>
        <li className="flex gap-4">
          <Truck className="mt-0.5 size-4 shrink-0 text-gold-300" strokeWidth={1.5} />
          <span>
            <span className="text-cream">
              {siteConfig.fulfillment.delivery.label} — {formatPrice(siteConfig.fulfillment.delivery.fee)}, free over{" "}
              {formatPrice(siteConfig.fulfillment.delivery.freeOver)}.
            </span>{" "}
            <span className="text-mist">Windsor–Essex only.</span>
          </span>
        </li>
        <li className="flex gap-4">
          <IdCard className="mt-0.5 size-4 shrink-0 text-gold-300" strokeWidth={1.5} />
          <span className="text-mist">
            Must be {siteConfig.legalAge}+. Photo ID matching the order name is checked on every pickup and delivery.
          </span>
        </li>
      </ul>
    </div>
  );
}
