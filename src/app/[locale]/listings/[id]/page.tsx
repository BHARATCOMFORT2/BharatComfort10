"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { MapPin, DollarSign } from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const { locale, id } = params as { locale: string; id: string };
  const { t, i18n } = useTranslation();

  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    i18n.changeLanguage(locale);

    const fetchListing = async () => {
      const ref = doc(db, "listings", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setListing({ id: snap.id, ...snap.data() });
      }
    };

    fetchListing();
  }, [id, locale, i18n]);

  if (!listing) {
    return (
      <div className="px-6 py-20 text-center text-gray-600">
        {t("loading")}...
      </div>
    );
  }

  return (
    <div className="px-6 py-12 space-y-10">
      {/* Hero Image */}
      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow">
        <img
          src={listing.imageUrl || "/placeholder.jpg"}
          alt={listing.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Location */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{listing.name}</h1>
          <p className="flex items-center text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-2" />
            {listing.location}
          </p>
        </div>
        {listing.price && (
          <div className="text-2xl font-bold text-blue-600 flex items-center">
            <DollarSign className="w-5 h-5 mr-1" />
            {listing.price} / {t("per_night")}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{t("description")}</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {listing.description || t("no_description")}
        </p>
      </div>

      {/* Map */}
      {listing.latitude && listing.longitude && (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${
              process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
            }&q=${listing.latitude},${listing.longitude}`}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}

      {/* Booking Button */}
      <div className="flex justify-center">
        <button
          onClick={() => alert("Booking flow coming soon!")}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
        >
          {t("book_now")}
        </button>
      </div>
    </div>
  );
}
