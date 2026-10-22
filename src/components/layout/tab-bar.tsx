"use client";

import { House, LayoutGrid, Menu, Search, ShoppingBag, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartBadge, useCartIcon } from "@/components/cart/cart-button";
import { useCart } from "@/lib/cart-store";
import { useUI } from "@/lib/ui-store";
import { cn } from "@/lib/utils";

type Tab = "home" | "shop" | "search" | "cart" | "menu";

const item =
  "relative flex h-full min-h-16 min-w-0 flex-col items-center justify-center gap-1 py-2 text-[0.58rem] leading-4 font-semibold tracking-[0.16em] uppercase transition-[color,scale] duration-200 active:scale-90";

/**
 * App-style navigation pinned to the bottom of the screen on phones and
 * tablets. Wrap in <Suspense> with a plain <TabBar /> fallback.
 */
export function TabBar({ pathname }: { pathname?: string }) {
  const panel = useUI((s) => s.panel);
  const openPanel = useUI((s) => s.openPanel);
  const cartOpen = useCart((s) => s.isOpen);
  const openCart = useCart((s) => s.open);
  const cart = useCartIcon<HTMLSpanElement>();

  const route: Tab | null =
    pathname === "/" ? "home" : pathname?.startsWith("/shop") || pathname?.startsWith("/products") ? "shop" : null;
  const active: Tab | null = cartOpen ? "cart" : panel ?? route;

  const tab = (id: Tab, label: string, Icon: LucideIcon, extra?: ReactNode) => (
    <>
      {active === id && (
        <motion.span
          layoutId="tab-indicator"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="bg-gold-gradient absolute inset-x-[30%] top-0 h-px"
        />
      )}
      <span
        className="relative flex size-6 shrink-0 items-center justify-center overflow-visible"
        ref={id === "cart" ? cart.scope : undefined}
        data-cart-target={id === "cart" ? "" : undefined}
      >
        <Icon className="size-[1.35rem] shrink-0 overflow-visible" strokeWidth={active === id ? 1.75 : 1.4} />
        {extra}
      </span>
      {label}
    </>
  );
  const color = (id: Tab) => (active === id ? "text-gold-200" : "text-mist");

  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-40 overflow-visible border-t hairline bg-ink-950/85 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl select-none lg:hidden"
    >
      <ul className="mx-auto grid h-16 min-h-16 max-w-lg grid-cols-5 overflow-visible">
        <li>
          <Link href="/" aria-current={route === "home" ? "page" : undefined} className={cn(item, color("home"))}>
            {tab("home", "Home", House)}
          </Link>
        </li>
        <li>
          <Link href="/shop" aria-current={route === "shop" ? "page" : undefined} className={cn(item, color("shop"))}>
            {tab("shop", "Shop", LayoutGrid)}
          </Link>
        </li>
        <li>
          <button type="button" onClick={() => openPanel("search")} className={cn(item, "w-full", color("search"))}>
            {tab("search", "Search", Search)}
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={openCart}
            aria-label={cart.label}
            className={cn(item, "w-full", color("cart"))}
          >
            {tab("cart", "Cart", ShoppingBag, <CartBadge count={cart.count} className="-top-1.5 -right-2.5" />)}
          </button>
        </li>
        <li>
          <button type="button" onClick={() => openPanel("menu")} className={cn(item, "w-full", color("menu"))}>
            {tab("menu", "Menu", Menu)}
          </button>
        </li>
      </ul>
    </nav>
  );
}

/** Highlights the current route. */
export function ActiveTabBar() {
  return <TabBar pathname={usePathname()} />;
}
