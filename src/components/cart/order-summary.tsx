import { siteConfig } from "@/config/site";
import type { OrderTotals } from "@/lib/commerce/types";
import { formatPrice } from "@/lib/utils";

export function OrderSummaryRows({ totals, shippingLabel }: { totals: OrderTotals; shippingLabel: string }) {
  return (
    <dl className="grid gap-3 text-sm">
      <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
      <Row label={shippingLabel} value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)} />
      <Row label={siteConfig.tax.label} value={formatPrice(totals.tax)} />
      <div className="mt-2 flex items-baseline justify-between border-t hairline pt-5">
        <dt className="text-xs font-semibold tracking-[0.24em] text-mist uppercase">Total</dt>
        <dd className="font-display text-3xl text-gold-100 tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-mist">{label}</dt>
      <dd className="text-cream tabular-nums">{value}</dd>
    </div>
  );
}
