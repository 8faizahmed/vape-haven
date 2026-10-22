"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import type { Category } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

const QUERY = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const mql = matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};

/**
 * Pinned horizontal gallery: vertical scrolling drives the categories sideways
 * on tablet/desktop. On phones it's a native swipe carousel.
 */
export function CollectionScroller({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const pinned = useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!pinned || !el) return;
    const ro = new ResizeObserver(() => setDistance(Math.max(0, el.scrollWidth - window.innerWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);

  // The track moves by transform, so keyboard focus can't scroll it — scroll the page instead.
  const revealOnFocus = (el: HTMLElement) => {
    const s = section.current;
    if (!pinned || !s || distance === 0) return;
    const progress = Math.min(1, Math.max(0, (el.offsetLeft - window.innerWidth * 0.3) / distance));
    window.scrollTo({ top: s.offsetTop + progress * distance, behavior: "instant" });
  };

  return (
    <section
      ref={section}
      aria-label="Shop by category"
      className="relative"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={cn(pinned ? "sticky top-0 flex h-svh items-center overflow-hidden" : "py-20")}>
        <motion.div
          ref={track}
          style={pinned ? { x } : undefined}
          className={cn(
            "flex items-center gap-6 px-5 md:w-max md:gap-10 lg:gap-14 lg:pr-[10vw] lg:pl-[8vw]",
            !pinned && "scrollbar-none snap-x snap-mandatory overflow-x-auto pt-14 pb-4",
          )}
        >
          <div className="w-[78vw] shrink-0 snap-start md:w-[38vw] lg:w-[30vw]">
            <Eyebrow>The collection</Eyebrow>
            <h2 className="mt-6 font-display text-5xl leading-[1] font-medium lg:text-7xl">
              Everything you need, <Accent>curated.</Accent>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist">
              From ready-to-go disposables to fully adjustable kits — every product on our shelves is chosen by our
              team.
            </p>
            <p className="mt-10 inline-flex items-center gap-3 text-[0.62rem] font-semibold tracking-[0.3em] text-gold-300 uppercase">
              {pinned ? "Keep scrolling" : "Swipe to explore"} <ArrowRight className="size-3.5" />
            </p>
          </div>

          {categories.map((category, i) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              data-cursor="view"
              onFocus={(e) => revealOnFocus(e.currentTarget)}
              className={cn(
                "group relative block w-[70vw] shrink-0 snap-start md:w-[30vw] lg:w-[22vw]",
                i % 2 === 1 && "md:translate-y-12",
              )}
            >
              <span className="text-outline pointer-events-none absolute -top-12 -left-3 z-10 font-display text-[6.5rem] leading-none transition-colors duration-700 group-hover:text-gold-400/20 md:text-[8rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative aspect-[3/4] overflow-hidden border hairline bg-ink-950">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 70vw"
                  className="scale-105 object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.14]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-gold-300/40 text-gold-200 opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.6rem] font-semibold tracking-[0.28em] text-gold-300 uppercase">{category.tagline}</p>
                  <h3 className="mt-2 font-display text-3xl leading-none lg:text-4xl">{category.name}</h3>
                </div>
                <span className="pb-1 text-xs text-smoke">{counts[category.slug] ?? 0} items</span>
              </div>
            </Link>
          ))}

          <Link
            href="/shop"
            onFocus={(e) => revealOnFocus(e.currentTarget)}
            className="group flex size-48 shrink-0 snap-start flex-col items-center justify-center rounded-full border border-gold-400/40 text-center transition-colors duration-500 hover:bg-gold-400 md:size-60"
          >
            <span className="font-display text-3xl leading-tight text-cream transition-colors group-hover:text-ink-950">
              Shop all
              <br />
              products
            </span>
            <ArrowRight className="mt-3 size-5 text-gold-300 transition-all group-hover:translate-x-1 group-hover:text-ink-950" />
          </Link>
        </motion.div>

        {pinned && (
          <div className="absolute inset-x-[8vw] bottom-10 h-px bg-gold-400/15">
            <motion.div style={{ scaleX: scrollYProgress }} className="bg-gold-gradient h-px origin-left" />
          </div>
        )}
      </div>
    </section>
  );
}
