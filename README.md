# Vape Haven 369 — website & online store

Landing page and online store for Vape Haven 369, a specialty vape boutique in Windsor, Ontario.
Built with Next.js 16 (App Router, Cache Components) and Tailwind CSS v4, and ready to deploy on Vercel.

The store currently runs on a **sample catalogue in demo mode**. Shoppers can browse, filter, add to cart and
place a demo order, but no payment is taken. It is structured so the real product list and Clover can drop in
without touching the UI.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values as needed
npm run dev                  # http://localhost:3000
```

| Script           | What it does                                       |
| ---------------- | -------------------------------------------------- |
| `npm run dev`    | Local dev server                                   |
| `npm run build`  | Production build                                   |
| `npm run lint`   | ESLint                                             |
| `npm run images` | Generate any missing site imagery with Gemini      |
| `npm run videos` | Generate/encode background videos with Veo 3.1     |

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel (framework preset: Next.js, no overrides needed).
2. Add environment variables from `.env.example` (only `NEXT_PUBLIC_DEMO_MODE` and `COMMERCE_PROVIDER` matter
   for the demo). **Do not** add `GEMINI_API_KEY` to Vercel — it's only used by the local image script.
3. Deploy. Pages are prerendered; the catalogue revalidates every few minutes.

## Signature experience

| Moment | Where |
| --- | --- |
| Cinematic age gate: self-drawing emblem, vapour video, gold line + curtain reveal | `components/age-gate.tsx` |
| Hero with Veo push-in video, masked word reveal, scroll parallax | `components/home/hero*.tsx` |
| Cursor-driven vapour: a real-time WebGL2 fluid simulation (tune it via `CONFIG`) | `components/fx/vapor-fluid.tsx` |
| Live "Open now · until 9 PM" status from `openingHours` | `components/open-status.tsx`, `lib/hours.ts` |
| Pinned horizontal collection driven by vertical scroll (swipe carousel on phones) | `components/home/collection-scroller.tsx` |
| Product spotlight with rotating device video and count-up specs | `components/home/product-spotlight.tsx`, `data/spotlight.ts` |
| Three-question device finder that recommends real catalogue products | `components/home/device-finder.tsx` |
| Gold cursor with "View" state, magnetic CTAs, 3D card tilt, cursor-follow glow | `components/fx/*` |
| Add to cart: product flies into the bag, icon bumps, cart opens | `components/fx/fly-to-cart.tsx` |
| Product image morphs from grid to product page (View Transitions) | `product-card.tsx`, `product-gallery.tsx` |
| Smooth wheel scrolling, scroll progress line, footer wordmark that fills on scroll | `fx/smooth-scroll.tsx`, `fx/scroll-progress.tsx`, `layout/footer-wordmark.tsx` |

Everything degrades gracefully: touch devices get native scrolling and no custom cursor, and visitors with
"reduce motion" enabled get static posters and instant transitions. Videos only download when near the viewport.

## Where things live

```
src/config/site.ts          Business details, hours, fees, tax, legal age, health warning  ← edit first
src/data/products.ts        Sample catalogue (replace with the client's product list)
src/data/categories.ts      Store categories and their imagery
src/data/policies.ts        Template policy pages (need client/legal review)
src/lib/commerce/           Commerce layer — the UI only talks to this
  index.ts                  Cached data API (getProducts, getProduct, createCheckout…)
  providers/mock.ts         Demo provider (sample data, simulated checkout)
  providers/clover.ts       Clover provider scaffold (REST inventory + Hosted Checkout)
src/components/brand/logo.tsx  Placeholder wordmark — swap for the real logo
scripts/image-manifest.mjs  Prompts for every generated image
```

## Swapping in the real catalogue

**Option A — static list.** Replace the entries in `src/data/products.ts`. Each product needs a unique `id` and
`slug`, a `category` matching a slug in `categories.ts`, a price in cents, and at least one image. Real product
photos go in `public/images/products/`.

**Option B — Clover inventory.** Set `COMMERCE_PROVIDER=clover` plus the `CLOVER_*` variables. Products are read
from Clover's inventory API; images and descriptions are merged in from `src/data/products.ts` by matching the
Clover item SKU to the local product `id` (or the item name). Clover categories are mapped to site categories by
name. Flavour/strength variants (Clover item groups) still need mapping — see the `TODO` in `clover.ts`.

## Going live with Clover payments

The checkout already collects customer details and fulfilment choice, validates them server-side
(`src/app/api/checkout/route.ts`), and recomputes totals from catalogue prices. With the Clover provider enabled,
`createCheckout` creates a **Clover Hosted Checkout** session and redirects the shopper to Clover's secure payment
page, so card data never touches this site. Before launch:

- Verify the provider against a Clover sandbox merchant (endpoints follow docs.clover.com).
- Configure the success redirect in Clover to `https://<domain>/checkout/success?order=<id>`.
- Set `NEXT_PUBLIC_DEMO_MODE=false`.
- Consider a webhook to mark orders paid and notify staff.

## Compliance notes (Ontario / Health Canada)

These are implemented as sensible defaults. **The client should confirm them with counsel before launch.**

- **Age gate:** date-of-birth check on entry (19+), remembered for 30 days. Health Canada notes that a simple
  "check the box" isn't sufficient age verification for online promotion. If stronger verification is required,
  plug a third-party age/ID verification service into `src/components/age-gate.tsx`.
- **Health warning:** displayed on every page per the Vaping Products Promotion Regulations format (black on white,
  bordered, "Health Canada" attribution). The regulations describe the warning occupying at least 20% of the
  advertisement's visible area. Set `healthWarning.fullCompliance: true` in `site.ts` to size it to 20% of the
  first screen.
- **ID at fulfilment:** checkout requires an age confirmation, and pickup/delivery copy states that photo ID is
  checked on every order.
- **Imagery & copy:** no people, no lifestyle scenes, and no confectionery/dessert flavour names in the sample data.

## Imagery

All imagery was generated with Google's Gemini image model (`gemini-3-pro-image`). It is unbranded, text-free
product and interior photography, so it stays usable after the demo. Web-optimised WebP files live in
`public/images/`. Full-resolution originals (up to 4K) are written to `assets/originals/`, which is git-ignored
to keep the repo light, so archive that folder somewhere safe.

```bash
npm run images                          # generate anything missing
npm run images -- storefront --force    # regenerate one image
```

Requires `GEMINI_API_KEY` in `.env.local`. Prompts live in `scripts/image-manifest.mjs`.

### Video

Background videos are generated with Veo 3.1 (`scripts/generate-videos.mjs`) — the hero and spotlight clips
start from the matching still image. Each 8-second clip becomes a seamless 16-second forward/reverse loop with audio
stripped, encoded as desktop (1280px) and mobile (854px) MP4s plus a poster frame in `public/videos/`.

The hero is the exception: its 720p Veo clip was upscaled 4x with [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)
(`realesrgan-x4plus`), blended 65/35 with the original to keep natural texture, given light per-frame film grain,
and saved as a 2560×1440 master at `assets/originals/videos/hero-boutique-upscaled.mp4`. The script encodes from any
`<name>-upscaled.mp4` master it finds, so the hero ships at 1920px desktop / 960px mobile.

```bash
npm run videos                    # generate anything missing
npm run videos -- --force         # re-encode from saved originals (free)
npm run videos -- --regenerate    # request new clips from Veo (billed per second of video)
```

Replace `storefront.webp` and the interior shots with real photos of the shop once available.

## Client to-do before launch

- [ ] Logo (replace `src/components/brand/logo.tsx` and `src/app/icon.svg`)
- [ ] Product list, prices and real product photos
- [ ] Address, phone, email, opening hours (`openingHours`), social links (`src/config/site.ts`)
- [ ] Spotlight product choice (`src/data/spotlight.ts`)
- [ ] Pickup/delivery fees and area, returns policy, policy page wording
- [ ] About page story
- [ ] Clover merchant credentials
- [ ] Newsletter and contact form destinations (currently demo-only)
- [ ] Legal review of age verification and health warning treatment
