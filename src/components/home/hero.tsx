import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { BackgroundVideo } from "@/components/fx/background-video";
import { LazyVapor } from "@/components/fx/lazy-vapor";
import { Magnetic } from "@/components/fx/magnetic";
import { OpenStatus } from "@/components/open-status";
import { ButtonLink } from "@/components/ui/button";
import { IntroHeadline } from "@/components/ui/intro-headline";
import { siteConfig } from "@/config/site";
import { HeroScene } from "./hero-scene";

const stats = [
  { value: "Same day", label: "In-store pickup" },
  { value: `${siteConfig.legalAge}+`, label: "ID verified" },
  { value: "Local", label: "Windsor–Essex delivery" },
];

export function Hero() {
  return (
    <HeroScene
      background={
        <>
          <Image
            src="/images/scenes/hero-boutique.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
          <BackgroundVideo
            src="/videos/hero-boutique.mp4"
            mobileSrc="/videos/hero-boutique-mobile.mp4"
            poster="/videos/hero-boutique-poster.webp"
            eager
            className="absolute inset-0 size-full object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-ink-950/0" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-950/50" />
          {/* Sits above the scrims so wisps stay visible over the dark side; text is above it. */}
          <LazyVapor className="absolute inset-0" />
        </>
      }
    >
      <div className="mx-auto w-full max-w-7xl px-5 pt-28 pb-14 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <div className="intro-fade h-8 [--d:100ms]">
            <OpenStatus />
          </div>
          <p className="eyebrow intro-fade mt-7 flex items-center gap-3 [--d:200ms]">
            <span className="h-px w-8 bg-gold-400/60" />
            {siteConfig.contact.address.city}, Ontario · Adults {siteConfig.legalAge}+
          </p>
          <h1 className="mt-6 font-display text-[clamp(3.1rem,8vw,6rem)] leading-[0.92] font-medium tracking-[-0.01em]">
            <IntroHeadline
              segments={[{ text: "Windsor's haven for" }, { text: "premium", accent: true }, { text: "vape." }]}
            />
          </h1>
          <p className="intro-fade mt-7 max-w-lg text-base leading-relaxed text-mist [--d:750ms] sm:text-lg">
            Curated devices, e-liquids and hardware from brands you trust. Order online for in-store pickup or local
            delivery — or visit our team in store.
          </p>
          <div className="intro-fade mt-9 flex flex-wrap gap-4 [--d:900ms]">
            <Magnetic>
              <ButtonLink href="/shop" size="lg">
                Shop online <ArrowRight className="size-4" />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/contact" variant="outline" size="lg" className="backdrop-blur-sm">
                Visit the store
              </ButtonLink>
            </Magnetic>
          </div>
        </div>

        <dl className="intro-fade mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t hairline pt-8 [--d:1050ms] sm:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-1.5 text-[0.58rem] leading-snug font-semibold tracking-[0.16em] text-smoke uppercase sm:text-[0.6rem] sm:tracking-[0.24em]">
                {s.label}
              </dt>
              <dd className="font-display text-xl text-gold-100 sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        aria-hidden
        className="intro-fade absolute right-8 bottom-10 hidden flex-col items-center gap-3 [--d:1300ms] lg:flex"
      >
        <span className="text-[0.55rem] tracking-[0.4em] text-smoke uppercase [writing-mode:vertical-rl]">
          Scroll to explore
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-gold-400/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.4s_ease-in-out_infinite] bg-gold-300" />
        </span>
      </div>
    </HeroScene>
  );
}
