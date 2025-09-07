"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminListingsPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  i18n.changeLanguage(locale as string);

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "listings"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "listings", id), {
        status,
        reviewedAt: new Date(),
      });
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return <div className="p-6">{t("loading")}</div>;
  }

  return (
    <div className="px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">{t("manage_listings")}</h1>
      <p className="text-gray-600 mb-10">{t("manage_listings_desc")}</p>

      <div className="grid gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="p-6 bg-white rounded-2xl shadow flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{listing.name}</h2>
              <p className="text-gray-600">
                {listing.type} — {listing.city}, {listing.country}
              </p>
              <p className="text-sm mt-2">{listing.description}</p>
              <p className="mt-1 text-sm">
                {t("status")}:{" "}
                <span
                  className={
                    listing.status === "approved"
                      ? "text-green-600"
                      : listing.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {listing.status || "pending"}
                </span>
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => updateStatus(listing.id, "approved")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {t("approve")}
              </button>
              <button
                onClick={() => updateStatus(listing.id, "rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t("reject")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
