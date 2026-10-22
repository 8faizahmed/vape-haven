"use client";

import { Check, IdCard, Mail, Store, Truck } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { OrderSummaryRows } from "@/components/cart/order-summary";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useCart, type CartLine } from "@/lib/cart-store";
import type { FulfillmentMethod, OrderTotals } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils";
import { LAST_ORDER_KEY } from "./checkout-form";

type StoredOrder = {
  orderId: string;
  totals: OrderTotals;
  fulfillment: FulfillmentMethod;
  firstName: string;
  email: string;
  lines: CartLine[];
};

const noop = () => () => {};

export function OrderConfirmation() {
  const orderId = useSearchParams().get("order");
  const raw = useSyncExternalStore(noop, () => sessionStorage.getItem(LAST_ORDER_KEY), () => null);
  const stored = raw ? (JSON.parse(raw) as StoredOrder) : null;
  const order = stored && stored.orderId === orderId ? stored : null;

  // The order went through, so empty the cart (payment may have happened off-site).
  // Waits for the persisted cart to load so rehydration can't restore old lines.
  const hydrated = useCart((s) => s.hasHydrated);
  const confirmedId = order?.orderId;
  useEffect(() => {
    if (hydrated && confirmedId) useCart.getState().clear();
  }, [hydrated, confirmedId]);

  const { contact, fulfillment } = siteConfig;
  const pickup = order?.fulfillment !== "delivery";

  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="mx-auto flex size-20 items-center justify-center rounded-full border border-gold-300/60 text-gold-200">
        <Check className="size-8" strokeWidth={1.25} />
      </span>
      <p className="eyebrow mt-10">Order {orderId ?? "received"}</p>
      <h1 className="mt-5 font-display text-5xl leading-[1] font-medium sm:text-6xl">
        Thank you{order?.firstName ? `, ${order.firstName}` : ""}.
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-mist">
        {pickup
          ? "We're preparing your order now. We'll email you as soon as it's ready for pickup — usually within the hour."
          : "We're preparing your order for local delivery. We'll email you with a delivery window shortly."}
      </p>
      {siteConfig.demoMode && (
        <p className="mx-auto mt-6 max-w-lg border border-dashed border-gold-400/30 px-5 py-3 text-xs text-gold-200/90">
          Demo storefront — this order was not sent to the store and no payment was taken.
        </p>
      )}

      <div className="mt-14 grid gap-px border hairline bg-gold-400/15 text-left sm:grid-cols-3">
        {[
          { icon: Mail, title: "Confirmation", body: order?.email ? `Sent to ${order.email}` : "Check your inbox" },
          pickup
            ? { icon: Store, title: "Pickup", body: `${contact.address.street}, ${contact.address.city}` }
            : { icon: Truck, title: "Delivery", body: fulfillment.delivery.description },
          { icon: IdCard, title: "Bring ID", body: `Valid photo ID, ${siteConfig.legalAge}+, matching the order name` },
        ].map((item) => (
          <div key={item.title} className="bg-ink-900 p-6">
            <item.icon className="size-5 text-gold-300" strokeWidth={1.25} />
            <p className="mt-4 font-display text-xl">{item.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-mist">{item.body}</p>
          </div>
        ))}
      </div>

      {order && (
        <div className="mt-10 border hairline bg-ink-850 p-7 text-left">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-6 grid gap-4">
            {order.lines.map((line) => (
              <li key={line.key} className="flex items-center gap-4">
                <span className="relative size-14 shrink-0 border hairline">
                  <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg leading-tight">
                    {line.name} <span className="text-sm text-smoke">× {line.quantity}</span>
                  </span>
                  <span className="block truncate text-xs text-smoke">{Object.values(line.options).join(" · ")}</span>
                </span>
                <span className="text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t hairline pt-6">
            <OrderSummaryRows
              totals={order.totals}
              shippingLabel={pickup ? fulfillment.pickup.label : fulfillment.delivery.label}
            />
          </div>
        </div>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
        <ButtonLink href="/contact" variant="outline">
          Store hours & location
        </ButtonLink>
      </div>
    </div>
  );
}
