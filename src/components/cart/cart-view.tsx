"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/button";
import { MobileActionBar } from "@/components/ui/mobile-action-bar";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { calculateTotals } from "@/lib/commerce/pricing";
import { CartLineItem } from "./cart-line-item";
import { FreeDeliveryMeter } from "./free-delivery-meter";
import { OrderSummaryRows } from "./order-summary";

export function CartView() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hasHydrated);
  const subtotal = cartSubtotal(lines);
  const checkout = useRef<HTMLAnchorElement>(null);

  if (!hydrated) return <div className="h-96 animate-pulse border hairline bg-ink-850" />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center border hairline px-6 py-24 text-center">
        <ShoppingBag className="size-10 text-gold-400/60" strokeWidth={1} />
        <p className="mt-6 font-display text-4xl">Your cart is empty</p>
        <p className="mt-3 text-sm text-mist">Find your next device, e-liquid or accessory.</p>
        <ButtonLink href="/shop" className="mt-10">
          Shop the collection
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
      <ul className="divide-y divide-gold-400/10 border-y hairline">
        {lines.map((line) => (
          <CartLineItem key={line.key} line={line} />
        ))}
      </ul>
      <aside className="h-fit border hairline bg-ink-850 p-7 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl">Order summary</h2>
        <div className="mt-6">
          <FreeDeliveryMeter subtotal={subtotal} />
        </div>
        <div className="mt-6">
          <OrderSummaryRows totals={calculateTotals(subtotal, "pickup")} shippingLabel="In-store pickup" />
        </div>
        <p className="mt-3 text-xs text-smoke">Choose pickup or local delivery at checkout.</p>
        <ButtonLink ref={checkout} href="/checkout" size="lg" className="mt-7 w-full">
          Checkout <ArrowRight className="size-4" />
        </ButtonLink>
        <ButtonLink href="/shop" variant="ghost" size="sm" className="mt-3 w-full">
          Continue shopping
        </ButtonLink>
      </aside>

      <MobileActionBar anchor={checkout}>
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6rem] font-semibold tracking-[0.24em] text-smoke uppercase">Subtotal</p>
            <p className="font-display text-2xl leading-tight text-gold-100 tabular-nums">{formatPrice(subtotal)}</p>
          </div>
          <ButtonLink href="/checkout">
            Checkout <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </MobileActionBar>
    </div>
  );
}
