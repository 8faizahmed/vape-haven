import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ShopExplorer } from "@/components/shop/shop-explorer";
import { StaticGrid } from "@/components/shop/static-grid";
import { Accent } from "@/components/ui/section-heading";
import { getCategories, getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Shop disposables, pod systems, e-liquids, advanced kits and accessories for pickup or local delivery in Windsor.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageHero
        eyebrow="The collection"
        title={
          <>
            Shop <Accent>all.</Accent>
          </>
        }
        description="Every device, e-liquid and accessory we carry — available for in-store pickup or local delivery."
        image="/images/scenes/hero-boutique.webp"
      />
      <div className="mx-auto max-w-7xl px-5 pb-28 lg:px-8">
        <CategoryTabs categories={categories} />
        <Suspense fallback={<StaticGrid products={products} />}>
          <ShopExplorer products={products} categories={categories} />
        </Suspense>
      </div>
    </>
  );
}
