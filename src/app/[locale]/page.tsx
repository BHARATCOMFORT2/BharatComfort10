"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Search, MapPin } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export default function LocaleHomePage() {
  const params = useParams();
  const locale = params?.locale || "en";
  const { t, i18n } = useTranslation();

  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [trendingStories, setTrendingStories] = useState<any[]>([]);

  useEffect(() => {
    i18n.changeLanguage(locale as string);

    const fetchListings = async () => {
      const q = query(
        collection(db, "listings"),
        where("featured", "==", true),
        limit(6)
      );
      const snap = await getDocs(q);
      setFeaturedListings(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchStories = async () => {
      const q = query(
        collection(db, "stories"),
        where("trending", "==", true),
        limit(4)
      );
      const snap = await getDocs(q);
      setTrendingStories(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchListings();
    fetchStories();
  }, [locale, i18n]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-6 rounded-2xl shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("discover_title")}
          </h1>
          <p className="mb-8 text-lg">{t("discover_subtitle")}</p>
          <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-xl mx-auto">
            <MapPin className="ml-4 text-gray-500" />
            <input
              type="text"
              placeholder={t("search_placeholder") || ""}
              className="flex-1 px-4 py-3 text-gray-700 outline-none"
            />
            <button className="bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
              <Search size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6">{t("featured_listings")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/${locale}/listings/${listing.id}`}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={listing.imageUrl || "/placeholder.jpg"}
                alt={listing.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{listing.name}</h3>
                <p className="text-gray-600 text-sm">{listing.location}</p>
                <p className="mt-2 font-bold text-blue-600">
                  {listing.price ? `$${listing.price}/night` : t("view_details")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Stories */}
      <section className="px-6">
        <h2 className="text-2xl font-bold mb-6">{t("trending_stories")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingStories.map((story) => (
            <Link
              key={story.id}
              href={`/${locale}/stories/${story.id}`}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={story.imageUrl || "/placeholder.jpg"}
                alt={story.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
                <p className="text-gray-600 text-sm flex-1">{story.excerpt}</p>
                <span className="mt-4 text-blue-600 font-medium">
                  {t("read_more")} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
