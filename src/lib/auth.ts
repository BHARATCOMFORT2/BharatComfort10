// src/lib/auth.ts
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

let currentUser: User | null = null;

/**
 * Subscribe to auth state changes.
 */
export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
}

/**
 * Get current user (may be null if not logged in).
 */
export function getCurrentUser(): User | null {
  return currentUser;
}

/**
 * Sign in with Google.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/**
 * Sign out the current user.
 */
export async function logout() {
  await signOut(auth);
  currentUser = null;
}
