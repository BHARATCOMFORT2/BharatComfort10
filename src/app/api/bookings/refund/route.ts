import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

/**
 * Issues a refund for a booking.
 * Expects body: { bookingId, reason? }
 * Only admin/superadmin can refund.
 */
export async function POST(req: Request) {
  try {
    const { bookingId, reason } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ success: false, error: "Missing bookingId" }, { status: 400 });
    }

    // Verify session cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    // Check user role in Firestore
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : "user";

    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Fetch booking
    const bookingRef = adminDB.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingSnap.data();

    if (booking?.status !== "confirmed") {
      return NextResponse.json({ success: false, error: "Only confirmed bookings can be refunded" }, { status: 400 });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
      reason: reason || "requested_by_customer",
    });

    // Update booking with refund info
    await bookingRef.update({
      status: "refunded",
      refundedAt: new Date().toISOString(),
      refundId: refund.id,
      refundReason: reason || "requested_by_customer",
      refundedBy: uid,
    });

    return NextResponse.json({ success: true, bookingId, refundId: refund.id });
  } catch (err: any) {
    console.error("Refund booking error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
