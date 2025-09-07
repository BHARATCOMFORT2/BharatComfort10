"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function StoryDetailPage() {
  const params = useParams();
  const { locale, id } = params as { locale: string; id: string };
  const { t, i18n } = useTranslation();

  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    i18n.changeLanguage(locale);

    const fetchStory = async () => {
      const ref = doc(db, "stories", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setStory({ id: snap.id, ...snap.data() });
      }
    };

    fetchStory();
  }, [id, locale, i18n]);

  if (!story) {
    return (
      <div className="px-6 py-20 text-center text-gray-600">
        {t("loading")}...
      </div>
    );
  }

  return (
    <article className="px-6 py-12 max-w-4xl mx-auto space-y-10">
      {/* Cover Image */}
      {story.imageUrl && (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title + Meta */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        <p className="text-sm text-gray-500">
          {story.author && (
            <span>
              {t("by")} {story.author}
            </span>
          )}
          {story.publishedAt && (
            <span className="ml-2">
              • {new Date(story.publishedAt.seconds * 1000).toLocaleDateString(locale)}
            </span>
          )}
        </p>
      </div>

      {/* Content */}
      <div className="prose max-w-none text-gray-800 leading-relaxed">
        {story.content || t("no_content")}
      </div>
    </article>
  );
}
