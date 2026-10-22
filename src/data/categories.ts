import type { Category } from "@/lib/commerce/types";

export const categories: Category[] = [
  {
    slug: "disposables",
    name: "Disposables",
    tagline: "Ready out of the box",
    description:
      "Pre-filled, pre-charged devices with no setup or refilling. Rechargeable options available.",
    image: "/images/categories/disposables.webp",
  },
  {
    slug: "pod-systems",
    name: "Pod Systems",
    tagline: "Refillable & closed pods",
    description:
      "Compact, pocket-sized devices that pair with replaceable pods for a lower long-term cost.",
    image: "/images/categories/pod-systems.webp",
  },
  {
    slug: "e-liquids",
    name: "E-Liquids",
    tagline: "Nic salt & freebase",
    description:
      "Nicotine salt and freebase e-liquids in a range of strengths, including nicotine-free options.",
    image: "/images/categories/e-liquids.webp",
  },
  {
    slug: "advanced-kits",
    name: "Advanced Kits",
    tagline: "Box mods & sub-ohm tanks",
    description:
      "Adjustable-wattage mods and sub-ohm tanks for experienced users who want full control.",
    image: "/images/categories/advanced-kits.webp",
  },
  {
    slug: "coils-pods",
    name: "Coils & Pods",
    tagline: "Replacement parts",
    description: "Genuine replacement coils and pods to keep your device performing like new.",
    image: "/images/categories/coils-pods.webp",
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Batteries, chargers & cases",
    description: "Batteries, smart chargers, cables and cases — the essentials for every setup.",
    image: "/images/categories/accessories.webp",
  },
];
