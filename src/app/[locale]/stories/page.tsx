"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default function StoriesPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();

  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale as string);

    const fetchStories = async () => {
      setLoading(true);
      const q = query(collection(db, "stories"), where("status", "==", "published"));
      const snap = await getDocs(q);
      setStories(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    fetchStories();
  }, [locale, i18n]);

  return (
    <div className="px-6 py-12 space-y-10">
      {/* Header */}
      <h1 className="text-3xl font-bold">{t("travel_stories")}</h1>
      <p className="text-gray-600">{t("stories_intro")}</p>

      {/* Content */}
      {loading && <p className="text-gray-500">{t("loading")}...</p>}
      {!loading && stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/${locale}/stories/${story.id}`}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={story.imageUrl || "/placeholder.jpg"}
                alt={story.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{story.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {story.excerpt || story.content?.slice(0, 100) + "..."}
                </p>
                <p className="mt-3 text-blue-600 font-semibold">{t("read_more")}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-500">{t("no_stories")}</p>
      )}
    </div>
  );
}
