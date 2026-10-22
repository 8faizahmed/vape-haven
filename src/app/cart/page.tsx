import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Breadcrumbs } from "@/components/page-hero";
import { Accent } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 pb-28 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-8 mb-12 font-display text-5xl font-medium sm:text-6xl">
        Your <Accent>cart.</Accent>
      </h1>
      <CartView />
    </div>
  );
}
