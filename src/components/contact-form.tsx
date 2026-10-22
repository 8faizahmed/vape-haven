"use client";

import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

// TODO: send to the client's inbox (e.g. Resend, Formspree, or a server action).
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center border hairline px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-gold-300/60 text-gold-200">
          <Check className="size-6" strokeWidth={1.25} />
        </span>
        <p className="mt-6 font-display text-3xl">Message sent</p>
        <p className="mt-2 text-sm text-mist">Thanks for reaching out — we&apos;ll reply within one business day.</p>
      </div>
    );
  }

  const field =
    "w-full min-w-0 border hairline bg-ink-950/50 px-4 text-base text-cream transition-colors focus:border-gold-300 focus:outline-none lg:text-sm";
  const label = "text-[0.6rem] font-semibold tracking-[0.26em] text-smoke uppercase";

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2">
        <span className={label}>Name</span>
        <input required name="name" autoComplete="name" className={`${field} h-12`} />
      </label>
      <label className="grid gap-2">
        <span className={label}>Email</span>
        <input required type="email" name="email" autoComplete="email" className={`${field} h-12`} />
      </label>
      <label className="grid gap-2 sm:col-span-2">
        <span className={label}>Subject</span>
        <select name="subject" className={`${field} h-12 [&>option]:bg-ink-800`}>
          <option>Product question</option>
          <option>Existing order</option>
          <option>Stock request</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="grid gap-2 sm:col-span-2">
        <span className={label}>Message</span>
        <textarea required name="message" rows={5} className={`${field} resize-none py-3`} />
      </label>
      <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start">
        Send message
      </Button>
    </form>
  );
}
