"use client";

import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import type { Category, NicotineType, Product } from "@/lib/commerce/types";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { matchesQuery, searchKeywords } from "@/lib/search";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { id: "under-25", label: "Under $25", test: (c: number) => c < 2500 },
  { id: "25-50", label: "$25 – $50", test: (c: number) => c >= 2500 && c < 5000 },
  { id: "50-100", label: "$50 – $100", test: (c: number) => c >= 5000 && c < 10000 },
  { id: "100-plus", label: "$100 +", test: (c: number) => c >= 10000 },
];

const NICOTINE: { id: NicotineType; label: string }[] = [
  { id: "salt", label: "Nicotine salt" },
  { id: "freebase", label: "Freebase" },
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name: A–Z" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

const featuredScore = (p: Product) =>
  (p.inStock ? 4 : 0) + (p.featured ? 2 : 0) + (p.badges?.includes("bestseller") ? 1 : 0);

const sorters: Record<SortId, (a: Product, b: Product) => number> = {
  featured: (a, b) => featuredScore(b) - featuredScore(a),
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

const list = (value: string | null) => (value ? value.split(",").filter(Boolean) : []);

export function ShopExplorer({
  products,
  categories,
  lockedCategory,
}: {
  products: Product[];
  categories: Category[];
  lockedCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!filtersOpen) return;
    lockScroll();
    return unlockScroll;
  }, [filtersOpen]);

  const q = params.get("q") ?? "";
  const selectedCategories = lockedCategory ? [] : list(params.get("category"));
  const selectedBrands = list(params.get("brand"));
  const selectedPrices = list(params.get("price"));
  const selectedNicotine = list(params.get("nicotine"));
  const inStockOnly = params.get("stock") === "1";
  const sort = (SORTS.find((s) => s.id === params.get("sort"))?.id ?? "featured") as SortId;

  const scope = lockedCategory ? products.filter((p) => p.category === lockedCategory) : products;
  const brands = [...new Set(scope.map((p) => p.brand))].sort();
  const hasNicotine = scope.some((p) => p.nicotine === "salt" || p.nicotine === "freebase");
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  const results = scope
      .filter((p) => !q || matchesQuery(searchKeywords(p, categoryName(p.category)), q))
      .filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.category))
      .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
      .filter((p) => selectedPrices.length === 0 || PRICE_RANGES.some((r) => selectedPrices.includes(r.id) && r.test(p.price)))
      .filter((p) => selectedNicotine.length === 0 || (p.nicotine && selectedNicotine.includes(p.nicotine)))
      .filter((p) => !inStockOnly || p.inStock)
    .sort(sorters[sort]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggle = (key: string, current: string[], value: string) => {
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setParam(key, next.length ? next.join(",") : null);
  };

  const activeChips = [
    ...selectedCategories.map((v) => ({ key: "category", value: v, label: categoryName(v), list: selectedCategories })),
    ...selectedBrands.map((v) => ({ key: "brand", value: v, label: v, list: selectedBrands })),
    ...selectedPrices.map((v) => ({ key: "price", value: v, label: PRICE_RANGES.find((r) => r.id === v)?.label ?? v, list: selectedPrices })),
    ...selectedNicotine.map((v) => ({ key: "nicotine", value: v, label: NICOTINE.find((n) => n.id === v)?.label ?? v, list: selectedNicotine })),
  ];
  const activeCount = activeChips.length + (inStockOnly ? 1 : 0) + (q ? 1 : 0);

  const clearAll = () => router.replace(params.get("sort") ? `${pathname}?sort=${params.get("sort")}` : pathname, { scroll: false });

  const filters = (
    <div className="grid gap-10">
      {!lockedCategory && (
        <FilterGroup title="Category">
          {categories.map((c) => (
            <FilterCheckbox
              key={c.slug}
              label={c.name}
              count={products.filter((p) => p.category === c.slug).length}
              checked={selectedCategories.includes(c.slug)}
              onChange={() => toggle("category", selectedCategories, c.slug)}
            />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Brand">
        {brands.map((b) => (
          <FilterCheckbox
            key={b}
            label={b}
            count={scope.filter((p) => p.brand === b).length}
            checked={selectedBrands.includes(b)}
            onChange={() => toggle("brand", selectedBrands, b)}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICE_RANGES.map((r) => (
          <FilterCheckbox
            key={r.id}
            label={r.label}
            checked={selectedPrices.includes(r.id)}
            onChange={() => toggle("price", selectedPrices, r.id)}
          />
        ))}
      </FilterGroup>
      {hasNicotine && (
        <FilterGroup title="Nicotine type">
          {NICOTINE.map((n) => (
            <FilterCheckbox
              key={n.id}
              label={n.label}
              checked={selectedNicotine.includes(n.id)}
              onChange={() => toggle("nicotine", selectedNicotine, n.id)}
            />
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Availability">
        <FilterCheckbox label="In stock only" checked={inStockOnly} onChange={() => setParam("stock", inStockOnly ? null : "1")} />
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-28">{filters}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center gap-3 border-b hairline pb-5">
          <label className="relative flex min-w-0 flex-1 basis-60 items-center">
            <Search className="pointer-events-none absolute left-0 size-4 text-smoke" strokeWidth={1.5} />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              defaultValue={q}
              key={q}
              placeholder="Search this collection"
              onKeyDown={(e) => e.key === "Enter" && setParam("q", e.currentTarget.value.trim() || null)}
              onBlur={(e) => e.currentTarget.value.trim() !== q && setParam("q", e.currentTarget.value.trim() || null)}
              className="h-11 w-full bg-transparent pl-7 text-sm text-cream placeholder:text-smoke focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-11 items-center gap-2 border hairline px-4 text-[0.65rem] font-semibold tracking-[0.22em] text-cream uppercase lg:hidden"
          >
            <SlidersHorizontal className="size-3.5" /> Filters {activeCount > 0 && <span className="text-gold-300">({activeCount})</span>}
          </button>
          <label className="inline-flex h-11 items-center gap-3 border hairline px-4">
            <span className="text-[0.6rem] font-semibold tracking-[0.22em] text-smoke uppercase">Sort</span>
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "featured" ? null : e.target.value)}
              className="cursor-pointer bg-transparent text-sm text-cream focus:outline-none [&>option]:bg-ink-800"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex min-h-14 flex-wrap items-center gap-2 py-4">
          <p className="mr-3 text-xs text-smoke">
            {results.length} {results.length === 1 ? "product" : "products"}
            {q && (
              <>
                {" "}
                for <span className="text-gold-200">“{q}”</span>
              </>
            )}
          </p>
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              type="button"
              onClick={() => toggle(chip.key, chip.list, chip.value)}
              className="inline-flex items-center gap-1.5 border border-gold-400/30 bg-gold-400/5 px-3 py-1.5 text-xs text-gold-100 hover:border-gold-300"
            >
              {chip.label} <X className="size-3" />
            </button>
          ))}
          {activeCount > 0 && (
            <button type="button" onClick={clearAll} className="text-xs text-mist underline-offset-4 hover:text-gold-200 hover:underline">
              Clear all
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center border hairline px-6 py-24 text-center">
            <p className="font-display text-3xl">No products found</p>
            <p className="mt-3 max-w-sm text-sm text-mist">Try removing a filter or searching for something else.</p>
            <Button variant="outline" size="sm" className="mt-8" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Portal>
        <AnimatePresence>
          {filtersOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-[90] bg-ink-950/70 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFiltersOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
                className="fixed inset-y-0 left-0 z-[100] flex w-full max-w-sm flex-col border-r hairline bg-ink-850 lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between border-b hairline px-6 py-5">
                  <p className="font-display text-2xl">Filters</p>
                  <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-1 text-mist">
                    <X className="size-5" />
                  </button>
                </div>
                <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-8">{filters}</div>
                <div className="grid grid-cols-2 gap-3 border-t hairline p-6">
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setFiltersOpen(false)}>
                    Show {results.length}
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4">{title}</legend>
      <div className="grid gap-3">{children}</div>
    </fieldset>
  );
}

function FilterCheckbox({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-gold-300",
          checked ? "border-gold-300 bg-gold-400 text-ink-950" : "border-ink-500 group-hover:border-gold-400/60",
        )}
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span className={cn("flex-1 transition-colors", checked ? "text-cream" : "text-mist group-hover:text-cream")}>{label}</span>
      {count !== undefined && <span className="text-xs text-smoke tabular-nums">{count}</span>}
    </label>
  );
}
