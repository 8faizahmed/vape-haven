"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Loads the persisted cart from localStorage after the first client render. */
export function CartHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
