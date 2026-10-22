// Central business configuration. Everything the client still needs to confirm
// is marked TODO — swap values here and they flow through the whole site.

export const siteConfig = {
  name: "Vape Haven 369",
  shortName: "Vape Haven",
  description:
    "Windsor's premium vape boutique. Shop disposables, pod systems, e-liquids and hardware online for in-store pickup or local delivery. Adults 19+ only.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),

  locale: "en-CA",
  currency: "CAD",

  /** Minimum legal age to enter the site and purchase (Ontario: 19). */
  legalAge: 19,
  /** How long a successful age check is remembered, in days. */
  ageGateRememberDays: 30,

  /** Ontario HST. */
  tax: { rate: 0.13, label: "HST (13%)" },

  // TODO(client): confirm address, phone, email and hours.
  contact: {
    phone: "(519) 555-0169",
    email: "hello@vapehaven369.ca",
    address: {
      street: "Street address TBC",
      city: "Windsor",
      province: "ON",
      postalCode: "N9A 0A0",
      country: "CA",
    },
    mapQuery: "Windsor, Ontario, Canada",
  },
  /** Weekly hours by weekday (0 = Sunday), 24h "HH:MM". Use null for closed days. */
  timeZone: "America/Toronto",
  openingHours: [
    { open: "11:00", close: "19:00" },
    { open: "10:00", close: "21:00" },
    { open: "10:00", close: "21:00" },
    { open: "10:00", close: "21:00" },
    { open: "10:00", close: "21:00" },
    { open: "10:00", close: "22:00" },
    { open: "10:00", close: "22:00" },
  ] as ({ open: string; close: string } | null)[],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],

  // TODO(client): confirm fulfilment options, fees and delivery area.
  fulfillment: {
    pickup: {
      label: "In-store pickup",
      description: "Usually ready within the hour. Bring valid government photo ID.",
      fee: 0,
    },
    delivery: {
      label: "Local delivery",
      description: "Windsor–Essex only. ID is checked at the door — no one under 19 can sign.",
      fee: 999,
      freeOver: 10000,
    },
  },

  /**
   * Health Canada warning (Vaping Products Promotion Regulations, SOR/2020-143).
   * `fullCompliance` sizes the warning to at least 20% of the first screen as the
   * regulations describe — confirm the required treatment with the client's counsel.
   */
  healthWarning: {
    lead: "WARNING:",
    text: "Vaping products contain nicotine, a highly addictive chemical.",
    attribution: "Health Canada",
    fullCompliance: false,
  },

  /** While true, checkout runs in demo mode and no payment is taken. */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
} as const;

export const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "Disposables", href: "/shop/disposables" },
  { label: "Pods", href: "/shop/pod-systems" },
  { label: "E-Liquids", href: "/shop/e-liquids" },
  { label: "About", href: "/about" },
  { label: "Visit", href: "/contact" },
] as const;
