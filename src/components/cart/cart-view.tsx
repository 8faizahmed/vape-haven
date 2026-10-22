"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { calculateTotals } from "@/lib/commerce/pricing";
import { CartLineItem } from "./cart-line-item";
import { FreeDeliveryMeter } from "./free-delivery-meter";
import { OrderSummaryRows } from "./order-summary";

export function CartView() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hasHydrated);
  const subtotal = cartSubtotal(lines);

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
        <ButtonLink href="/checkout" size="lg" className="mt-7 w-full">
          Checkout <ArrowRight className="size-4" />
        </ButtonLink>
        <ButtonLink href="/shop" variant="ghost" size="sm" className="mt-3 w-full">
          Continue shopping
        </ButtonLink>
      </aside>
    </div>
  );
}
