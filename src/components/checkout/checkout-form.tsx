"use client";

import { CreditCard, IdCard, LoaderCircle, Lock, Store, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { OrderSummaryRows } from "@/components/cart/order-summary";
import { Button, ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { calculateTotals } from "@/lib/commerce/pricing";
import type { CheckoutRequest, CheckoutResult, FulfillmentMethod } from "@/lib/commerce/types";
import { cn, formatPrice } from "@/lib/utils";

export const LAST_ORDER_KEY = "vh-last-order";

export function CheckoutForm() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hasHydrated);
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartSubtotal(lines);
  const totals = calculateTotals(subtotal, fulfillment);
  const { pickup, delivery } = siteConfig.fulfillment;

  if (!hydrated) return <div className="h-[40rem] animate-pulse border hairline bg-ink-850" />;

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center border hairline px-6 py-24 text-center">
        <p className="font-display text-4xl">Your cart is empty</p>
        <p className="mt-3 text-sm text-mist">Add a few products before checking out.</p>
        <ButtonLink href="/shop" className="mt-10">
          Shop the collection
        </ButtonLink>
      </div>
    );
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();

    const request: CheckoutRequest = {
      lines: lines.map((l) => ({ productId: l.productId, quantity: l.quantity, options: l.options })),
      customer: {
        firstName: get("firstName"),
        lastName: get("lastName"),
        email: get("email"),
        phone: get("phone"),
      },
      fulfillment,
      address:
        fulfillment === "delivery"
          ? { street: get("street"), unit: get("unit"), city: get("city"), postalCode: get("postalCode") }
          : undefined,
      notes: get("notes"),
    };

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const result = (await res.json()) as CheckoutResult;
      if (!result.ok) throw new Error(result.error);

      sessionStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify({
          orderId: result.orderId,
          totals: result.totals,
          fulfillment,
          firstName: request.customer.firstName,
          email: request.customer.email,
          lines,
        }),
      );
      if (result.redirectUrl.startsWith("/")) router.push(result.redirectUrl);
      else window.location.href = result.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div className="grid gap-12">
        <Step number={1} title="Your details" description="Use the name on your government-issued photo ID.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" name="firstName" autoComplete="given-name" required />
            <Field label="Last name" name="lastName" autoComplete="family-name" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
          </div>
        </Step>

        <Step number={2} title="Pickup or delivery">
          <div className="grid gap-3 sm:grid-cols-2">
            <FulfillmentOption
              icon={<Store className="size-5" strokeWidth={1.25} />}
              title={pickup.label}
              price="Free"
              description={pickup.description}
              checked={fulfillment === "pickup"}
              onSelect={() => setFulfillment("pickup")}
            />
            <FulfillmentOption
              icon={<Truck className="size-5" strokeWidth={1.25} />}
              title={delivery.label}
              price={subtotal >= delivery.freeOver ? "Free" : formatPrice(delivery.fee)}
              description={delivery.description}
              checked={fulfillment === "delivery"}
              onSelect={() => setFulfillment("delivery")}
            />
          </div>
          {fulfillment === "delivery" && (
            <div className="mt-6 grid gap-4 sm:grid-cols-6">
              <Field label="Street address" name="street" autoComplete="address-line1" required className="sm:col-span-4" />
              <Field label="Unit (optional)" name="unit" autoComplete="address-line2" className="sm:col-span-2" />
              <Field label="City" name="city" autoComplete="address-level2" defaultValue="Windsor" required className="sm:col-span-3" />
              <Field label="Postal code" name="postalCode" autoComplete="postal-code" required className="sm:col-span-3" />
            </div>
          )}
          <label className="mt-6 grid gap-2">
            <span className="text-[0.6rem] font-semibold tracking-[0.26em] text-smoke uppercase">Order notes (optional)</span>
            <textarea
              name="notes"
              rows={3}
              className="w-full resize-none border hairline bg-ink-950/50 px-4 py-3 text-sm text-cream focus:border-gold-300 focus:outline-none"
            />
          </label>
        </Step>

        <Step number={3} title="Payment">
          <div className="border border-dashed border-gold-400/30 bg-ink-850 p-6">
            <div className="flex items-center gap-3 text-cream">
              <CreditCard className="size-5 text-gold-300" strokeWidth={1.25} />
              <p className="font-display text-xl">Secure payment by Clover</p>
              <Lock className="ml-auto size-4 text-smoke" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              {siteConfig.demoMode
                ? "Demo mode: no payment will be taken. When the store goes live, you'll complete payment on Clover's secure hosted checkout."
                : "You'll be redirected to Clover's secure hosted checkout to complete payment."}
            </p>
          </div>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-mist">
            <input type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-gold-400" />
            <span>
              I confirm I am {siteConfig.legalAge} or older and will present valid government-issued photo ID matching
              this order at pickup or delivery.
            </span>
          </label>
        </Step>
      </div>

      <aside className="h-fit border hairline bg-ink-850 p-7 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl">Order summary</h2>
        <ul className="mt-4 grid max-h-80 gap-4 overflow-y-auto pt-2 pr-2">
          {lines.map((line) => (
            <li key={line.key} className="flex items-center gap-4">
              <span className="relative size-16 shrink-0 border hairline">
                <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
                <span className="bg-gold-gradient absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full text-[0.6rem] font-bold text-ink-950">
                  {line.quantity}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg leading-tight">{line.name}</span>
                <span className="block truncate text-xs text-smoke">{Object.values(line.options).join(" · ")}</span>
              </span>
              <span className="text-sm text-cream tabular-nums">{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t hairline pt-6">
          <OrderSummaryRows totals={totals} shippingLabel={fulfillment === "pickup" ? pickup.label : delivery.label} />
        </div>

        <p role="alert" className="mt-4 min-h-5 text-sm text-red-300">
          {error}
        </p>
        <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Placing order
            </>
          ) : siteConfig.demoMode ? (
            "Place demo order"
          ) : (
            "Continue to payment"
          )}
        </Button>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-smoke">
          <IdCard className="size-4 shrink-0" strokeWidth={1.5} /> ID is checked on every order. No one under{" "}
          {siteConfig.legalAge} can collect or sign for a delivery.
        </p>
      </aside>
    </form>
  );
}

function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-4 border-b hairline pb-4">
        <span className="font-display text-lg text-gold-300 italic">0{number}</span>
        <div>
          <h2 className="font-display text-3xl">{title}</h2>
          {description && <p className="mt-1 text-xs text-smoke">{description}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  className,
  ...props
}: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-[0.6rem] font-semibold tracking-[0.26em] text-smoke uppercase">{label}</span>
      <input
        {...props}
        className="h-12 w-full border hairline bg-ink-950/50 px-4 text-sm text-cream transition-colors focus:border-gold-300 focus:outline-none"
      />
    </label>
  );
}

function FulfillmentOption({
  icon,
  title,
  price,
  description,
  checked,
  onSelect,
}: {
  icon: ReactNode;
  title: string;
  price: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-3 border p-5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-gold-300",
        checked ? "border-gold-300 bg-gold-400/5" : "border-ink-500 hover:border-gold-400/50",
      )}
    >
      <input type="radio" name="fulfillment" checked={checked} onChange={onSelect} className="sr-only" />
      <span className="flex items-center justify-between">
        <span className={checked ? "text-gold-200" : "text-mist"}>{icon}</span>
        <span className="text-sm text-gold-100">{price}</span>
      </span>
      <span className="font-display text-xl text-cream">{title}</span>
      <span className="text-xs leading-relaxed text-mist">{description}</span>
    </label>
  );
}
