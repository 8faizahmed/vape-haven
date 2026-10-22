import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Suspense } from "react";
import { AgeGate } from "@/components/age-gate";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartHydrator } from "@/components/cart/cart-hydrator";
import { Cursor } from "@/components/fx/cursor";
import { FlyToCart } from "@/components/fx/fly-to-cart";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import { HealthWarning } from "@/components/health-warning";
import { InlineScript } from "@/components/inline-script";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ActiveTabBar, TabBar } from "@/components/layout/tab-bar";
import { siteConfig } from "@/config/site";
import { ageGateScript } from "@/lib/age-gate";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium Vape Boutique in Windsor, Ontario`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">
        <InlineScript html={ageGateScript} />
        <div id="site" className="flex min-h-dvh flex-col">
          <HealthWarning />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Suspense fallback={<TabBar />}>
            <ActiveTabBar />
          </Suspense>
        </div>
        <CartDrawer />
        <FlyToCart />
        <AgeGate />
        <Cursor />
        <SmoothScroll />
        <CartHydrator />
      </body>
    </html>
  );
}
