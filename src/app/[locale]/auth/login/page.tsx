"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  i18n.changeLanguage(locale as string);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect to homepage after login
      router.push(`/${locale}`);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || t("login_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6">{t("login")}</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? t("logging_in") : t("login")}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center">
          {t("no_account")}{" "}
          <a
            href={`/${locale}/auth/register`}
            className="text-blue-600 hover:underline"
          >
            {t("register")}
            import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // Call API to set secure cookie
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, locale }),
    });

    router.push(`/${locale}`);
  } catch (err: any) {
    console.error("Login failed:", err);
    setError(err.message || t("login_failed"));
  } finally {
    setLoading(false);
  }
};

          </a>
        </p>
      </div>
    </div>
  );
}
