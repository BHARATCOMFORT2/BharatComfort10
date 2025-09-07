"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminListingDetailPage() {
  const { locale, id } = useParams() as { locale: string; id: string };
  const { t, i18n } = useTranslation();
  const router = useRouter();

  i18n.changeLanguage(locale);

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const ref = doc(db, "listings", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setListing({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await updateDoc(doc(db, "listings", id), {
        status,
        reviewedAt: new Date(),
      });
      router.push(`/${locale}/dashboard/listings`);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading || !listing) {
    return <div className="p-6">{t("loading")}</div>;
  }

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto space-y-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 hover:underline"
      >
        ← {t("back_to_list")}
      </button>

      <h1 className="text-3xl font-bold">{listing.name}</h1>
      <p className="text-gray-600">
        {listing.type} — {listing.city}, {listing.country}
      </p>
      <p className="text-sm text-gray-500">
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

      {/* Image */}
      {listing.imageUrl && (
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="w-full h-64 object-cover rounded-xl shadow"
        />
      )}

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">{t("description")}</h2>
        <p className="text-gray-700">{listing.description}</p>
      </div>

      {/* Address & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold">{t("address")}</h3>
          <p>{listing.address}</p>
          <p>
            {listing.city}, {listing.country}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">{t("price_per_night")}</h3>
          <p className="text-lg font-bold">${listing.price}</p>
        </div>
      </div>

      {/* Map */}
      {listing.mapUrl && (
        <div>
          <h3 className="font-semibold mb-2">{t("map_location")}</h3>
          <iframe
            src={listing.mapUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => updateStatus("approved")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {t("approve")}
        </button>
        <button
          onClick={() => updateStatus("rejected")}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {t("reject")}
        </button>
      </div>
    </div>
  );

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function AdminListingDetailPage() {
  const { locale, id } = useParams() as { locale: string; id: string };
  const { t, i18n } = useTranslation();
  const router = useRouter();

  i18n.changeLanguage(locale);

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const ref = doc(db, "listings", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setListing({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      const ref = doc(db, "listings", id);
      await updateDoc(ref, {
        status,
        reviewedAt: new Date(),
      });

      // log admin action
      const auth = getAuth();
      const user = auth.currentUser;

      await addDoc(collection(db, "auditLogs"), {
        listingId: id,
        action: status,
        adminId: user?.uid || "unknown",
        adminEmail: user?.email || "unknown",
        timestamp: new Date(),
      });

      router.push(`/${locale}/dashboard/listings`);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading || !listing) {
    return <div className="p-6">{t("loading")}</div>;
  }

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto space-y-8">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 hover:underline"
      >
        ← {t("back_to_list")}
      </button>

      <h1 className="text-3xl font-bold">{listing.name}</h1>
      <p className="text-gray-600">
        {listing.type} — {listing.city}, {listing.country}
      </p>
      <p className="text-sm text-gray-500">
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

      {listing.imageUrl && (
        <img
          src={listing.imageUrl}
          alt={listing.name}
          className="w-full h-64 object-cover rounded-xl shadow"
        />
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">{t("description")}</h2>
        <p className="text-gray-700">{listing.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold">{t("address")}</h3>
          <p>{listing.address}</p>
          <p>
            {listing.city}, {listing.country}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">{t("price_per_night")}</h3>
          <p className="text-lg font-bold">${listing.price}</p>
        </div>
      </div>

      {listing.mapUrl && (
        <div>
          <h3 className="font-semibold mb-2">{t("map_location")}</h3>
          <iframe
            src={listing.mapUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => updateStatus("approved")}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {t("approve")}
        </button>
        <button
          onClick={() => updateStatus("rejected")}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {t("reject")}
        </button>
      </div>
    </div>
  );
}
