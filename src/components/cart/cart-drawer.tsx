"use client";

import { ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { cartCount, cartSubtotal, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { CartLineItem } from "./cart-line-item";
import { FreeDeliveryMeter } from "./free-delivery-meter";

export function CartDrawer() {
  const { lines, isOpen, close } = useCart();
  const subtotal = cartSubtotal(lines);

  return (
    <Sheet
      open={isOpen}
      onClose={close}
      label="Shopping cart"
      title={
        <>
          Your cart <span className="text-base text-smoke">({cartCount(lines)})</span>
        </>
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-14 text-center">
          <ShoppingBag className="size-10 text-gold-400/60" strokeWidth={1} />
          <p className="mt-6 font-display text-3xl">Your cart is empty</p>
          <p className="mt-3 text-sm text-mist">Explore our collection to find your next device.</p>
          <ButtonLink href="/shop" onClick={close} className="mt-8">
            Shop the collection
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="border-b hairline px-6 py-4">
            <FreeDeliveryMeter subtotal={subtotal} />
          </div>
          <ul
            data-lenis-prevent
            className="min-h-0 flex-1 divide-y divide-gold-400/10 overflow-y-auto overscroll-contain px-6"
          >
            {lines.map((line) => (
              <CartLineItem key={line.key} line={line} onNavigate={close} />
            ))}
          </ul>
          <footer className="border-t hairline px-6 pt-5 pb-6 lg:py-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold tracking-[0.24em] text-mist uppercase">Subtotal</span>
              <span className="font-display text-2xl text-gold-100 tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1.5 text-xs text-smoke">HST and delivery are calculated at checkout.</p>
            <div className="mt-5 grid gap-3 lg:mt-6">
              <ButtonLink href="/checkout" onClick={close} size="lg">
                Checkout
              </ButtonLink>
              <ButtonLink href="/cart" onClick={close} variant="outline">
                View cart
              </ButtonLink>
            </div>
          </footer>
        </>
      )}
    </Sheet>
  );
}
