import type { Product } from "@/lib/commerce/types";

/** Lower-cased text a product can be found by: name, brand, category and option values. */
export function searchKeywords(product: Product, categoryName = "") {
  return [
    product.name,
    product.brand,
    categoryName,
    product.shortDescription,
    ...product.options.flatMap((o) => o.values),
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesQuery(keywords: string, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every((t) => keywords.includes(t));
}
