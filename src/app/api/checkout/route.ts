import { createCheckout } from "@/lib/commerce";
import type { CheckoutRequest } from "@/lib/commerce/types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

function validate(body: Partial<CheckoutRequest>): string | null {
  if (!Array.isArray(body.lines) || body.lines.length === 0) return "Your cart is empty.";
  if (body.lines.some((l) => !l.productId || !Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > 10)) {
    return "Your cart contains an invalid item.";
  }
  const c = body.customer;
  if (!c?.firstName?.trim() || !c.lastName?.trim()) return "Please enter your full name as it appears on your ID.";
  if (!EMAIL.test(c.email ?? "")) return "Please enter a valid email address.";
  if ((c.phone ?? "").replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
  if (body.fulfillment !== "pickup" && body.fulfillment !== "delivery") return "Please choose pickup or delivery.";
  if (body.fulfillment === "delivery") {
    const a = body.address;
    if (!a?.street?.trim() || !a.city?.trim()) return "Please enter your delivery address.";
    if (!POSTAL.test(a.postalCode ?? "")) return "Please enter a valid postal code.";
  }
  return null;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<CheckoutRequest> | null;
  if (!body) return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const error = validate(body);
  if (error) return Response.json({ ok: false, error }, { status: 400 });

  try {
    const result = await createCheckout(body as CheckoutRequest);
    return Response.json(result, { status: result.ok ? 200 : 409 });
  } catch (err) {
    console.error("Checkout failed", err);
    return Response.json({ ok: false, error: "We couldn't start checkout. Please try again." }, { status: 502 });
  }
}
