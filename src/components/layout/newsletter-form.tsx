"use client";

import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// TODO: connect to the client's email platform (Klaviyo, Mailchimp, etc.).
export function NewsletterForm({ className }: { className?: string }) {
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <p className={cn("flex items-center gap-3 text-sm text-gold-200", className)}>
        <Check className="size-4" /> You&apos;re on the list. Watch your inbox for new arrivals.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)}>
      <div className="flex border-b border-gold-400/40 focus-within:border-gold-300">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="w-full bg-transparent py-3 text-sm text-cream placeholder:text-smoke focus:outline-none"
        />
        <button type="submit" className="shrink-0 pl-4 text-[0.65rem] font-semibold tracking-[0.24em] text-gold-200 uppercase hover:text-gold-50">
          Subscribe
        </button>
      </div>
      <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs text-smoke">
        <input type="checkbox" required className="mt-0.5 size-3.5 accent-gold-400" />
        I confirm I am {siteConfig.legalAge} or older and agree to receive emails. Unsubscribe anytime.
      </label>
    </form>
  );
}
