"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Edit, Trash2 } from "lucide-react";

// TODO: Replace with actual auth user from Firebase Auth context
const mockUserId = "partner123";

export default function PartnerListingsPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  i18n.changeLanguage(locale as string);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const q = query(
        collection(db, "listings"),
        where("ownerId", "==", mockUserId)
      );
      const snap = await getDocs(q);
      setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirm_delete"))) return;
    await deleteDoc(doc(db, "listings", id));
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("my_listings")}</h1>
        <button
          onClick={() => router.push(`/${locale}/dashboard/partner/new-listings`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t("add_new_listing")}
        </button>
      </div>

      {loading && <p className="text-gray-500">{t("loading")}...</p>}
      {!loading && listings.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">{t("name")}</th>
                <th className="px-4 py-2">{t("city")}</th>
                <th className="px-4 py-2">{t("country")}</th>
                <th className="px-4 py-2">{t("price_per_night")}</th>
                <th className="px-4 py-2">{t("status")}</th>
                <th className="px-4 py-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-t">
                  <td className="px-4 py-2">{listing.name}</td>
                  <td className="px-4 py-2">{listing.city}</td>
                  <td className="px-4 py-2">{listing.country}</td>
                  <td className="px-4 py-2">
                    ${listing.price?.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {listing.status || t("pending")}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/${locale}/partner/listings/${listing.id}/edit`
                        )
                      }
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-gray-500">{t("no_listings")}</p>
      )}
    </div>
  );
}
