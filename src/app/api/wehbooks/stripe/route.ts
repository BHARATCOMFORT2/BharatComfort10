import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook signature missing" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text(); // Must use raw body
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingSnap = await adminDB
          .collection("bookings")
          .where("paymentIntentId", "==", intent.id)
          .get();

        if (!bookingSnap.empty) {
          const bookingDoc = bookingSnap.docs[0];
          await bookingDoc.ref.update({
            status: "confirmed",
            confirmedAt: new Date().toISOString(),
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingSnap = await adminDB
          .collection("bookings")
          .where("paymentIntentId", "==", intent.id)
          .get();

        if (!bookingSnap.empty) {
          const bookingDoc = bookingSnap.docs[0];
          await bookingDoc.ref.update({
            status: "failed",
            failureReason: intent.last_payment_error?.message || "Unknown",
            failedAt: new Date().toISOString(),
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook processing error:", err.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
