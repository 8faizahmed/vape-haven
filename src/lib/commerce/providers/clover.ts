// Clover provider — scaffold for going live.
//
// Enable with COMMERCE_PROVIDER=clover plus the env vars below. It reads
// inventory from the Clover REST API and sends shoppers to Clover Hosted
// Checkout for payment. Verify against a Clover sandbox merchant before launch:
// endpoints and payload fields follow Clover's public docs (docs.clover.com).
//
//   CLOVER_ENVIRONMENT   "sandbox" | "production"   (default: sandbox)
//   CLOVER_MERCHANT_ID   13-character merchant ID
//   CLOVER_API_TOKEN     private API token with Inventory + Checkout permissions

import { categories as localCategories } from "@/data/categories";
import { products as localProducts } from "@/data/products";
import { siteConfig } from "@/config/site";
import { slugify } from "@/lib/utils";
import { calculateTotals } from "../pricing";
import type { CommerceProvider, Product } from "../types";

const BASE_URL =
  process.env.CLOVER_ENVIRONMENT === "production"
    ? "https://api.clover.com"
    : "https://apisandbox.dev.clover.com";

type CloverItem = {
  id: string;
  name: string;
  alternateName?: string;
  price: number;
  sku?: string;
  code?: string;
  hidden?: boolean;
  available?: boolean;
  modifiedTime?: number;
  categories?: { elements: { id: string; name: string }[] };
  itemStock?: { quantity?: number };
};

function credentials() {
  const merchantId = process.env.CLOVER_MERCHANT_ID;
  const token = process.env.CLOVER_API_TOKEN;
  if (!merchantId || !token) {
    throw new Error("Clover is not configured: set CLOVER_MERCHANT_ID and CLOVER_API_TOKEN.");
  }
  return { merchantId, token };
}

async function cloverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = credentials();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`Clover ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function fetchItems(): Promise<CloverItem[]> {
  const { merchantId } = credentials();
  const items: CloverItem[] = [];
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const page = await cloverFetch<{ elements: CloverItem[] }>(
      `/v3/merchants/${merchantId}/items?expand=categories,itemStock&limit=${limit}&offset=${offset}`,
    );
    items.push(...page.elements);
    if (page.elements.length < limit) return items;
  }
}

/**
 * Clover items don't carry images or rich copy, so we merge in local content
 * from src/data/products.ts, matched by SKU (set the Clover item SKU to the
 * local product id) or by name.
 */
function toProduct(item: CloverItem): Product {
  const local = localProducts.find((p) => p.id === item.sku || p.name === item.name);
  const categoryName = item.categories?.elements[0]?.name ?? "";
  const category =
    localCategories.find((c) => c.slug === slugify(categoryName) || c.name === categoryName)?.slug ??
    local?.category ??
    "accessories";
  const fallbackImage = localCategories.find((c) => c.slug === category)?.image ?? "";

  return {
    id: item.id,
    slug: local?.slug ?? slugify(item.name),
    name: item.name,
    brand: local?.brand ?? item.alternateName ?? siteConfig.shortName,
    category,
    price: item.price,
    images: local?.images ?? [fallbackImage],
    shortDescription: local?.shortDescription ?? "",
    description: local?.description ?? "",
    highlights: local?.highlights ?? [],
    specs: local?.specs ?? [],
    // TODO: map Clover item groups / attributes to options for flavour & strength variants.
    options: local?.options ?? [],
    nicotine: local?.nicotine,
    badges: local?.badges,
    featured: local?.featured,
    inStock: item.available !== false && (item.itemStock?.quantity ?? 1) > 0,
    createdAt: item.modifiedTime ? new Date(item.modifiedTime).toISOString() : "2026-01-01",
  };
}

export const cloverProvider: CommerceProvider = {
  name: "clover",

  async getCategories() {
    return localCategories;
  },

  async getProducts() {
    const items = await fetchItems();
    return items.filter((item) => !item.hidden).map(toProduct);
  },

  async createCheckout(request) {
    const { merchantId } = credentials();
    const catalogue = await this.getProducts();

    let subtotal = 0;
    const lineItems = [];
    for (const line of request.lines) {
      const product = catalogue.find((p) => p.id === line.productId);
      if (!product?.inStock) return { ok: false, error: "An item in your cart is unavailable." };
      subtotal += product.price * line.quantity;
      lineItems.push({
        name: product.name,
        price: product.price,
        unitQty: line.quantity,
        note: Object.entries(line.options)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", "),
      });
    }

    if (request.fulfillment === "delivery") {
      const { shipping } = calculateTotals(subtotal, "delivery");
      if (shipping > 0) lineItems.push({ name: "Local delivery", price: shipping, unitQty: 1, note: "" });
    }

    // Clover Hosted Checkout: returns a hosted payment page URL to redirect to.
    const session = await cloverFetch<{ href: string; checkoutSessionId: string }>(
      "/invoicingcheckoutservice/v1/checkouts",
      {
        method: "POST",
        headers: { "X-Clover-Merchant-Id": merchantId },
        body: JSON.stringify({
          customer: {
            email: request.customer.email,
            firstName: request.customer.firstName,
            lastName: request.customer.lastName,
            phoneNumber: request.customer.phone,
          },
          shoppingCart: { lineItems },
        }),
      },
    );

    return {
      ok: true,
      orderId: session.checkoutSessionId,
      redirectUrl: session.href,
      totals: calculateTotals(subtotal, request.fulfillment),
    };
  },
};
