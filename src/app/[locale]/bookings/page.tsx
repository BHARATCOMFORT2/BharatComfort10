"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function BookingsPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  i18n.changeLanguage(locale as string);

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setBookings([]);
          return;
        }

        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="p-6">{t("loading")}</div>;
  }

  if (!bookings.length) {
    return (
      <div className="p-6 text-gray-600">
        {t("no_bookings")}
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("my_bookings")}</h1>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <a
            key={booking.id}
            href={`/${locale}/bookings/${booking.id}`}
            className="block bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{booking.listingName}</h2>
                <p className="text-gray-600 text-sm">
                  {booking.city}, {booking.country}
                </p>
                <p className="mt-1 text-sm">
                  {t("check_in")}:{" "}
                  <span className="font-semibold">
                    {new Date(booking.checkIn).toLocaleDateString(locale as string)}
                  </span>
                  {" — "}
                  {t("check_out")}:{" "}
                  <span className="font-semibold">
                    {new Date(booking.checkOut).toLocaleDateString(locale as string)}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {booking.currency} {booking.totalPrice}
                </p>
                <p
                  className={`text-sm ${
                    booking.status === "confirmed"
                      ? "text-green-600"
                      : booking.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {booking.status || t("pending")}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
