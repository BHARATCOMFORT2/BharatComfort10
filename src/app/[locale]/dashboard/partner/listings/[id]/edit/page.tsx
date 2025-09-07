"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditListingPage() {
  const { locale, id } = useParams() as { locale: string; id: string };
  const { t, i18n } = useTranslation();
  const router = useRouter();

  i18n.changeLanguage(locale);

  const [form, setForm] = useState({
    name: "",
    type: "hotel",
    address: "",
    city: "",
    country: "",
    price: "",
    description: "",
    imageUrl: "",
    mapUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      const ref = doc(db, "listings", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setForm({
          name: data.name || "",
          type: data.type || "hotel",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          price: data.price || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          mapUrl: data.mapUrl || "",
        });
      }
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ref = doc(db, "listings", id);
      await updateDoc(ref, {
        ...form,
        price: Number(form.price),
        updatedAt: new Date(),
      });
      router.push(`/${locale}/partner/listings`);
    } catch (err) {
      console.error("Error updating listing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("edit_listing")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow">
        <div>
          <label className="block text-sm font-semibold mb-1">{t("name")}</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">{t("type")}</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="hotel">{t("hotel")}</option>
            <option value="restaurant">{t("restaurant")}</option>
            <option value="experience">{t("experience")}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">{t("address")}</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t("city")}</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">{t("country")}</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">{t("price_per_night")}</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">{t("description")}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">{t("image_url")}</label>
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">{t("map_url")}</label>
          <input
            type="url"
            name="mapUrl"
            value={form.mapUrl}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? t("saving") : t("update_listing")}
        </button>
      </form>
    </div>
  );
}
