import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow } from "@/components/ui/section-heading";

export function ELiquidBanner() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden">
      <Image
        src="/images/scenes/eliquid-wall.webp"
        alt="Illuminated shelves of e-liquid bottles"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink-950/60" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(5_5_5/0.2)_0%,var(--color-ink-950)_85%)]" />
      <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
        <Reveal>
          <Eyebrow className="justify-center">The e-liquid bar</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[1.02] font-medium sm:text-6xl lg:text-7xl">
            Nic salt, freebase &amp; <Accent>nicotine-free.</Accent>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist">
            Explore a wide range of strengths and blends for pod systems and sub-ohm tanks. Not sure what suits your
            device? Ask our team in store.
          </p>
          <ButtonLink href="/shop/e-liquids" size="lg" className="mt-10">
            Explore e-liquids <ArrowRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
