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
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:gap-16 sm:py-24 lg:grid-cols-2 lg:gap-24 lg:px-8 lg:py-32">
        <Reveal className="relative">
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[4/5] lg:rounded-none">
            <Image
              src="/images/scenes/counter.webp"
              alt="Pod devices and e-liquid bottles on a black marble counter"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-3 bottom-3 rounded-xl border hairline bg-ink-900/90 px-4 py-3 backdrop-blur-md lg:-right-10 lg:-bottom-6 lg:rounded-none lg:px-8 lg:py-6">
            <p className="font-display text-3xl text-gold-gradient lg:text-5xl">19+</p>
            <p className="mt-1 text-[0.55rem] font-semibold tracking-[0.2em] text-mist uppercase lg:text-[0.6rem] lg:tracking-[0.28em]">Adults-only boutique</p>
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
          <div className="mt-7 grid gap-6 lg:mt-12 lg:gap-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.1 * i}>
                <div className="grid grid-cols-[auto_1fr] gap-4 border-t hairline pt-5 lg:gap-6 lg:pt-8">
                  <span className="flex size-9 items-center justify-center rounded-full border hairline font-display text-lg text-gold-300 italic lg:block lg:size-auto lg:rounded-none lg:border-0 lg:text-2xl">{String(i + 1).padStart(2, "0")}</span>
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
