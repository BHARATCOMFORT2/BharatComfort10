import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebaseAdmin";

/**
 * Handles login session creation.
 * Called from the client after Firebase Auth login.
 * Expects { idToken, locale } in request body.
 */
export async function POST(req: Request) {
  try {
    const { idToken, locale } = await req.json();

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user role from Firestore
    const userDoc = await adminDB.collection("users").doc(uid).get();
    const role = userDoc.exists ? userDoc.data()?.role || "user" : "user";

    // Create session cookie (7 days)
    const expiresIn = 7 * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ success: true, role });

    // Store user metadata cookie
    response.cookies.set("user", JSON.stringify({ uid, role, locale }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    // Store Firebase session cookie
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (err: any) {
    console.error("Session creation error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 401 }
    );
  }
}
