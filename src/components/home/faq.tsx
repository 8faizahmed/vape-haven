import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

// TODO(client): review answers against store policies.
export const faqs = [
  {
    q: "How old do I need to be to shop with you?",
    a: `You must be ${siteConfig.legalAge} or older to visit our store or website and to purchase. We check valid government-issued photo ID on every pickup and delivery — orders can only be released to the person named on the order.`,
  },
  {
    q: "How does in-store pickup work?",
    a: "Place your order online and choose in-store pickup. We'll email you when it's ready, usually within the hour during opening hours. Bring your photo ID and order number.",
  },
  {
    q: "Do you deliver?",
    a: `Yes — we deliver across Windsor–Essex for ${formatPrice(siteConfig.fulfillment.delivery.fee)}, free on orders over ${formatPrice(siteConfig.fulfillment.delivery.freeOver)}. Someone ${siteConfig.legalAge} or older with matching ID must sign; we can't leave orders at the door.`,
  },
  {
    q: "What's the difference between nic salt and freebase e-liquid?",
    a: "Nicotine salt e-liquids are designed for low-power pod systems and are typically available in higher strengths. Freebase e-liquids are designed for higher-power sub-ohm devices and are typically used at lower strengths. Our team can help you match an e-liquid to your device.",
  },
  {
    q: "Can I return a product?",
    a: "Unopened hardware in its original packaging can be returned within 14 days with a receipt. Defective devices are covered by the manufacturer's warranty. For health and safety reasons, opened e-liquids, pods and disposables can't be returned.",
  },
  {
    q: "Do you recycle used devices and batteries?",
    a: "Yes. Bring used disposables, pods and batteries to the store and we'll make sure they're recycled responsibly.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-8 pb-16 sm:pb-24 lg:pt-12 lg:pb-32">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Good to know"
          title={
            <>
              Frequently <Accent>asked.</Accent>
            </>
          }
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-8 grid gap-3 lg:mt-14 lg:gap-0 lg:border-t hairline">
        {faqs.map((item) => (
          <details key={item.q} className="group rounded-2xl border hairline bg-ink-950 px-4 open:bg-gold-400/5 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:open:bg-transparent">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-xl text-cream transition-colors hover:text-gold-200 sm:text-2xl lg:gap-6 lg:py-6 [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border hairline bg-gold-400/5 lg:size-4 lg:border-0 lg:bg-transparent">
                <Plus className="size-4 text-gold-300 transition-transform duration-500 group-open:rotate-45" />
              </span>
            </summary>
            <p className="max-w-3xl pb-5 text-sm leading-relaxed text-mist lg:pb-7">{item.a}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
