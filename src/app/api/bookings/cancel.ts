import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/admin"; // Firestore Admin SDK
import { Logger } from "@/lib/logging";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    // 🔎 Lookup booking
    const bookingRef = adminDb.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingSnap.data();

    // 🔑 Refund via Stripe
    if (booking?.paymentIntentId) {
      await stripe.refunds.create({ payment_intent: booking.paymentIntentId });
    }

    // 🗑️ Mark cancelled in Firestore
    await bookingRef.update({ status: "cancelled", cancelledAt: new Date().toISOString() });

    Logger.info("Booking cancelled", { bookingId });

    return NextResponse.json({ success: true });
  } catch (err) {
    Logger.error("Booking cancellation API failed", { error: (err as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
