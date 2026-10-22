"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

export function NavLinks({ items, pathname }: { items: readonly NavItem[]; pathname?: string }) {
  return (
    <>
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/shop" && pathname?.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative py-2 text-[0.68rem] font-semibold tracking-[0.24em] uppercase transition-colors duration-300",
              "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-300 after:transition-transform after:duration-500 hover:text-gold-100 hover:after:scale-x-100",
              active ? "text-gold-200 after:scale-x-100" : "text-mist",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

/** Highlights the current route. Wrap in <Suspense> with a plain <NavLinks /> fallback. */
export function ActiveNavLinks({ items }: { items: readonly NavItem[] }) {
  return <NavLinks items={items} pathname={usePathname()} />;
}
