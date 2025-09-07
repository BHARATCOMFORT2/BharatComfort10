"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BookingDetailsPage() {
  const { id, locale } = useParams();
  const { t, i18n } = useTranslation();
  i18n.changeLanguage(locale as string);

  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const ref = doc(db, "bookings", id as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setBooking({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return <div className="p-6">{t("loading")}</div>;
  }

  if (!booking) {
    return <div className="p-6 text-red-600">{t("booking_not_found")}</div>;
  }

  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {t("booking_details")} #{booking.id}
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">{t("status")}</p>
          <p className="font-semibold">
            {booking.status || t("pending")}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("customer")}</p>
          <p className="font-semibold">{booking.userEmail}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("property")}</p>
          <p className="font-semibold">{booking.listingName}</p>
          <p className="text-gray-600 text-sm">
            {booking.city}, {booking.country}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">{t("check_in")}</p>
            <p className="font-semibold">
              {new Date(booking.checkIn).toLocaleDateString(locale as string)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t("check_out")}</p>
            <p className="font-semibold">
              {new Date(booking.checkOut).toLocaleDateString(locale as string)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("guests")}</p>
          <p className="font-semibold">{booking.guests}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("total_price")}</p>
          <p className="font-semibold">
            {booking.currency} {booking.totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
}
