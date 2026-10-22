"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Emblem } from "@/components/brand/logo";
import { BackgroundVideo } from "@/components/fx/background-video";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { AGE_COOKIE, AGE_VERIFIED_EVENT } from "@/lib/age-gate";
import { cn } from "@/lib/utils";

const listeners = new Set<() => void>();
const verifiedStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: () => document.documentElement.dataset.ageVerified === "true",
  set(remember: boolean) {
    const maxAge = remember ? `; max-age=${siteConfig.ageGateRememberDays * 86400}` : "";
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${AGE_COOKIE}=1; path=/; SameSite=Lax${maxAge}${secure}`;
    document.documentElement.dataset.ageVerified = "true";
    listeners.forEach((l) => l());
    window.dispatchEvent(new Event(AGE_VERIFIED_EVENT));
  },
};

function ageOn(birth: Date, today = new Date()) {
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

type Status = "idle" | "underage" | "leaving";

// Exit choreography (ms): card fades → gold line splits the screen → curtains part
// while the page's intro animations start (html[data-intro]) → gate unmounts.
const INTRO_AT = 650;
const DONE_AT = 1600;

export function AgeGate() {
  const verified = useSyncExternalStore(verifiedStore.subscribe, verifiedStore.get, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dob, setDob] = useState({ month: "", day: "", year: "" });
  const [remember, setRemember] = useState(true);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Keep keyboard and screen-reader focus inside the gate while it's open.
  useEffect(() => {
    const site = document.getElementById("site");
    if (!site || verified) return;
    site.inert = true;
    return () => {
      site.inert = false;
    };
  }, [verified]);

  if (verified) return null;

  const leaving = status === "leaving";

  const update = (field: keyof typeof dob, value: string, max: number, next?: HTMLInputElement | null) => {
    const digits = value.replace(/\D/g, "").slice(0, max);
    setDob((d) => ({ ...d, [field]: digits }));
    setError(null);
    if (digits.length === max) next?.focus();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const month = Number(dob.month);
    const day = Number(dob.day);
    const year = Number(dob.year);
    const birth = new Date(year, month - 1, day);
    const valid =
      dob.year.length === 4 &&
      year > 1900 &&
      birth.getFullYear() === year &&
      birth.getMonth() === month - 1 &&
      birth.getDate() === day &&
      birth <= new Date();

    if (!valid) return setError("Please enter a valid date of birth.");
    if (ageOn(birth) < siteConfig.legalAge) return setStatus("underage");

    setStatus("leaving");
    setTimeout(() => (document.documentElement.dataset.intro = "play"), INTRO_AT);
    setTimeout(() => verifiedStore.set(remember), DONE_AT);
  };

  const field =
    "h-14 w-full border hairline bg-ink-950/60 text-center font-display text-2xl text-cream placeholder:text-smoke/70 focus:border-gold-300 focus:outline-none";
  const curtain = "absolute inset-x-0 h-1/2 bg-ink-950/92 backdrop-blur-2xl transition-transform duration-1000 ease-luxe";

  return (
    <div
      data-age-gate
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className={cn("fixed inset-0 z-[150]", leaving && "pointer-events-none")}
    >
      <div className={cn(curtain, "top-0", leaving && "-translate-y-full delay-[550ms]")} />
      <div className={cn(curtain, "bottom-0", leaving && "translate-y-full delay-[550ms]")} />

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          leaving ? "opacity-0" : "opacity-100",
        )}
      >
        <BackgroundVideo
          src="/videos/vapor.mp4"
          mobileSrc="/videos/vapor-mobile.mp4"
          poster="/videos/vapor-poster.webp"
          className="absolute inset-0 size-full opacity-35 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-ink-950)_80%)]" />
      </div>

      <div
        aria-hidden
        className="bg-gold-gradient absolute inset-x-0 top-1/2 h-px origin-center"
        style={{
          transform: `scaleX(${leaving ? 1 : 0})`,
          opacity: leaving ? 0 : 1,
          transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, opacity 0.5s ease 1s",
        }}
      />

      <div className="relative flex h-full items-center justify-center overflow-y-auto p-4">
        <div
          className={cn(
            "relative w-full max-w-md border hairline bg-ink-900/85 px-7 py-12 text-center shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 ease-luxe sm:px-12",
            leaving && "scale-95 opacity-0 blur-sm",
          )}
        >
          <Corners />
          <Emblem className="emblem-draw mx-auto size-16" />

          {status === "underage" ? (
            <div className="mt-8">
              <p className="eyebrow">Access restricted</p>
              <h2 id="age-gate-title" className="mt-4 font-display text-4xl leading-tight">
                Sorry, you must be {siteConfig.legalAge} or older.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Vaping products are age-restricted in Ontario. Learn more about the risks of vaping from Health
                Canada.
              </p>
              <a
                href="https://www.canada.ca/en/health-canada/services/smoking-tobacco/vaping.html"
                className="mt-8 inline-block text-xs font-semibold tracking-[0.24em] text-gold-200 uppercase underline-offset-8 hover:underline"
              >
                Visit Health Canada
              </a>
            </div>
          ) : (
            <>
              <p className="eyebrow animate-fade-up mt-8 [animation-delay:500ms]">
                Adults only · {siteConfig.legalAge}+
              </p>
              <h2
                id="age-gate-title"
                className="animate-fade-up mt-4 font-display text-4xl leading-[1.05] [animation-delay:620ms] sm:text-[2.75rem]"
              >
                Welcome to
                <br />
                <em className="text-gold-gradient animate-shimmer italic">Vape Haven</em>
              </h2>
              <p className="animate-fade-up mt-4 text-sm leading-relaxed text-mist [animation-delay:740ms]">
                This site sells nicotine products. Please enter your date of birth to confirm you are{" "}
                {siteConfig.legalAge} or older.
              </p>

              <form onSubmit={submit} noValidate className="animate-fade-up mt-8 [animation-delay:860ms]">
                <fieldset>
                  <legend className="sr-only">Date of birth</legend>
                  <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-3">
                    <label className="flex flex-col gap-2">
                      <span className="text-[0.6rem] font-semibold tracking-[0.28em] text-smoke uppercase">Month</span>
                      <input
                        autoFocus
                        inputMode="numeric"
                        autoComplete="bday-month"
                        placeholder="MM"
                        value={dob.month}
                        onChange={(e) => update("month", e.target.value, 2, dayRef.current)}
                        className={field}
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[0.6rem] font-semibold tracking-[0.28em] text-smoke uppercase">Day</span>
                      <input
                        ref={dayRef}
                        inputMode="numeric"
                        autoComplete="bday-day"
                        placeholder="DD"
                        value={dob.day}
                        onChange={(e) => update("day", e.target.value, 2, yearRef.current)}
                        className={field}
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[0.6rem] font-semibold tracking-[0.28em] text-smoke uppercase">Year</span>
                      <input
                        ref={yearRef}
                        inputMode="numeric"
                        autoComplete="bday-year"
                        placeholder="YYYY"
                        value={dob.year}
                        onChange={(e) => update("year", e.target.value, 4)}
                        className={field}
                      />
                    </label>
                  </div>
                </fieldset>

                <p role="alert" className="mt-3 min-h-5 text-xs text-red-300">
                  {error}
                </p>

                <label className="mt-2 flex cursor-pointer items-center justify-center gap-3 text-xs text-mist">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="size-4 accent-gold-400"
                  />
                  Remember me on this device for {siteConfig.ageGateRememberDays} days
                </label>

                <Button type="submit" size="lg" className="mt-8 w-full">
                  Enter site
                </Button>
              </form>

              <p className="animate-fade-up mt-8 text-[0.7rem] leading-relaxed text-smoke [animation-delay:980ms]">
                Valid government-issued photo ID is required for every pickup and delivery.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Corners() {
  const base = "absolute size-5 border-gold-400/70 animate-fade-up [animation-delay:300ms]";
  return (
    <span aria-hidden>
      <span className={cn(base, "top-3 left-3 border-t border-l")} />
      <span className={cn(base, "top-3 right-3 border-t border-r")} />
      <span className={cn(base, "bottom-3 left-3 border-b border-l")} />
      <span className={cn(base, "right-3 bottom-3 border-r border-b")} />
    </span>
  );
}
