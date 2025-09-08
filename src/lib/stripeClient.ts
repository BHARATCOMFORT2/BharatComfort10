// src/lib/stripeClient.ts
import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

/**
 * Load Stripe client (only on browser).
 * Uses NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY from .env.local
 */
export function getStripe() {
  if (!stripePromise) {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      throw new Error("⚠️ Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
    }
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}
