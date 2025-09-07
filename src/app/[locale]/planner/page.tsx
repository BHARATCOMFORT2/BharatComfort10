"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CalendarDays, MapPin, Search } from "lucide-react";

export default function PlannerPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interests, setInterests] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale as string);
  }, [locale, i18n]);

  const handleSearch = async () => {
    setLoading(true);

    // Fetch listings in the destination
    const q = query(
      collection(db, "listings"),
      where("status", "==", "published")
    );
    const snap = await getDocs(q);

    // Filter by destination (basic string match)
    const matches = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((item) =>
        item.location?.toLowerCase().includes(destination.toLowerCase())
      );

    setResults(matches);
    setLoading(false);
  };

  return (
    <div className="px-6 py-12 space-y-10">
      {/* Header */}
      <h1 className="text-3xl font-bold">{t("travel_planner")}</h1>
      <p className="text-gray-600">{t("plan_trip_intro")}</p>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">{t("destination")}</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t("enter_destination")}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> {t("dates")}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("interests")}</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder={t("e.g._food_culture_nature")}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          <Search className="w-5 h-5" /> {t("find_plan")}
        </button>
      </div>

      {/* Results */}
      <div>
        {loading && <p className="text-gray-500">{t("loading")}...</p>}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={item.imageUrl || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location}
                  </p>
                  <p className="mt-2 text-blue-600 font-bold">
                    {item.price ? `$${item.price}/night` : t("view_details")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && results.length === 0 && (
          <p className="text-gray-500">{t("no_results")}</p>
        )}
      </div>
    </div>
  );
}
