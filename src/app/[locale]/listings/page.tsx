"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MapPin, LayoutGrid } from "lucide-react";

export default function ListingsPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  const [listings, setListings] = useState<any[]>([]);
  const [mapView, setMapView] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale as string);

    const fetchListings = async () => {
      const q = query(collection(db, "listings"), where("status", "==", "published"));
      const snap = await getDocs(q);
      setListings(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchListings();
  }, [locale, i18n]);

  return (
    <div className="px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("all_listings")}</h1>
        <button
          onClick={() => setMapView(!mapView)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          {mapView ? <LayoutGrid size={18} /> : <MapPin size={18} />}
          {mapView ? t("grid_view") : t("map_view")}
        </button>
      </div>

      {/* Content */}
      {!mapView ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
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
      ) : (
        // Map View (Leaflet or Google Maps)
        <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow">
          <iframe
            src={`https://www.google.com/maps/embed/v1/search?key=${
              process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
            }&q=${encodeURIComponent("hotels+restaurants")}`}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
}
