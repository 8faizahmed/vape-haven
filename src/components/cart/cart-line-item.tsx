"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, type CartLine } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { QuantityStepper } from "./quantity-stepper";

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const options = Object.entries(line.options);

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${line.slug}`}
        onClick={onNavigate}
        className="relative size-24 shrink-0 overflow-hidden border hairline bg-ink-950"
      >
        <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.6rem] font-semibold tracking-[0.28em] text-gold-300 uppercase">{line.brand}</p>
            <Link
              href={`/products/${line.slug}`}
              onClick={onNavigate}
              className="mt-1 block truncate font-display text-lg leading-tight hover:text-gold-200"
            >
              {line.name}
            </Link>
          </div>
          <p className="shrink-0 text-sm text-gold-100 tabular-nums">{formatPrice(line.price * line.quantity)}</p>
        </div>
        {options.length > 0 && (
          <p className="mt-1 text-xs text-smoke">{options.map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper size="sm" value={line.quantity} onChange={(q) => setQuantity(line.key, q)} />
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="text-[0.65rem] font-semibold tracking-[0.2em] text-smoke uppercase transition-colors hover:text-gold-200"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
