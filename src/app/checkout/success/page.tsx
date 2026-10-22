import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="px-5 py-20 lg:py-28">
      <Suspense fallback={<div className="mx-auto h-[32rem] max-w-3xl animate-pulse border hairline bg-ink-850" />}>
        <OrderConfirmation />
      </Suspense>
    </div>
  );
}
