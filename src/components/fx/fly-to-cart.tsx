"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";

const FLY_EVENT = "vh:fly-to-cart";
export const CART_BUMP_EVENT = "vh:cart-bump";

type Flight = { id: number; image: string; from: DOMRect; to: DOMRect };

/**
 * Sends a product image arcing into the cart icon (header on desktop, tab bar
 * on mobile), then opens the cart. Call after adding to the cart with `{ open: false }`.
 */
export function flyToCart(source: Element | null | undefined, image: string) {
  // Reuse the already-decoded <img> (Next's optimised URL) so the clone is visible instantly.
  const img = source instanceof HTMLImageElement ? source : source?.querySelector("img");
  const src = img?.currentSrc || image;
  window.dispatchEvent(new CustomEvent(FLY_EVENT, { detail: { rect: source?.getBoundingClientRect(), image: src } }));
}

let nextId = 0;

export function FlyToCart() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const onFly = (e: Event) => {
      const { rect, image } = (e as CustomEvent<{ rect?: DOMRect; image: string }>).detail;
      // Whichever cart icon is currently on screen.
      const to = [...document.querySelectorAll("[data-cart-target]")]
        .map((el) => el.getBoundingClientRect())
        .find((r) => r.width > 0);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!rect || !to || reduced || rect.bottom < 0 || rect.top > innerHeight) {
        useCart.getState().open();
        return;
      }
      setFlights((f) => [...f, { id: nextId++, image, from: rect, to }]);
    };
    window.addEventListener(FLY_EVENT, onFly);
    return () => window.removeEventListener(FLY_EVENT, onFly);
  }, []);

  const land = (id: number) => {
    setFlights((f) => f.filter((flight) => flight.id !== id));
    window.dispatchEvent(new Event(CART_BUMP_EVENT));
    navigator.vibrate?.(12); // A light tap as it lands, where the device supports it.
    setTimeout(() => useCart.getState().open(), 180);
  };

  return (
    <>
      {flights.map(({ id, image, from, to }) => {
        const size = Math.min(from.width, 220);
        const startX = from.left + from.width / 2 - size / 2;
        const startY = from.top + from.height / 2 - size / 2;
        const endX = to.left + to.width / 2 - size / 2;
        const endY = to.top + to.height / 2 - size / 2;
        return (
          <motion.img
            key={id}
            src={image}
            alt=""
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-[95] border border-gold-300/60 bg-ink-900 object-cover shadow-[0_0_60px_rgba(212,171,85,0.55)]"
            style={{ width: size, height: size }}
            initial={{ x: startX, y: startY, scale: 1, opacity: 1, borderRadius: "0%" }}
            animate={{
              x: [startX, (startX + endX) / 2, endX],
              y: [startY, Math.min(startY, endY) - 160, endY],
              scale: [1, 0.55, 0.12],
              opacity: [1, 1, 0.7],
              borderRadius: ["0%", "24%", "50%"],
            }}
            transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1], times: [0, 0.45, 1] }}
            onAnimationComplete={() => land(id)}
          />
        );
      })}
    </>
  );
}
