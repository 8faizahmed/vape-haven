// TEMPLATE POLICIES — placeholder wording for the demo. The client must review
// these (ideally with legal counsel) before launch.

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
};

const { legalAge, fulfillment, contact, name } = siteConfig;

export const policies: Policy[] = [
  {
    slug: "pickup-delivery",
    title: "Pickup & delivery",
    summary: "How in-store pickup and local delivery work, including ID requirements.",
    sections: [
      {
        heading: "In-store pickup",
        body: [
          "Orders placed during opening hours are usually ready within one hour. We'll email you when your order is ready.",
          `Pickup orders are held for 7 days. Please bring valid government-issued photo ID showing you are ${legalAge} or older. The name on the ID must match the name on the order.`,
        ],
      },
      {
        heading: "Local delivery",
        body: [
          `We deliver across Windsor–Essex for ${formatPrice(fulfillment.delivery.fee)}, or free on orders over ${formatPrice(fulfillment.delivery.freeOver)}.`,
          `A person ${legalAge} or older must be present to sign for the order and show valid photo ID. We cannot leave orders unattended, at a door, or with anyone under ${legalAge}. Orders that can't be delivered are returned to the store.`,
        ],
      },
      {
        heading: "Shipping outside Windsor–Essex",
        body: ["We don't currently ship outside our local delivery area."],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & warranty",
    summary: "What can be returned, and how manufacturer warranties work.",
    sections: [
      {
        heading: "Returns",
        body: [
          "Unopened hardware in its original, sealed packaging may be returned within 14 days of purchase with proof of purchase, for a refund to the original payment method or store credit.",
          "For health and safety reasons, opened e-liquids, pods, coils and disposable devices cannot be returned.",
        ],
      },
      {
        heading: "Defective products",
        body: [
          "Devices that are defective out of the box can be exchanged within 7 days. After that, devices are covered by the manufacturer's warranty — bring the device and receipt in store and we'll help you with the claim.",
        ],
      },
    ],
  },
  {
    slug: "age-verification",
    title: "Age verification",
    summary: `Why and how we verify that every customer is ${legalAge} or older.`,
    sections: [
      {
        heading: "Our commitment",
        body: [
          `${name} sells vaping products, which are restricted to adults ${legalAge} and older in Ontario. We verify age when you enter this website and again whenever an order is collected or delivered.`,
        ],
      },
      {
        heading: "At pickup and delivery",
        body: [
          "We accept valid, government-issued photo ID such as a driver's licence, Ontario Photo Card, passport or Canadian citizenship card. Expired, damaged or altered ID will be refused, and the order will be cancelled and refunded.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    summary: "How we collect, use and protect your personal information.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "We collect the information you provide when you place an order, contact us or subscribe to emails — such as your name, email, phone number and delivery address — along with basic analytics about how the site is used.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your information to process and fulfil orders, verify age, respond to enquiries and, with your consent, send marketing emails. Payments are processed by our payment provider; we never store full card details.",
          "We don't sell your personal information.",
        ],
      },
      {
        heading: "Contact",
        body: [`Questions about your data? Email ${contact.email}.`],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of sale",
    summary: "The terms that apply when you buy from us.",
    sections: [
      {
        heading: "Eligibility",
        body: [`You must be ${legalAge} or older to purchase from ${name}. By placing an order you confirm that you meet this requirement.`],
      },
      {
        heading: "Pricing & availability",
        body: [
          "Prices are in Canadian dollars and include applicable provincial vaping excise duty. HST is added at checkout. We reserve the right to cancel orders for products that are out of stock or listed in error.",
        ],
      },
      {
        heading: "Product use",
        body: [
          "Vaping products contain nicotine, a highly addictive chemical. Keep all products out of reach of children and pets. Follow the manufacturer's instructions for use, charging and battery safety.",
        ],
      },
    ],
  },
];
