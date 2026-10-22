import { CollectionScroller } from "@/components/home/collection-scroller";
import { DeviceFinder } from "@/components/home/device-finder";
import { ELiquidBanner } from "@/components/home/eliquid-banner";
import { Experience } from "@/components/home/experience";
import { Faq, faqs } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Marquee } from "@/components/home/marquee";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ProductSpotlight } from "@/components/home/product-spotlight";
import { VisitSection } from "@/components/home/visit-section";
import { Accent } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { spotlight } from "@/data/spotlight";
import { getCategories, getFeaturedProducts, getNewArrivals, getProduct, getProducts } from "@/lib/commerce";

export default async function HomePage() {
  const [categories, products, featured, spotlightProduct] = await Promise.all([
    getCategories(),
    getProducts(),
    getFeaturedProducts(4),
    getProduct(spotlight.slug),
  ]);
  // Exclude featured items so no product card appears twice (keeps image morphs unique).
  const newArrivals = await getNewArrivals(4, featured.map((p) => p.id));

  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]),
  );
  const finderProducts = products.map(
    ({ id, slug, name, brand, price, images, category, nicotine, featured, badges, inStock }) => ({
      id,
      slug,
      name,
      brand,
      price,
      images,
      category,
      nicotine,
      featured,
      badges,
      inStock,
    }),
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Store",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.contact.address.street,
        addressLocality: siteConfig.contact.address.city,
        addressRegion: siteConfig.contact.address.province,
        postalCode: siteConfig.contact.address.postalCode,
        addressCountry: siteConfig.contact.address.country,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <Marquee />
      <CollectionScroller categories={categories} counts={counts} />
      <ProductShowcase
        eyebrow="Best sellers"
        title={
          <>
            Customer <Accent>favourites.</Accent>
          </>
        }
        products={featured}
      />
      {spotlightProduct && <ProductSpotlight product={spotlightProduct} />}
      <DeviceFinder products={finderProducts} categories={categories} />
      <Experience />
      <ProductShowcase
        eyebrow="Just landed"
        title={
          <>
            New <Accent>arrivals.</Accent>
          </>
        }
        description="The latest devices and e-liquids to hit our shelves."
        products={newArrivals}
        href="/shop?sort=newest"
      />
      <ELiquidBanner />
      <HowItWorks />
      <VisitSection />
      <Faq />
    </>
  );
}
