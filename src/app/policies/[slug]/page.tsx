import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/page-hero";
import { Eyebrow } from "@/components/ui/section-heading";
import { policies } from "@/data/policies";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies.find((p) => p.slug === slug);
  return policy ? { title: policy.title, description: policy.summary } : {};
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const policy = policies.find((p) => p.slug === slug);
  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 pb-28 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Policies" }, { label: policy.title }]} />
      <div className="mt-12 grid gap-14 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Policies</Eyebrow>
          <ul className="mt-6 grid gap-1">
            {policies.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/policies/${p.slug}`}
                  aria-current={p.slug === slug ? "page" : undefined}
                  className={cn(
                    "block border-l py-2 pl-4 text-sm transition-colors",
                    p.slug === slug ? "border-gold-300 text-gold-100" : "border-ink-600 text-mist hover:text-cream",
                  )}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-2xl">
          <h1 className="font-display text-5xl font-medium sm:text-6xl">{policy.title}</h1>
          <p className="mt-5 text-lg text-mist">{policy.summary}</p>
          <div className="mt-12 grid gap-10">
            {policy.sections.map((section) => (
              <section key={section.heading} className="border-t hairline pt-8">
                <h2 className="font-display text-2xl">{section.heading}</h2>
                <div className="mt-4 grid gap-4 text-sm leading-relaxed text-mist">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
