import { ArrowRight, BadgeCheck, Recycle, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow, Ornament } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About us",
  description: `${siteConfig.name} is a specialty vape boutique in Windsor, Ontario.`,
};

// TODO(client): replace with the store's own story.
const values = [
  {
    icon: Sparkles,
    title: "Curated, not crowded",
    body: "We'd rather carry the right products than every product. Everything on our shelves is chosen and tested by our team.",
  },
  {
    icon: BadgeCheck,
    title: "Authentic & compliant",
    body: "Genuine products from trusted Canadian suppliers that meet Health Canada labelling and nicotine requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible retail",
    body: `We're an adults-only store. We ask for ID from anyone who appears under 25, and on every online order — no exceptions.`,
  },
  {
    icon: Recycle,
    title: "Recycle with us",
    body: "Drop off used disposables, pods and batteries in store and we'll make sure they're recycled properly.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title={
          <>
            A haven for <Accent>adult vapers</Accent> in Windsor.
          </>
        }
        image="/images/scenes/hero-boutique.webp"
      />

      <section className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-2 lg:gap-24 lg:px-8 lg:py-32">
        <Reveal className="relative aspect-[4/5] overflow-hidden border hairline">
          <Image
            src="/images/scenes/counter.webp"
            alt="Devices and e-liquids on the boutique counter"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col justify-center">
          <Eyebrow>Vape Haven 369</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-medium sm:text-5xl">
            Independent, local and <Accent>obsessed with quality.</Accent>
          </h2>
          <div className="mt-8 grid gap-5 text-base leading-relaxed text-mist">
            <p>
              Vape Haven 369 was founded on a simple idea: buying vape products should feel like visiting a specialty
              boutique, not a convenience store. Clean, well-lit displays. Staff who actually use what they sell. Honest
              advice, every time.
            </p>
            <p>
              Today we serve adult customers across Windsor–Essex in store and online, with same-day pickup and local
              delivery. Whatever you&apos;re looking for, we&apos;ll help you find the right fit.
            </p>
          </div>
          <ButtonLink href="/shop" className="mt-10 self-start">
            Shop the collection <ArrowRight className="size-4" />
          </ButtonLink>
        </Reveal>
      </section>

      <section className="border-y hairline bg-ink-950">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-28">
          <Ornament />
          <h2 className="mt-8 text-center font-display text-4xl font-medium sm:text-5xl">
            What we <Accent>stand for.</Accent>
          </h2>
          <div className="mt-16 grid gap-px border hairline bg-gold-400/15 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={0.08 * i} className="bg-ink-950 p-8">
                <v.icon className="size-6 text-gold-300" strokeWidth={1.25} />
                <h3 className="mt-6 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <Image src="/images/scenes/eliquid-wall.webp" alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink-950/75" />
        <div className="mx-auto max-w-3xl px-5 py-28 text-center">
          <h2 className="font-display text-4xl font-medium sm:text-6xl">
            Come say <Accent>hello.</Accent>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-mist">
            Visit us in {siteConfig.contact.address.city} — our team is happy to help you find your next setup.
          </p>
          <ButtonLink href="/contact" size="lg" className="mt-10">
            Plan your visit
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
