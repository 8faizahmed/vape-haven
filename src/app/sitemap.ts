import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { policies } from "@/data/policies";
import { getCategories, getProducts } from "@/lib/commerce";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  return [
    { url: url("/"), priority: 1 },
    { url: url("/shop"), priority: 0.9 },
    { url: url("/about") },
    { url: url("/contact") },
    ...categories.map((c) => ({ url: url(`/shop/${c.slug}`), priority: 0.8 })),
    ...products.map((p) => ({ url: url(`/products/${p.slug}`), priority: 0.7 })),
    ...policies.map((p) => ({ url: url(`/policies/${p.slug}`), priority: 0.3 })),
  ];
}
