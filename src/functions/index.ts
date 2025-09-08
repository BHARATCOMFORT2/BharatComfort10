import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// 🔔 Stripe Webhook: listen for payment events
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;

        if (bookingId) {
          await db.collection("bookings").doc(bookingId).update({
            status: "confirmed",
            paymentStatus: "paid",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;

        if (bookingId) {
          await db.collection("bookings").doc(bookingId).update({
            status: "failed",
            paymentStatus: "failed",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("⚠️ Error handling event", err);
    res.status(500).send("Webhook handler failed");
  }
});

// 📅 Scheduled Function: Auto-expire old bookings
export const expireOldBookings = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const snapshot = await db
      .collection("bookings")
      .where("status", "==", "pending")
      .get();

    const now = admin.firestore.Timestamp.now();
    const batch = db.batch();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.expiresAt && data.expiresAt.toDate() < now.toDate()) {
        batch.update(doc.ref, {
          status: "expired",
          updatedAt: now,
        });
      }
    });

    await batch.commit();
    console.log("✅ Old bookings expired");
    return null;
  });

// 🔐 Callable Function: Admin approve listing
export const approveListing = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.role || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admins can approve listings.");
  }

  const { listingId } = data;
  if (!listingId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing listingId");
  }

  await db.collection("listings").doc(listingId).update({
    status: "approved",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, listingId };
});
