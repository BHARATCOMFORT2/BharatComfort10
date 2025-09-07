"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewStoryPage() {
  const { locale } = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    i18n.changeLanguage(locale as string);
  }, [locale, i18n]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "stories"), {
        title,
        excerpt,
        imageUrl,
        content,
        status: "published",
        author: "Anonymous", // replace with logged-in user
        publishedAt: serverTimestamp(),
        locale,
      });

      router.push(`/${locale}/stories`);
    } catch (err: any) {
      console.error(err);
      setError(t("error_saving"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("new_story")}</h1>

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">{t("title")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("excerpt")}</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("cover_image_url")}</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("content")}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className="w-full border rounded-lg px-3 py-2"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          {loading ? t("saving") : t("publish_story")}
        </button>
      </form>
    </div>
  );
}
