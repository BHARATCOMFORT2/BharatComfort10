"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewPartnerListingPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  i18n.changeLanguage(locale as string);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "listings"), {
        ...form,
        price: Number(form.price),
        createdAt: serverTimestamp(),
        status: "pending", // admin must approve
      });
      router.push(`/${locale}/partner/listings`);
    } catch (err) {
      console.error("Error creating listing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("add_new_listing")}</h1>

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
          {loading ? t("saving") : t("save_listing")}
        </button>
      </form>
    </div>
  );
}
