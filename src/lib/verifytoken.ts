// src/lib/verifyToken.ts
import { adminAuth } from "@/lib/admin";

/**
 * Verifies Firebase ID token sent from the client.
 * 
 * @param token - The Firebase ID token (from client Auth)
 * @returns Decoded token with UID and custom claims
 */
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken; // contains uid, email, role (if set in claims), etc.
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Unauthorized");
  }
}
