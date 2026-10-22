import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { CartButton } from "@/components/cart/cart-button";
import { ScrollProgress } from "@/components/fx/scroll-progress";
import { mainNav } from "@/config/site";
import { getCategories, getProducts } from "@/lib/commerce";
import { searchKeywords } from "@/lib/search";
import { HeaderShell } from "./header-shell";
import { MobileNav } from "./mobile-nav";
import { ActiveNavLinks, NavLinks } from "./nav-links";
import { SearchDialog, SearchTrigger, type SearchItem } from "./search-dialog";

const leftNav = mainNav.slice(0, 4);
const rightNav = mainNav.slice(4);

export async function Header() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";
  const searchItems: SearchItem[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    categoryName: categoryName(p.category),
    price: p.price,
    image: p.images[0],
    keywords: searchKeywords(p, categoryName(p.category)),
  }));
  const categoryLinks = categories.map(({ slug, name, image }) => ({ slug, name, image }));

  // Below `lg` the tab bar carries menu, search and cart, so the bar is just the logo.
  return (
    <HeaderShell>
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 lg:h-20 lg:px-8">
        <div className="flex items-center gap-8">
          <MobileNav categories={categoryLinks} />
          <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
            <Suspense fallback={<NavLinks items={leftNav} />}>
              <ActiveNavLinks items={leftNav} />
            </Suspense>
          </nav>
        </div>

        <Link href="/" aria-label="Vape Haven 369 — home" className="justify-self-center">
          <Logo className="[&>svg]:hidden sm:[&>svg]:block" />
        </Link>

        <div className="flex items-center justify-end gap-2 xl:gap-7">
          <nav aria-label="Secondary" className="hidden items-center gap-7 xl:flex">
            <Suspense fallback={<NavLinks items={rightNav} />}>
              <ActiveNavLinks items={rightNav} />
            </Suspense>
          </nav>
          <div className="hidden items-center lg:flex">
            <SearchTrigger />
            <CartButton />
          </div>
        </div>
      </div>
      <SearchDialog items={searchItems} categories={categoryLinks} />
      <ScrollProgress />
    </HeaderShell>
  );
}
