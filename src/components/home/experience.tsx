import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow } from "@/components/ui/section-heading";

const pillars = [
  {
    title: "Knowledgeable staff",
    body: "Whether it's your first device or your fifth, our team will help you choose the right hardware, coil and nicotine strength — and show you how to look after it.",
  },
  {
    title: "Authentic, compliant stock",
    body: "We carry genuine products from trusted Canadian suppliers. Every device and e-liquid on our shelves meets Health Canada requirements.",
  },
  {
    title: "Order online, collect today",
    body: "Reserve online and pick up in store the same day, or have it delivered across Windsor–Essex with ID checked at the door.",
  },
];

export function Experience() {
  return (
    <section className="relative overflow-hidden border-y hairline bg-ink-950">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 lg:grid-cols-2 lg:gap-24 lg:px-8 lg:py-32">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/scenes/counter.webp"
              alt="Pod devices and e-liquid bottles on a black marble counter"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-3 -bottom-6 hidden border hairline bg-ink-900/90 px-8 py-6 backdrop-blur-md sm:block lg:-right-10">
            <p className="font-display text-5xl text-gold-gradient">19+</p>
            <p className="mt-1 text-[0.6rem] font-semibold tracking-[0.28em] text-mist uppercase">Adults-only boutique</p>
          </div>
          <div aria-hidden className="absolute -top-4 -left-4 -z-10 hidden size-40 border border-gold-400/20 lg:block" />
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>The Haven standard</Eyebrow>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl">
              A boutique experience, <Accent>in store and online.</Accent>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.1 * i}>
                <div className="grid grid-cols-[auto_1fr] gap-6 border-t hairline pt-8">
                  <span className="font-display text-2xl text-gold-300 italic">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-mist">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
