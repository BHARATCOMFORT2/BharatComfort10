"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Logger } from "@/lib/logging";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  role?: "user" | "partner" | "admin" | "superadmin";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          // 🔑 Fetch role from API
          const token = await firebaseUser.getIdToken();
          const res = await fetch("/api/users/role", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: data?.role || "user",
          });

          setStatus("authenticated");
        } catch (err) {
          Logger.error("Failed to fetch user role", { error: (err as Error).message });
          setStatus("unauthenticated");
        }
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setStatus("unauthenticated");
    } catch (err) {
      Logger.error("Logout failed", { error: (err as Error).message });
    }
  };

  return { user, status, logout };
}
