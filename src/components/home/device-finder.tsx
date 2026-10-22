"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GlowCard } from "@/components/fx/glow-card";
import { ButtonLink } from "@/components/ui/button";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import type { Category, Product } from "@/lib/commerce/types";
import { cn, formatPrice } from "@/lib/utils";

type FinderProduct = Pick<Product, "id" | "slug" | "name" | "brand" | "price" | "images" | "category" | "nicotine" | "featured" | "badges" | "inStock">;
type Scores = Partial<Record<string, number>>;

// Each answer nudges category scores; nicotine preference nudges individual products.
const QUESTIONS = [
  {
    id: "experience",
    title: "How familiar are you with vaping?",
    options: [
      { id: "new", label: "Just getting started", hint: "Simple, no setup", scores: { disposables: 3, "pod-systems": 1 } },
      { id: "some", label: "I know the basics", hint: "Happy to refill", scores: { "pod-systems": 3, disposables: 1, "e-liquids": 1 } },
      { id: "expert", label: "Experienced", hint: "I like to fine-tune", scores: { "advanced-kits": 3, "pod-systems": 1, "e-liquids": 1 } },
    ],
  },
  {
    id: "priority",
    title: "What matters most to you?",
    options: [
      { id: "easy", label: "Zero maintenance", hint: "Grab and go", scores: { disposables: 3 } },
      { id: "value", label: "Lower running cost", hint: "Refill instead of replace", scores: { "pod-systems": 2, "e-liquids": 2 } },
      { id: "control", label: "Full control", hint: "Wattage, airflow & coils", scores: { "advanced-kits": 3, "e-liquids": 1 } },
    ],
  },
  {
    id: "nicotine",
    title: "Which nicotine style suits you?",
    options: [
      { id: "salt", label: "Nicotine salt", hint: "Typical for pods & disposables", scores: {} },
      { id: "freebase", label: "Freebase or nicotine-free", hint: "Lower strengths, sub-ohm", scores: {} },
      { id: "unsure", label: "Not sure yet", hint: "We'll suggest the best fit", scores: {} },
    ],
  },
] as const;

const ELIGIBLE = ["disposables", "pod-systems", "e-liquids", "advanced-kits"];

function recommend(answers: string[], products: FinderProduct[]) {
  const scores: Scores = {};
  QUESTIONS.forEach((q, i) => {
    const option = q.options.find((o) => o.id === answers[i]);
    Object.entries((option?.scores ?? {}) as Scores).forEach(([cat, n]) => (scores[cat] = (scores[cat] ?? 0) + (n ?? 0)));
  });
  const nicotine = answers[2];
  const ranked = products
    .filter((p) => p.inStock && ELIGIBLE.includes(p.category))
    .map((p) => {
      let score = scores[p.category] ?? 0;
      if (nicotine === "salt" && p.nicotine === "salt") score += 1.5;
      if (nicotine === "freebase" && (p.nicotine === "freebase" || p.category === "advanced-kits")) score += 1.5;
      if (p.featured) score += 0.5;
      if (p.badges?.includes("bestseller")) score += 0.3;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score);
  const topCategory = Object.entries(scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0]?.[0] ?? "disposables";
  return { category: topCategory, products: ranked.slice(0, 3).map((r) => r.product) };
}

export function DeviceFinder({ products, categories }: { products: FinderProduct[]; categories: Category[] }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const result = done ? recommend(answers, products) : null;
  const matched = result ? categories.find((c) => c.slug === result.category) : null;

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:gap-14 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8 lg:py-32">
        <div className="lg:pt-6">
          <Eyebrow>Device finder</Eyebrow>
          <h2 className="mt-5 font-display text-5xl leading-[1] font-medium sm:text-6xl">
            Not sure where <Accent>to start?</Accent>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-mist">
            Answer three quick questions and we&apos;ll match you with the right setup. Prefer to talk it through? Our
            team is always happy to help in store.
          </p>
          <div className="mt-10 flex gap-2" aria-hidden>
            {QUESTIONS.map((q, i) => (
              <span
                key={q.id}
                className={cn("h-px flex-1 transition-colors duration-500", i < step ? "bg-gold-300" : "bg-ink-500")}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-smoke">{done ? "Your match is ready" : `Question ${step + 1} of ${QUESTIONS.length}`}</p>
        </div>

        <GlowCard className="border hairline bg-ink-850/80 p-5 sm:min-h-[30rem] sm:p-10">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-lg text-gold-300 italic">0{step + 1}</p>
                <h3 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{QUESTIONS[step].title}</h3>
                <div className="mt-8 grid gap-3">
                  {QUESTIONS[step].options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAnswers((a) => [...a, option.id])}
                      className="group flex items-center justify-between gap-6 border border-ink-500 px-6 py-5 text-left transition-all duration-300 hover:border-gold-300 hover:bg-gold-400/5"
                    >
                      <span>
                        <span className="block font-display text-2xl text-cream">{option.label}</span>
                        <span className="mt-1 block text-xs text-mist">{option.hint}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-gold-300 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setAnswers((a) => a.slice(0, -1))}
                    className="mt-6 inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.22em] text-smoke uppercase hover:text-gold-200"
                  >
                    <ArrowLeft className="size-3.5" /> Back
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow">Your match</p>
                <h3 className="mt-3 font-display text-4xl sm:text-5xl">
                  <span className="text-gold-gradient animate-shimmer italic">{matched?.name}</span>
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist">{matched?.description}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                  {result?.products.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                    >
                      <Link href={`/products/${p.slug}`} data-cursor="view" className="group block">
                        <span className="relative block aspect-square overflow-hidden border hairline">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            sizes="(min-width: 640px) 200px, 90vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </span>
                        <span className="mt-3 block text-[0.58rem] font-semibold tracking-[0.26em] text-gold-300 uppercase">
                          {p.brand}
                        </span>
                        <span className="mt-1 block font-display text-xl leading-tight">{p.name}</span>
                        <span className="mt-1 block text-sm text-gold-100">{formatPrice(p.price)}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {matched && (
                    <ButtonLink href={`/shop/${matched.slug}`}>
                      Shop {matched.name} <ArrowRight className="size-4" />
                    </ButtonLink>
                  )}
                  <button
                    type="button"
                    onClick={() => setAnswers([])}
                    className="inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.22em] text-mist uppercase hover:text-gold-200"
                  >
                    <RotateCcw className="size-3.5" /> Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlowCard>
      </div>
    </section>
  );
}
