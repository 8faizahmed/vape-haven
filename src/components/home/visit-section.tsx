import { Clock, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { OpenStatus } from "@/components/open-status";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { hoursRows } from "@/lib/hours";

export const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${siteConfig.name} ${siteConfig.contact.mapQuery}`,
)}`;

export function VisitSection() {
  const { contact } = siteConfig;
  const hours = hoursRows();
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <Reveal className="relative aspect-[3/2] overflow-hidden border hairline">
          <Image
            src="/images/scenes/storefront.webp"
            alt="Boutique storefront at dusk"
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow>Visit us</Eyebrow>
            <OpenStatus />
          </div>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] font-medium sm:text-5xl">
            Come by the <Accent>boutique.</Accent>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-mist">
            See and compare devices in person, get set up by our team, and recycle your used devices and batteries.
          </p>

          <dl className="mt-10 grid gap-7">
            <div className="flex gap-5">
              <MapPin className="mt-1 size-4 shrink-0 text-gold-300" strokeWidth={1.5} />
              <div>
                <dt className="text-[0.6rem] font-semibold tracking-[0.28em] text-smoke uppercase">Address</dt>
                <dd className="mt-1.5 text-sm text-cream">
                  {contact.address.street}, {contact.address.city}, {contact.address.province} {contact.address.postalCode}
                </dd>
              </div>
            </div>
            <div className="flex gap-5">
              <Clock className="mt-1 size-4 shrink-0 text-gold-300" strokeWidth={1.5} />
              <div className="flex-1">
                <dt className="text-[0.6rem] font-semibold tracking-[0.28em] text-smoke uppercase">Hours</dt>
                <dd className="mt-1.5 grid gap-1 text-sm">
                  {hours.map((h) => (
                    <span key={h.days} className="flex justify-between gap-6 border-b border-dashed border-ink-600 pb-1">
                      <span className="text-mist">{h.days}</span>
                      <span className="text-cream tabular-nums">{h.time}</span>
                    </span>
                  ))}
                </dd>
              </div>
            </div>
            <div className="flex gap-5">
              <Phone className="mt-1 size-4 shrink-0 text-gold-300" strokeWidth={1.5} />
              <div>
                <dt className="text-[0.6rem] font-semibold tracking-[0.28em] text-smoke uppercase">Phone</dt>
                <dd className="mt-1.5 text-sm text-cream">{contact.phone}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={directionsUrl} target="_blank" rel="noreferrer">
              Get directions
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact us
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
