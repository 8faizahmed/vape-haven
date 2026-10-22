// Storefront domain types. Providers (mock today, Clover later) map their own
// data into these shapes so the UI never depends on a specific backend.

/** All money values are integer cents. */
export type Money = number;

export type NicotineType = "salt" | "freebase" | "none";

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductBadge = "new" | "bestseller" | "limited";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: Money;
  compareAtPrice?: Money;
  images: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  options: ProductOption[];
  nicotine?: NicotineType;
  badges?: ProductBadge[];
  featured?: boolean;
  inStock: boolean;
  /** ISO date, used for "newest" sorting. */
  createdAt: string;
};

export type CheckoutLine = {
  productId: string;
  quantity: number;
  options: Record<string, string>;
};

export type FulfillmentMethod = "pickup" | "delivery";

export type CheckoutRequest = {
  lines: CheckoutLine[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  fulfillment: FulfillmentMethod;
  address?: {
    street: string;
    unit?: string;
    city: string;
    postalCode: string;
  };
  notes?: string;
};

export type OrderTotals = {
  subtotal: Money;
  shipping: Money;
  tax: Money;
  total: Money;
};

export type CheckoutResult =
  | { ok: true; orderId: string; redirectUrl: string; totals: OrderTotals }
  | { ok: false; error: string };

export interface CommerceProvider {
  name: string;
  getCategories(): Promise<Category[]>;
  getProducts(): Promise<Product[]>;
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
}
