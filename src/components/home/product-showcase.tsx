import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/lib/commerce/types";

export function ProductShowcase({
  eyebrow,
  title,
  description,
  products,
  href = "/shop",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 lg:px-8 lg:py-28">
      <Reveal>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            <ButtonLink href={href} variant="outline" size="sm" className="self-start md:self-auto">
              Shop all <ArrowRight className="size-3.5" />
            </ButtonLink>
          }
        />
      </Reveal>
      <Reveal delay={0.1}>
        <ProductGrid products={products} className="mt-14" />
      </Reveal>
    </section>
  );
}
