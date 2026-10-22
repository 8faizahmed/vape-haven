"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Money } from "@/lib/commerce/types";

export const MAX_LINE_QUANTITY = 10;

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: Money;
  options: Record<string, string>;
  quantity: number;
};

type NewLine = Omit<CartLine, "key" | "quantity">;

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  hasHydrated: boolean;
  /** Opens the cart drawer unless `open: false` (e.g. when a fly-to-cart animation will open it). */
  add: (line: NewLine, quantity?: number, options?: { open?: boolean }) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const lineKey = (productId: string, options: Record<string, string>) =>
  [productId, ...Object.entries(options).map(([k, v]) => `${k}=${v}`)].join("|");

const clamp = (n: number) => Math.max(1, Math.min(MAX_LINE_QUANTITY, n));

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      hasHydrated: false,
      add: (line, quantity = 1, { open = true } = {}) =>
        set((state) => {
          const key = lineKey(line.productId, line.options);
          const existing = state.lines.find((l) => l.key === key);
          const lines = existing
            ? state.lines.map((l) => (l.key === key ? { ...l, quantity: clamp(l.quantity + quantity) } : l))
            : [...state.lines, { ...line, key, quantity: clamp(quantity) }];
          return { lines, isOpen: open || state.isOpen };
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.key === key ? { ...l, quantity: clamp(quantity) } : l)),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "vh-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      // Rehydrated from <CartHydrator /> after mount to avoid SSR mismatches.
      skipHydration: true,
      onRehydrateStorage: () => () => useCart.setState({ hasHydrated: true }),
    },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.price * l.quantity, 0);
