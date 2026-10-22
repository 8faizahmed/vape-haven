import { CircleAlert } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page-hero";
import { ProductGrid } from "@/components/product/product-card";
import { ProductBadge } from "@/components/product/product-badge";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { Price } from "@/components/product/price";
import { Reveal } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { getCategory, getProduct, getProducts, getRelatedProducts } from "@/lib/commerce";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: `${product.name} by ${product.brand}`,
    description: product.shortDescription,
    openGraph: { images: product.images },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([getCategory(product.category), getRelatedProducts(product, 4)]);
  const containsNicotine = product.nicotine === "salt" || product.nicotine === "freebase";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    image: product.images.map((src) => new URL(src, siteConfig.url).toString()),
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.currency,
      price: (product.price / 100).toFixed(2),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-7xl px-5 pt-10 pb-24 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductGallery images={product.images} name={product.name} slug={product.slug} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">{product.brand}</p>
              {product.badges?.map((b) => <ProductBadge key={b} badge={b} />)}
            </div>
            <h1 className="mt-4 font-display text-5xl leading-[1] font-medium sm:text-6xl">{product.name}</h1>
            <div className="mt-6 flex items-center gap-4">
              <Price price={product.price} compareAt={product.compareAtPrice} className="text-xl" />
              <span className="h-4 w-px bg-ink-500" />
              <span className={product.inStock ? "text-xs text-emerald-300/90" : "text-xs text-smoke"}>
                {product.inStock ? "In stock · ready for pickup" : "Out of stock"}
              </span>
            </div>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-mist">{product.shortDescription}</p>

            {product.highlights.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {product.highlights.map((h) => (
                  <li key={h} className="border hairline px-3 py-1.5 text-xs text-cream">
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10">
              <ProductPurchase product={product} />
            </div>

            {containsNicotine && (
              <p className="mt-8 flex gap-3 border border-ink-500 bg-ink-850 p-4 text-xs leading-relaxed text-mist">
                <CircleAlert className="size-4 shrink-0 text-gold-300" strokeWidth={1.5} />
                <span>
                  <strong className="font-semibold text-cream">WARNING: Nicotine is highly addictive.</strong> This
                  product contains nicotine. Keep out of reach of children and pets. Not for sale to persons under{" "}
                  {siteConfig.legalAge}.
                </span>
              </p>
            )}

            <div className="mt-12 grid gap-12">
              <section>
                <h2 className="eyebrow">Details</h2>
                <p className="mt-4 text-sm leading-relaxed text-mist">{product.description}</p>
              </section>
              {product.specs.length > 0 && (
                <section>
                  <h2 className="eyebrow">Specifications</h2>
                  <dl className="mt-4 border-t hairline">
                    {product.specs.map((s) => (
                      <div key={s.label} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 border-b hairline py-3.5 text-sm">
                        <dt className="text-smoke">{s.label}</dt>
                        <dd className="text-cream">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t hairline bg-ink-950">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="You may also like"
                title={
                  <>
                    More to <Accent>explore.</Accent>
                  </>
                }
              />
            </Reveal>
            <ProductGrid products={related} className="mt-12" />
          </div>
        </section>
      )}
    </>
  );
}
