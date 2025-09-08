// src/lib/stripe.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("⚠️ Missing STRIPE_SECRET_KEY in environment variables");
}

// Initialize Stripe with API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // Use latest stable
  typescript: true
});

/**
 * Helper to create a PaymentIntent
 */
export async function createPaymentIntent(amount: number, currency: string = "usd") {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  });
}

/**
 * Helper to retrieve a PaymentIntent
 */
export async function getPaymentIntent(id: string) {
  return await stripe.paymentIntents.retrieve(id);
}
