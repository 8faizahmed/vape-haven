import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { directionsUrl } from "@/components/home/visit-section";
import { PageHero } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { hoursRows } from "@/lib/hours";

export const metadata: Metadata = {
  title: "Visit & contact",
  description: `Store hours, location and contact details for ${siteConfig.name} in Windsor, Ontario.`,
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const hours = hoursRows();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`;

  const cards = [
    {
      icon: MapPin,
      title: "Address",
      body: (
        <>
          {contact.address.street}
          <br />
          {contact.address.city}, {contact.address.province} {contact.address.postalCode}
        </>
      ),
    },
    {
      icon: Phone,
      title: "Phone",
      body: <a href={`tel:${contact.phone.replace(/\D/g, "")}`}>{contact.phone}</a>,
    },
    {
      icon: Mail,
      title: "Email",
      body: <a href={`mailto:${contact.email}`}>{contact.email}</a>,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Visit & contact"
        title={
          <>
            Come see us in <Accent>Windsor.</Accent>
          </>
        }
        description="Browse in person, get set up by our team, or drop off used devices and batteries for recycling."
        image="/images/scenes/storefront.webp"
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-px border hairline bg-gold-400/15 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="bg-ink-900 p-8">
              <card.icon className="size-5 text-gold-300" strokeWidth={1.25} />
              <p className="mt-6 eyebrow">{card.title}</p>
              <p className="mt-3 font-display text-2xl leading-snug [&_a]:transition-colors [&_a:hover]:text-gold-200">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>Opening hours</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-medium sm:text-5xl">
              When we&apos;re <Accent>open.</Accent>
            </h2>
            <dl className="mt-10 border-t hairline">
              {hours.map((h) => (
                <div key={h.days} className="flex items-center justify-between gap-6 border-b hairline py-5">
                  <dt className="flex items-center gap-3 text-mist">
                    <Clock className="size-4 text-gold-300/70" strokeWidth={1.5} />
                    {h.days}
                  </dt>
                  <dd className="font-display text-xl tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden border hairline">
              <iframe
                title={`Map of ${siteConfig.name}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full [filter:grayscale(1)_invert(0.92)_sepia(0.35)_contrast(0.9)]"
              />
            </div>
            <ButtonLink href={directionsUrl} target="_blank" rel="noreferrer" variant="outline" className="mt-6">
              Get directions
            </ButtonLink>
          </div>

          <div>
            <Eyebrow>Send a message</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-medium sm:text-5xl">
              Questions? <Accent>Ask us.</Accent>
            </h2>
            <p className="mt-5 mb-10 max-w-md text-sm leading-relaxed text-mist">
              Product advice, stock requests or help with an order — our team replies within one business day.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
