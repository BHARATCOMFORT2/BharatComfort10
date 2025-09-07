"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ModerationDashboard() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  i18n.changeLanguage(locale as string);

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingListings = async () => {
      try {
        const q = query(collection(db, "listings"), where("status", "==", "pending"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setListings(data);
      } catch (err) {
        console.error("Error fetching pending listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingListings();
  }, []);

  const handleApprove = async (listingId: string) => {
    try {
      await fetch("/api/listings/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleReject = async (listingId: string, reason: string) => {
    try {
      await fetch("/api/listings/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason }),
      });
      setListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setRejecting(null);
    }
  };

  if (loading) {
    return <div className="p-6">{t("loading")}</div>;
  }

  if (!listings.length) {
    return <div className="p-6 text-gray-600">{t("no_pending_listings")}</div>;
  }

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("moderation_queue")}</h1>

      <div className="space-y-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="p-6 bg-white rounded-2xl shadow flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <span className="text-sm text-gray-500">
                {listing.location?.city}, {listing.location?.country}
              </span>
            </div>

            {listing.description && (
              <p className="text-gray-700 text-sm">{listing.description}</p>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => handleApprove(listing.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {t("approve")}
              </button>
              <button
                onClick={() => setRejecting(listing.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t("reject")}
              </button>
            </div>

            {rejecting === listing.id && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder={t("rejection_reason") || "Reason"}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleReject(listing.id, (e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector<HTMLInputElement>(
                      "input[type='text']"
                    );
                    if (input?.value) {
                      handleReject(listing.id, input.value);
                    }
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                >
                  {t("submit")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
