import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { CategoryTabs } from "@/components/shop/category-tabs";
import { ShopExplorer } from "@/components/shop/shop-explorer";
import { StaticGrid } from "@/components/shop/static-grid";
import { getCategories, getCategory, getProducts } from "@/lib/commerce";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = await getCategory((await params).category);
  if (!category) return {};
  return {
    title: category.name,
    description: `${category.description} Shop online for pickup or local delivery in Windsor, Ontario.`,
    openGraph: { images: [category.image] },
  };
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category: slug } = await params;
  const [category, categories, products] = await Promise.all([getCategory(slug), getCategories(), getProducts()]);
  if (!category) notFound();

  return (
    <>
      <PageHero
        eyebrow={category.tagline}
        title={category.name}
        description={category.description}
        image={category.image}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />
      <div className="mx-auto max-w-7xl px-5 pb-28 lg:px-8">
        <CategoryTabs categories={categories} active={category.slug} />
        <Suspense fallback={<StaticGrid products={products.filter((p) => p.category === category.slug)} />}>
          <ShopExplorer products={products} categories={categories} lockedCategory={category.slug} />
        </Suspense>
      </div>
    </>
  );
}
