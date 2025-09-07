"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  i18n.changeLanguage(locale as string);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "partner">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save role and profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role,
        createdAt: new Date(),
      });

      // Redirect after registration
      if (role === "partner") {
        router.push(`/${locale}/partner`);
      } else {
        router.push(`/${locale}`);
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || t("registration_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6">{t("register")}</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">{t("role")}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "partner")}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="user">{t("user")}</option>
              <option value="partner">{t("partner")}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {loading ? t("registering") : t("register")}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          {t("already_account")}{" "}
          <a
            href={`/${locale}/auth/login`}
            className="text-blue-600 hover:underline"
          >
            {t("login")}
          </a>
        </p>
      </div>
    </div>
  );
}
