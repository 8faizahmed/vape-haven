import { IdCard, ShoppingBag, Store } from "lucide-react";
import Image from "next/image";
import { GlowCard } from "@/components/fx/glow-card";
import { Reveal } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

const steps = [
  {
    icon: ShoppingBag,
    title: "Order online",
    body: "Browse the full range and check out in minutes. We'll confirm the moment your order is ready.",
  },
  {
    icon: IdCard,
    title: "Bring your ID",
    body: `Orders are only released to the named customer, ${siteConfig.legalAge} or older, with valid government-issued photo ID.`,
  },
  {
    icon: Store,
    title: "Collect or receive",
    body: "Pick up in store — usually within the hour — or choose local delivery across Windsor–Essex.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src="/images/scenes/marble.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900 via-ink-900/70 to-ink-900" />
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Click & collect"
            title={
              <>
                Simple, secure, <Accent>local.</Accent>
              </>
            }
          />
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden border hairline bg-gold-400/15 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={0.1 * i} className="bg-ink-900/95">
              <GlowCard className="flex h-full flex-col items-center px-8 py-12 text-center">
                <span className="flex size-16 items-center justify-center border border-gold-400/30 text-gold-300 transition-transform duration-700 ease-luxe group-hover/glow:rotate-45">
                  <step.icon className="size-6 transition-transform duration-700 ease-luxe group-hover/glow:-rotate-45" strokeWidth={1.25} />
                </span>
                <span className="mt-8 font-display text-sm text-gold-300 italic">Step {i + 1}</span>
                <h3 className="mt-2 font-display text-3xl">{step.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{step.body}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
