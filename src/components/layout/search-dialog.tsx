"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Portal } from "@/components/ui/portal";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useUI } from "@/lib/ui-store";
import { matchesQuery } from "@/lib/search";
import { formatPrice } from "@/lib/utils";

export type SearchItem = {
  slug: string;
  name: string;
  brand: string;
  categoryName: string;
  price: number;
  image: string;
  keywords: string;
};

/** Header search icon in browsers; installed apps also have a tab-bar trigger. */
export function SearchTrigger() {
  const openPanel = useUI((s) => s.openPanel);
  return (
    <button
      type="button"
      onClick={() => openPanel("search")}
      aria-label="Search products"
      className="flex size-11 items-center justify-center text-cream transition-colors hover:text-gold-200"
    >
      <Search className="size-5" strokeWidth={1.5} />
    </button>
  );
}

export function SearchDialog({
  items,
  categories,
}: {
  items: SearchItem[];
  categories: { slug: string; name: string }[];
}) {
  const open = useUI((s) => s.panel === "search");
  const openPanel = useUI((s) => s.openPanel);
  const closePanel = useUI((s) => s.closePanel);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => (query.trim() ? items.filter((i) => matchesQuery(i.keywords, query)).slice(0, 6) : []), [items, query]);

  const close = () => {
    closePanel();
    setQuery("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && useUI.getState().panel === "search") {
        useUI.getState().closePanel();
        setQuery("");
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPanel("search");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openPanel]);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    return unlockScroll;
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    close();
  };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="safe-area-backdrop fixed inset-0 z-[90] bg-ink-950/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              data-lenis-prevent
              className="grain fixed inset-x-0 top-0 z-[100] max-h-dvh overflow-y-auto overscroll-contain border-b hairline bg-ink-850 pt-[env(safe-area-inset-top)]"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mx-auto max-w-4xl px-5 pt-6 pb-8 lg:py-12">
                <form onSubmit={submit} className="flex items-center gap-4 border-b border-gold-400/30 pb-4">
                  <Search className="size-6 shrink-0 text-gold-300" strokeWidth={1.25} />
                  <input
                    autoFocus
                    type="search"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search devices, flavours, brands…"
                    aria-label="Search products"
                    className="w-full bg-transparent font-display text-3xl text-cream placeholder:text-smoke focus:outline-none sm:text-4xl"
                  />
                  <button type="button" onClick={close} aria-label="Close search" className="-mr-2 flex size-11 shrink-0 items-center justify-center text-mist hover:text-gold-200">
                    <X className="size-5" />
                  </button>
                </form>

                {query.trim() ? (
                  <div className="mt-6">
                    {results.length === 0 ? (
                      <p className="py-6 text-sm text-mist">No products match “{query}”.</p>
                    ) : (
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {results.map((item) => (
                          <li key={item.slug}>
                            <Link
                              href={`/products/${item.slug}`}
                              onClick={close}
                              className="flex items-center gap-4 p-2 transition-colors hover:bg-ink-700"
                            >
                              <span className="relative size-14 shrink-0 overflow-hidden border hairline">
                                <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-display text-lg">{item.name}</span>
                                <span className="text-xs text-smoke">
                                  {item.brand} · {item.categoryName}
                                </span>
                              </span>
                              <span className="text-sm text-gold-100">{formatPrice(item.price)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      type="submit"
                      onClick={submit}
                      className="mt-6 inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.24em] text-gold-200 uppercase hover:text-gold-50"
                    >
                      See all results <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-8">
                    <p className="eyebrow">Browse categories</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/shop/${c.slug}`}
                          onClick={close}
                          className="border hairline px-4 py-2 text-sm text-mist transition-colors hover:border-gold-300 hover:text-gold-100"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
