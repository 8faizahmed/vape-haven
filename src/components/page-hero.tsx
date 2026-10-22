import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold tracking-[0.2em] text-smoke uppercase">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-gold-400/50">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-gold-200">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-mist">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  crumbs?: Crumb[];
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b hairline", className)}>
      {image && (
        <>
          <Image src={image} alt="" fill preload sizes="100vw" className="animate-kenburns -z-20 object-cover opacity-60" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 to-transparent" />
        </>
      )}
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-10" />}
        <Eyebrow className="animate-fade-up">{eyebrow}</Eyebrow>
        <h1 className="animate-fade-up mt-5 max-w-3xl font-display text-5xl leading-[0.98] font-medium [animation-delay:100ms] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-mist [animation-delay:200ms]">{description}</p>
        )}
      </div>
    </section>
  );
}
