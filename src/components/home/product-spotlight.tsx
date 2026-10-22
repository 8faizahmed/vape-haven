import { ArrowRight } from "lucide-react";
import { BackgroundVideo } from "@/components/fx/background-video";
import { CountUp } from "@/components/fx/count-up";
import { Magnetic } from "@/components/fx/magnetic";
import { Price } from "@/components/product/price";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { spotlight } from "@/data/spotlight";
import type { Product } from "@/lib/commerce/types";

export function ProductSpotlight({ product }: { product: Product }) {
  const flavours = product.options.find((o) => o.name === "Flavour")?.values ?? [];

  return (
    <section className="relative overflow-hidden border-y hairline bg-ink-950">
      <div
        aria-hidden
        className="absolute top-1/2 right-0 size-[60vw] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(212_171_85/0.14),transparent_65%)]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:gap-14 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:py-32">
        <div>
          <Reveal>
            <Eyebrow>In the spotlight</Eyebrow>
            <p className="mt-8 text-[0.65rem] font-semibold tracking-[0.3em] text-gold-300 uppercase">{product.brand}</p>
            <h2 className="mt-3 font-display text-6xl leading-[0.92] font-medium sm:text-7xl lg:text-8xl">
              {product.name.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="text-gold-gradient animate-shimmer font-normal italic">{product.name.split(" ").at(-1)}</em>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-mist">{product.description.split(". ")[0]}.</p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-y hairline py-8">
              {spotlight.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-2 text-[0.58rem] leading-snug font-semibold tracking-[0.2em] text-smoke uppercase">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-4xl text-gold-100 sm:text-5xl">
                    <CountUp value={stat.value} />
                    {stat.unit && <span className="ml-1 text-xl text-gold-300">{stat.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            {flavours.length > 0 && (
              <p className="mt-8 text-sm text-mist">
                <span className="text-cream">{flavours.length} flavours</span> · {flavours.join(", ")}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Magnetic>
                <ButtonLink href={`/products/${product.slug}`} size="lg">
                  Choose your flavour <ArrowRight className="size-4" />
                </ButtonLink>
              </Magnetic>
              <Price price={product.price} compareAt={product.compareAtPrice} className="font-display text-3xl" />
            </div>
          </Reveal>
        </div>

        {/* Bleeds the video to the right edge of the viewport on large screens. */}
        <Reveal delay={0.15} className="relative lg:-mr-[max(0px,calc((100vw_-_80rem)/2_+_2rem))]">
          <div className="relative aspect-video overflow-hidden border hairline">
            <BackgroundVideo
              src={`/videos/${spotlight.video}.mp4`}
              mobileSrc={`/videos/${spotlight.video}-mobile.mp4`}
              poster={`/videos/${spotlight.video}-poster.webp`}
              className="absolute inset-0 size-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/40 via-transparent to-transparent" />
          </div>
          <div aria-hidden className="absolute -top-4 -left-4 size-24 border-t border-l border-gold-400/50" />
          <div aria-hidden className="absolute -right-4 -bottom-4 size-24 border-r border-b border-gold-400/50 lg:hidden" />
          {product.highlights.length > 1 && (
            <div className="absolute -bottom-6 left-6 border hairline bg-ink-900/90 px-5 py-3 backdrop-blur-md sm:left-10">
              <p className="text-[0.58rem] font-semibold tracking-[0.26em] text-smoke uppercase">Highlights</p>
              <p className="font-display text-xl">{product.highlights.slice(1).join(" · ")}</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
