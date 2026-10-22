"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useDragControls, useReducedMotion, type PanInfo } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Portal } from "@/components/ui/portal";
import { mainNav, siteConfig } from "@/config/site";
import type { Category } from "@/lib/commerce/types";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useUI } from "@/lib/ui-store";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { useDialogFocus } from "@/lib/use-dialog-focus";

/** A small browser-only launcher, outside the header's fixed-position containing block. */
export function MobileMenuTrigger() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const open = useUI((s) => s.panel === "menu");
  const openPanel = useUI((s) => s.openPanel);
  useEffect(() => {
    if (pathname !== "/") return;
    let intersection: IntersectionObserver | undefined;
    const attach = () => {
      const hero = document.querySelector("[data-site-hero]");
      if (!hero) return;
      intersection = new IntersectionObserver(([entry]) => {
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
      });
      intersection.observe(hero);
      pending.disconnect();
    };
    // The home route can stream after this shared layout has hydrated.
    const pending = new MutationObserver(attach);
    pending.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    attach();
    return () => {
      pending.disconnect();
      intersection?.disconnect();
    };
  }, [pathname]);
  const visible = pathname !== "/" || pastHero;
  return (
    <button
      type="button"
      onClick={() => openPanel("menu")}
      aria-label="Open menu"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="site-menu-panel"
      hidden={!visible}
      className="browser-menu-fab fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex h-12 items-center justify-center gap-2 rounded-full border border-gold-300/40 bg-ink-900/95 px-4 text-xs font-semibold text-gold-100 shadow-[0_6px_28px_rgb(0_0_0/0.55)] backdrop-blur-xl transition-colors hover:bg-ink-700 active:bg-ink-700"
    >
      <Menu className="size-4" strokeWidth={1.5} aria-hidden="true" />
      Menu
    </button>
  );
}

export function MobileNav({ categories }: { categories: Pick<Category, "slug" | "name" | "image">[] }) {
  // Opened from the browser header or the installed app's bottom tabs.
  const open = useUI((s) => s.panel === "menu");
  const openPanel = useUI((s) => s.openPanel);
  const close = useUI((s) => s.closePanel);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useReducedMotion();
  const drag = useDragControls();
  const panel = useRef<HTMLDivElement>(null);
  useDialogFocus(open, panel, close);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const wide = matchMedia("(min-width: 1280px)");
    const onResize = () => { if (wide.matches) close(); };
    onResize();
    wide.addEventListener("change", onResize);
    return () => {
      unlockScroll();
      wide.removeEventListener("change", onResize);
    };
  }, [open, close]);

  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || (info.offset.y > 0 && info.velocity.y > 550)) close();
  };

  return (
    <>
      <button type="button" onClick={() => openPanel("menu")} aria-label="Open menu" className="-ml-2 hidden p-2 text-cream lg:block xl:hidden">
        <Menu className="size-5" strokeWidth={1.5} />
      </button>
      <Portal>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="menu-backdrop"
                aria-hidden="true"
                className="safe-area-backdrop fixed inset-0 z-[90] bg-ink-950/70 backdrop-blur-sm xl:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              />
              <motion.div
                key="menu-panel"
                id="site-menu-panel"
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                tabIndex={-1}
                className="grain fixed inset-x-0 bottom-0 z-[100] flex max-h-[calc(100dvh-max(1rem,env(safe-area-inset-top)))] flex-col overflow-hidden rounded-t-3xl border-t hairline bg-ink-950 pb-[env(safe-area-inset-bottom)] outline-none lg:inset-0 lg:max-h-none lg:rounded-none lg:border-0 lg:pt-[env(safe-area-inset-top)] xl:hidden"
                initial={desktop ? { opacity: 0 } : { y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={desktop ? { opacity: 0 } : { y: "100%" }}
                transition={{ duration: reducedMotion ? 0 : 0.35 }}
                drag={desktop ? false : "y"}
                dragListener={false}
                dragControls={drag}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={onDragEnd}
              >
                <div
                  onPointerDown={(event) => { if (!desktop && !(event.target as HTMLElement).closest("a, button")) drag.start(event); }}
                  className="shrink-0 touch-none border-b hairline"
                >
                  <div aria-hidden="true" className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink-500 lg:hidden" />
                  <div className="flex h-14 items-center justify-between px-5 lg:h-20">
                    <Link href="/" onClick={close}>
                      <Logo emblem={false} />
                    </Link>
                    <button type="button" onClick={close} aria-label="Close menu" className="-mr-2 flex size-11 items-center justify-center text-cream">
                      <X className="size-5" />
                    </button>
                  </div>
                </div>
                <div data-lenis-prevent className="min-h-0 overflow-y-auto overscroll-contain lg:flex lg:flex-1 lg:flex-col">
                  <nav aria-label="Main navigation" className="flex flex-col px-5 py-4 lg:py-8">
                    {[{ label: "Home", href: "/" }, ...mainNav.filter((n) => !n.href.startsWith("/shop/"))].map((item, i) => (
                      <motion.div
                        key={item.href}
                        initial={reducedMotion ? false : { opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reducedMotion ? 0 : 0.05 * i + 0.1, duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link href={item.href} onClick={close} className="block py-2 font-display text-3xl text-cream lg:text-4xl">
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                  <div className="border-t hairline px-5 py-5 lg:py-8">
                    <p className="eyebrow">Shop by category</p>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 lg:mt-5 lg:gap-y-3">
                      {categories.map((c) => (
                        <Link key={c.slug} href={`/shop/${c.slug}`} onClick={close} className="flex min-h-11 items-center text-sm text-mist hover:text-gold-200 lg:min-h-0">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t hairline px-5 py-5 text-sm text-mist lg:mt-auto lg:py-8">
                    <p>{siteConfig.contact.phone}</p>
                    <p className="mt-1">
                      {siteConfig.contact.address.city}, {siteConfig.contact.address.province} · Adults {siteConfig.legalAge}+
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
