import Link from "next/link";
import type { Category } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

export function CategoryTabs({ categories, active }: { categories: Category[]; active?: string }) {
  const items = [{ slug: "", name: "All products" }, ...categories];
  return (
    <nav aria-label="Categories" className="scrollbar-none -mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
      <ul className="flex min-w-max gap-2 py-8">
        {items.map((c) => {
          const isActive = (active ?? "") === c.slug;
          return (
            <li key={c.slug || "all"}>
              <Link
                href={c.slug ? `/shop/${c.slug}` : "/shop"}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center border px-5 text-[0.65rem] font-semibold tracking-[0.22em] uppercase transition-colors",
                  isActive
                    ? "border-gold-300 bg-gold-400/10 text-gold-100"
                    : "hairline text-mist hover:border-gold-400/50 hover:text-cream",
                )}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
