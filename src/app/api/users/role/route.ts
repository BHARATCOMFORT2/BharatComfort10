import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

/**
 * GET: fetch current user's role
 * POST: update a user's role (admin/superadmin only)
 */
export async function GET(req: Request) {
  try {
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

    const userDoc = await adminDB.collection("users").doc(uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : "user";

    return NextResponse.json({ success: true, uid, role });
  } catch (err: any) {
    console.error("Fetch role error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { targetUid, role } = await req.json();

    if (!targetUid || !role) {
      return NextResponse.json({ success: false, error: "Missing targetUid or role" }, { status: 400 });
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

    // Check caller's role
    const callerDoc = await adminDB.collection("users").doc(uid).get();
    const callerRole = callerDoc.exists ? callerDoc.data()?.role : "user";

    if (callerRole !== "admin" && callerRole !== "superadmin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Update target user's role
    await adminDB.collection("users").doc(targetUid).set({ role }, { merge: true });

    return NextResponse.json({ success: true, targetUid, role });
  } catch (err: any) {
    console.error("Update role error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
