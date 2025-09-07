import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

/**
 * Creates a Stripe Payment Intent for a booking.
 * Expects body: { listingId, amount, currency, checkIn, checkOut, guests }
 * Requires authenticated user.
 */
export async function POST(req: Request) {
  try {
    const { listingId, amount, currency, checkIn, checkOut, guests } = await req.json();

    if (!listingId || !amount || !currency || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
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
    const userId = decoded.uid;

    // Retrieve listing details
    const listingRef = adminDB.collection("listings").doc(listingId);
    const listingSnap = await listingRef.get();

    if (!listingSnap.exists) {
      return NextResponse.json({ success: false, error: "Listing not found" }, { status: 404 });
    }

    const listing = listingSnap.data();

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency,
      metadata: {
        listingId,
        userId,
        checkIn,
        checkOut,
        guests: guests.toString(),
      },
    });

    // Create a pending booking in Firestore
    const bookingRef = await adminDB.collection("bookings").add({
      listingId,
      listingName: listing?.title || "Listing",
      partnerId: listing?.partnerId,
      userId,
      checkIn,
      checkOut,
      guests,
      totalPrice: amount,
      currency,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
      paymentIntentId: paymentIntent.id,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      bookingId: bookingRef.id,
    });
  } catch (err: any) {
    console.error("Create booking intent error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
