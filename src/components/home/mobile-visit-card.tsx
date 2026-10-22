"use client";

import { ArrowUpRight, ChevronDown, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { OpenStatus } from "@/components/open-status";
import { ButtonLink } from "@/components/ui/button";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { formatTime } from "@/lib/hours";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "hours", label: "Hours", icon: Clock3 },
  { id: "location", label: "Location", icon: MapPin },
  { id: "contact", label: "Contact", icon: Phone },
] as const;
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const week = [1, 2, 3, 4, 5, 6, 0].map((day) => {
  const hours = siteConfig.openingHours[day];
  return { day: days[day], hours: hours ? `${formatTime(hours.open)} – ${formatTime(hours.close)}` : "Closed" };
});

function subscribeClock(onChange: () => void) {
  const timer = setInterval(onChange, 30_000);
  const onVisible = () => { if (!document.hidden) onChange(); };
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

function clockSnapshot() {
  const now = new Date();
  const options = { timeZone: siteConfig.timeZone };
  const day = new Intl.DateTimeFormat("en-CA", { ...options, weekday: "long" }).format(now);
  const date = new Intl.DateTimeFormat("en-CA", { ...options, month: "short", day: "numeric" }).format(now);
  const time = new Intl.DateTimeFormat("en-CA", { ...options, hour: "numeric", minute: "2-digit", hour12: true }).format(now);
  return `${day}|${date}|${time}`;
}

/** A compact information card for phones; the full desktop visit layout stays separate. */
export function MobileVisitCard({ directionsUrl }: { directionsUrl: string }) {
  const id = useId();
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("hours");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const clock = useSyncExternalStore(subscribeClock, clockSnapshot, () => null);
  const [today, date, time] = clock?.split("|") ?? [];
  const todayHours = week.find((row) => row.day === today)?.hours;
  const { contact } = siteConfig;

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(tabs[next].id);
    buttons.current[next]?.focus({ preventScroll: true });
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border hairline bg-ink-950 shadow-[0_24px_70px_-35px_rgb(0_0_0/0.9)] lg:hidden">
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[2/1]">
        <Image src="/images/scenes/storefront.webp" alt="Boutique storefront at dusk" fill sizes="(min-width: 1024px) 0px, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/20" />
        <div className="absolute top-4 left-4"><OpenStatus /></div>
        <div className="absolute right-5 bottom-4 left-5 flex items-center gap-2 text-xs tracking-wide text-gold-100">
          <MapPin className="size-3.5" aria-hidden="true" />
          {contact.address.city}, {contact.address.province}
        </div>
      </div>

      <div className="px-5 pt-3 pb-5 sm:px-7 sm:pb-7">
        <Eyebrow>Visit us</Eyebrow>
        <h2 className="mt-3 max-w-sm font-display text-4xl leading-[1.05] font-medium">
          Come by the <Accent>boutique.</Accent>
        </h2>
        <div role="tablist" aria-label="Visit information" className="mt-6 grid grid-cols-3 gap-1 rounded-xl border hairline bg-ink-900 p-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(node) => { buttons.current[index] = node; }}
              type="button"
              role="tab"
              id={`${id}-${tab.id}-tab`}
              aria-selected={active === tab.id}
              aria-controls={`${id}-${tab.id}-panel`}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onKey(event, index)}
              className={cn("relative flex min-h-11 items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-colors", active === tab.id ? "text-gold-100" : "text-mist hover:text-cream")}
            >
              {active === tab.id && <motion.span layoutId={`${id}-tab`} className="absolute inset-0 rounded-lg border border-gold-400/25 bg-gold-400/10" transition={{ duration: reducedMotion ? 0 : 0.2 }} />}
              <tab.icon className="relative hidden size-3.5 shrink-0 min-[360px]:block" aria-hidden="true" />
              <span className="relative">{tab.label}</span>
            </button>
          ))}
        </div>

        {tabs.map((tab) => (
          <div key={tab.id} role="tabpanel" id={`${id}-${tab.id}-panel`} aria-labelledby={`${id}-${tab.id}-tab`} hidden={active !== tab.id} tabIndex={0} className="mt-5 min-h-52 rounded-lg outline-offset-4">
            <motion.div initial={false} animate={{ opacity: active === tab.id ? 1 : 0, y: active === tab.id ? 0 : 6 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
              {tab.id === "hours" && (
                <>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-mist">{today ? `${today}, ${date}` : "Today in Windsor"}</p>
                      <p className="mt-1 font-display text-3xl text-cream tabular-nums">{time ?? "—:—"}</p>
                    </div>
                    <span className="pb-1 text-[0.6rem] font-semibold tracking-[0.18em] text-smoke uppercase">Local time</span>
                  </div>
                  <dl className="mt-4 flex items-center justify-between gap-3 rounded-xl border hairline bg-ink-900 px-4 py-4 text-sm">
                    <dt className="text-mist">Today&apos;s hours</dt>
                    <dd className="font-medium text-gold-100 tabular-nums">{todayHours ?? "Checking…"}</dd>
                  </dl>
                  <details className="group mt-2">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs text-mist [&::-webkit-details-marker]:hidden">
                      Full week <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <dl className="grid gap-1 border-t hairline pt-3">
                      {week.map((row) => (
                        <div key={row.day} className={cn("flex justify-between gap-3 rounded-lg px-3 py-2 text-xs", row.day === today ? "bg-gold-400/10 text-gold-100" : "text-mist")}>
                          <dt>{row.day}{row.day === today && <span className="sr-only"> (today)</span>}</dt>
                          <dd className="tabular-nums">{row.hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </>
              )}
              {tab.id === "location" && (
                <>
                  <p className="text-xs text-mist">Find us in {contact.address.city}</p>
                  <address className="mt-3 text-base leading-relaxed text-cream not-italic">
                    {contact.address.street}<br />
                    {contact.address.city}, {contact.address.province} {contact.address.postalCode}
                  </address>
                  <ButtonLink href={directionsUrl} target="_blank" rel="noreferrer" variant="outline" className="mt-5 w-full rounded-xl">
                    Get directions <ArrowUpRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                </>
              )}
              {tab.id === "contact" && (
                <>
                  <p className="mb-3 text-xs text-mist">Get in touch</p>
                  <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="flex min-h-16 items-center gap-3 rounded-xl border hairline px-4 text-sm text-cream active:bg-gold-400/10">
                    <Phone className="size-4 shrink-0 text-gold-300" aria-hidden="true" />
                    <span className="min-w-0 flex-1">{contact.phone}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-smoke" aria-hidden="true" />
                  </a>
                  <a href={`mailto:${contact.email}`} className="mt-2 flex min-h-16 items-center gap-3 rounded-xl border hairline px-4 text-sm text-cream active:bg-gold-400/10">
                    <Mail className="size-4 shrink-0 text-gold-300" aria-hidden="true" />
                    <span className="min-w-0 flex-1 break-all">{contact.email}</span>
                    <ArrowUpRight className="size-4 shrink-0 text-smoke" aria-hidden="true" />
                  </a>
                </>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
