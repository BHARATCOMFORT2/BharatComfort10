import { NextResponse } from "next/server";
import { adminDB, adminAuth } from "@/lib/firebaseAdmin";

/**
 * Approves a pending listing.
 * Expects body: { listingId }
 * Only admin/superadmin can approve.
 */
export async function POST(req: Request) {
  try {
    const { listingId } = await req.json();
    if (!listingId) {
      return NextResponse.json({ success: false, error: "Missing listingId" }, { status: 400 });
    }

    // Read session cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // Verify session with Firebase Admin
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    // Check user role in Firestore
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : "user";

    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Update listing status → approved
    await adminDB.collection("listings").doc(listingId).update({
      status: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: uid,
    });

    return NextResponse.json({ success: true, listingId });
  } catch (err: any) {
    console.error("Approve listing error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
