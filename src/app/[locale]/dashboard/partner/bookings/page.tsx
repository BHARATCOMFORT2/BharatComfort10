"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function PartnerBookingsPage() {
  const { locale } = useParams();
  const { t, i18n } = useTranslation();
  i18n.changeLanguage(locale as string);

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartnerBookings = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setBookings([]);
          return;
        }

        // Query bookings where partnerId = current user's uid
        const q = query(
          collection(db, "bookings"),
          where("partnerId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
      } catch (err) {
        console.error("Error fetching partner bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerBookings();
  }, []);

  if (loading) {
    return <div className="p-6">{t("loading")}</div>;
  }

  if (!bookings.length) {
    return (
      <div className="p-6 text-gray-600">{t("no_partner_bookings")}</div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("partner_bookings")}</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="p-4">{t("property")}</th>
              <th className="p-4">{t("customer")}</th>
              <th className="p-4">{t("dates")}</th>
              <th className="p-4">{t("guests")}</th>
              <th className="p-4">{t("total_price")}</th>
              <th className="p-4">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-4 font-semibold">{booking.listingName}</td>
                <td className="p-4">{booking.userEmail}</td>
                <td className="p-4 text-sm">
                  {new Date(booking.checkIn).toLocaleDateString(locale as string)}{" "}
                  →{" "}
                  {new Date(booking.checkOut).toLocaleDateString(locale as string)}
                </td>
                <td className="p-4">{booking.guests}</td>
                <td className="p-4">
                  {booking.currency} {booking.totalPrice}
                </td>
                <td
                  className={`p-4 font-semibold ${
                    booking.status === "confirmed"
                      ? "text-green-600"
                      : booking.status === "cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {booking.status || t("pending")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
