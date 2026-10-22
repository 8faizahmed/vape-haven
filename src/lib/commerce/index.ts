// Storefront data API. Pages and components import from here only, so switching
// from the demo catalogue to Clover is a single env var: COMMERCE_PROVIDER=clover.

import { cacheLife, cacheTag } from "next/cache";
import { cloverProvider } from "./providers/clover";
import { mockProvider } from "./providers/mock";
import type { CheckoutRequest, Product } from "./types";

const provider = process.env.COMMERCE_PROVIDER === "clover" ? cloverProvider : mockProvider;

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  return provider.getCategories();
}

export async function getProducts() {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return provider.getProducts();
}

export async function getCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 4) {
  const products = await getProducts();
  return products.filter((p) => p.featured && p.inStock).slice(0, limit);
}

/** Newest products, optionally skipping ids already shown elsewhere on the page. */
export async function getNewArrivals(limit = 4, exclude: string[] = []) {
  const products = await getProducts();
  return products
    .filter((p) => !exclude.includes(p.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await getProducts();
  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, limit);
}

export function createCheckout(request: CheckoutRequest) {
  return provider.createCheckout(request);
}

export type * from "./types";
