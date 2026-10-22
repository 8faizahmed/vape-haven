"use client";

import { ShoppingBag } from "lucide-react";
import { useAnimate } from "motion/react";
import { useEffect } from "react";
import { CART_BUMP_EVENT } from "@/components/fx/fly-to-cart";
import { cartCount, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

/** Item count once the persisted cart has loaded, plus a ref that bumps when something lands in it. */
export function useCartIcon<T extends HTMLElement>() {
  const count = useCart((s) => cartCount(s.lines));
  const hydrated = useCart((s) => s.hasHydrated);
  const [scope, animate] = useAnimate<T>();

  useEffect(() => {
    const bump = () => animate(scope.current, { scale: [1, 1.35, 0.92, 1] }, { duration: 0.55, ease: "easeOut" });
    window.addEventListener(CART_BUMP_EVENT, bump);
    return () => window.removeEventListener(CART_BUMP_EVENT, bump);
  }, [animate, scope]);

  return { count: hydrated ? count : 0, label: `Open cart${hydrated ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`, scope };
}

export function CartBadge({ count, className }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        "bg-gold-gradient absolute flex size-[1.15rem] items-center justify-center rounded-full text-[0.6rem] font-bold text-ink-950 tabular-nums",
        className,
      )}
    >
      {count}
    </span>
  );
}

export function CartButton({ className }: { className?: string }) {
  const open = useCart((s) => s.open);
  const { count, label, scope } = useCartIcon<HTMLButtonElement>();

  return (
    <button
      ref={scope}
      data-cart-target
      type="button"
      onClick={open}
      aria-label={label}
      className={cn("relative flex size-11 items-center justify-center text-cream transition-colors hover:text-gold-200", className)}
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      <CartBadge count={count} className="top-1 right-0.5" />
    </button>
  );
}
