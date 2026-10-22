// Demo provider: serves the sample catalogue and simulates checkout.
// No order is stored and no payment is taken.

import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { calculateTotals } from "../pricing";
import type { CommerceProvider } from "../types";

export const mockProvider: CommerceProvider = {
  name: "mock",

  async getCategories() {
    return categories;
  },

  async getProducts() {
    return products;
  },

  async createCheckout(request) {
    let subtotal = 0;

    for (const line of request.lines) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return { ok: false, error: "One of the items in your cart is no longer available." };
      if (!product.inStock) return { ok: false, error: `${product.name} is currently out of stock.` };
      subtotal += product.price * line.quantity;
    }

    const orderId = `VH-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    return {
      ok: true,
      orderId,
      redirectUrl: `/checkout/success?order=${orderId}`,
      totals: calculateTotals(subtotal, request.fulfillment),
    };
  },
};
