"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/brand/logo";
import { Portal } from "@/components/ui/portal";
import { mainNav, siteConfig } from "@/config/site";
import type { Category } from "@/lib/commerce/types";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useUI } from "@/lib/ui-store";

export function MobileNav({ categories }: { categories: Pick<Category, "slug" | "name" | "image">[] }) {
  // Opened from the header (lg–xl) or the mobile tab bar.
  const open = useUI((s) => s.panel === "menu");
  const openPanel = useUI((s) => s.openPanel);
  const close = useUI((s) => s.closePanel);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button type="button" onClick={() => openPanel("menu")} aria-label="Open menu" className="-ml-2 hidden p-2 text-cream lg:block xl:hidden">
        <Menu className="size-5" strokeWidth={1.5} />
      </button>
      <Portal>
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-ink-950 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex h-14 items-center justify-between border-b hairline px-5 lg:h-20">
                <Link href="/" onClick={close}>
                  <Logo emblem={false} />
                </Link>
                <button type="button" onClick={close} aria-label="Close menu" className="-mr-2 flex size-11 items-center justify-center text-cream">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col px-5 py-8">
                {[{ label: "Home", href: "/" }, ...mainNav.filter((n) => !n.href.startsWith("/shop/"))].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={item.href} onClick={close} className="block py-2 font-display text-4xl text-cream">
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="border-t hairline px-5 py-8">
                <p className="eyebrow">Shop by category</p>
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                  {categories.map((c) => (
                    <Link key={c.slug} href={`/shop/${c.slug}`} onClick={close} className="text-sm text-mist hover:text-gold-200">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-auto border-t hairline px-5 py-8 text-sm text-mist">
                <p>{siteConfig.contact.phone}</p>
                <p className="mt-1">
                  {siteConfig.contact.address.city}, {siteConfig.contact.address.province} · Adults {siteConfig.legalAge}+
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
