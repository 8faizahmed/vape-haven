import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/commerce/types";

/** Suspense fallback for <ShopExplorer /> — keeps products in the prerendered HTML. */
export function StaticGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
      <div className="hidden lg:block" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-[8.5rem] sm:gap-x-6 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
