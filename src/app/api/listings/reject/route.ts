import { NextResponse } from "next/server";
import { adminDB, adminAuth } from "@/lib/firebaseAdmin";

/**
 * Rejects a pending listing.
 * Expects body: { listingId, reason }
 * Only admin/superadmin can reject.
 */
export async function POST(req: Request) {
  try {
    const { listingId, reason } = await req.json();

    if (!listingId || !reason) {
      return NextResponse.json(
        { success: false, error: "Missing listingId or reason" },
        { status: 400 }
      );
    }

    // Read session cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify session with Firebase Admin
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    // Check user role in Firestore
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : "user";

    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Update listing status → rejected
    await adminDB.collection("listings").doc(listingId).update({
      status: "rejected",
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
      rejectedBy: uid,
    });

    return NextResponse.json({ success: true, listingId, reason });
  } catch (err: any) {
    console.error("Reject listing error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
