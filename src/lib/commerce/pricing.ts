// Shared by the cart UI (estimates) and the checkout API (authoritative totals).

import { siteConfig } from "@/config/site";
import type { FulfillmentMethod, Money, OrderTotals } from "./types";

export function shippingFor(subtotal: Money, method: FulfillmentMethod): Money {
  if (method === "pickup") return siteConfig.fulfillment.pickup.fee;
  const { fee, freeOver } = siteConfig.fulfillment.delivery;
  return subtotal >= freeOver ? 0 : fee;
}

export function calculateTotals(subtotal: Money, method: FulfillmentMethod): OrderTotals {
  const shipping = shippingFor(subtotal, method);
  const tax = Math.round((subtotal + shipping) * siteConfig.tax.rate);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}
