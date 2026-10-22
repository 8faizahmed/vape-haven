import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { hoursRows } from "@/lib/hours";
import { getCategories } from "@/lib/commerce";
import { FooterWordmark } from "./footer-wordmark";
import { NewsletterForm } from "./newsletter-form";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const helpLinks = [
  { label: "Pickup & delivery", href: "/policies/pickup-delivery" },
  { label: "Returns & warranty", href: "/policies/returns" },
  { label: "Age verification", href: "/policies/age-verification" },
  { label: "Privacy policy", href: "/policies/privacy" },
  { label: "Terms of sale", href: "/policies/terms" },
];

export async function Footer() {
  const categories = await getCategories();
  const { contact } = siteConfig;
  const hours = hoursRows();

  return (
    <footer className="relative mt-auto border-t hairline bg-ink-950 pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-10 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-14">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">
              A specialty vape boutique in {contact.address.city}, {contact.address.province}. Curated hardware and
              e-liquids, with knowledgeable staff in store.
            </p>
            <div className="mt-8 flex gap-6">
              {siteConfig.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.65rem] font-semibold tracking-[0.24em] text-mist uppercase transition-colors hover:text-gold-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop">
            <FooterLink href="/shop">All products</FooterLink>
            {categories.map((c) => (
              <FooterLink key={c.slug} href={`/shop/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Help">
            {helpLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
            <FooterLink href="/contact">Contact us</FooterLink>
          </FooterColumn>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="eyebrow">Visit</h3>
            <address className="mt-6 text-sm leading-relaxed text-mist not-italic">
              {contact.address.street}
              <br />
              {contact.address.city}, {contact.address.province} {contact.address.postalCode}
              <br />
              <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="hover:text-gold-200">
                {contact.phone}
              </a>
            </address>
            <dl className="mt-6 grid gap-1.5 text-sm">
              {hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4">
                  <dt className="text-smoke">{h.days}</dt>
                  <dd className="text-mist tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t hairline pt-8 sm:mt-16 sm:gap-10 sm:pt-12 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="font-display text-3xl">
              New arrivals, <em className="text-gold-gradient italic">first.</em>
            </p>
            <p className="mt-2 text-sm text-mist">Restocks and new products, straight to your inbox. Adults only.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t hairline pt-8 text-xs leading-relaxed text-smoke sm:mt-16 lg:flex-row lg:justify-between">
          <p>
            © <CopyrightYear /> {siteConfig.name}. Sale of vaping products is restricted to persons {siteConfig.legalAge}{" "}
            years of age or older in Ontario.
          </p>
          {siteConfig.demoMode && <p className="text-gold-400/80">Demo storefront — orders are not processed and no payment is taken.</p>}
        </div>
      </div>
      <FooterWordmark />
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-3 grid gap-1 lg:mt-6 lg:gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-flex min-h-11 items-center text-sm text-mist transition-colors hover:text-gold-200 lg:min-h-0">
        {children}
      </Link>
    </li>
  );
}
