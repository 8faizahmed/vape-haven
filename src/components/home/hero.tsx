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

const description =
  "Curated devices, e-liquids and hardware from brands you trust. Order online for in-store pickup or local delivery — or visit our team in store.";

export function Hero() {
  return (
    <>
      <HeroScene
        overlay={<div className="absolute top-6 left-5 lg:hidden"><OpenStatus /></div>}
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
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/35 to-ink-950/15 lg:bg-gradient-to-r lg:from-ink-950 lg:via-ink-950/75 lg:to-ink-950/0" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent lg:to-ink-950/50" />
            {/* Sits above the scrims so wisps stay visible over the dark side; text is above it. */}
            <LazyVapor className="absolute inset-0" />
          </>
        }
      >
        <div className="hero-content mx-auto w-full max-w-7xl px-5 pt-0 pb-8 sm:pb-12 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <div className="intro-fade hidden h-8 [--d:100ms] lg:block">
              <OpenStatus />
            </div>
            <p className="hero-location eyebrow intro-fade flex items-center gap-3 text-[0.6rem] tracking-[0.22em] [--d:200ms] lg:mt-7 lg:text-[0.6875rem] lg:tracking-[0.32em]">
              <span className="h-px w-8 bg-gold-400/60" />
              {siteConfig.contact.address.city}, Ontario · Adults {siteConfig.legalAge}+
            </p>
            <h1 className="hero-title mt-5 font-display text-[clamp(3rem,12vw,4.5rem)] leading-[0.96] font-medium tracking-[-0.01em] lg:mt-6 lg:text-[clamp(3.1rem,8vw,6rem)] lg:leading-[0.92]">
              <IntroHeadline
                segments={[{ text: "Windsor's haven for" }, { text: "premium", accent: true }, { text: "vape." }]}
              />
            </h1>
            <p className="intro-fade hidden max-w-lg text-lg leading-relaxed text-mist [--d:750ms] lg:mt-7 lg:block">
              {description}
            </p>
            <div className="hero-actions intro-fade mt-8 flex flex-col gap-3 [--d:900ms] sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href="/shop" size="lg" className="w-full sm:w-auto">
                  Shop online <ArrowRight className="size-4" />
                </ButtonLink>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href="/contact" variant="outline" size="lg" className="w-full backdrop-blur-sm sm:w-auto">
                  Visit the store
                </ButtonLink>
              </Magnetic>
            </div>
          </div>

          <HeroFacts />
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
      <div className="border-b hairline bg-ink-900 px-5 py-7 lg:hidden">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-mist">{description}</p>
          <HeroFacts mobile />
        </div>
      </div>
    </>
  );
}

function HeroFacts({ mobile = false }: { mobile?: boolean }) {
  return (
    <dl className={mobile
      ? "mt-6 grid grid-cols-3 gap-4 border-t hairline pt-5"
      : "intro-fade mt-12 hidden max-w-2xl grid-cols-3 gap-8 border-t hairline pt-8 [--d:1050ms] lg:grid"}>
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse justify-end">
          <dt className={mobile
            ? "mt-1.5 text-[0.6rem] leading-snug text-smoke"
            : "mt-1.5 text-[0.6rem] leading-snug font-semibold tracking-[0.24em] text-smoke uppercase"}>
            {s.label}
          </dt>
          <dd className={mobile ? "font-display text-xl text-gold-100" : "font-display text-3xl text-gold-100"}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
