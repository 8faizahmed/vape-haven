import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Breadcrumbs } from "@/components/page-hero";
import { Accent } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 pb-28 lg:px-8">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-8 mb-12 font-display text-5xl font-medium sm:text-6xl">
        Secure <Accent>checkout.</Accent>
      </h1>
      <CheckoutForm />
    </div>
  );
}
