"use client";

import { useParams } from "next/navigation";
import PriceBreakdown from "@/components/pricebreakdown";

// Mock booking data (replace with Firestore/API fetch later)
const mockBooking = {
  id: "abc123",
  title: "Luxury Beach Resort",
  location: "Goa, India",
  image: "https://source.unsplash.com/600x400/?beach,resort",
  basePrice: 200,
  nights: 3,
  quantity: 1,
  cleaningFee: 40,
  serviceFee: 25,
  taxes: 50,
  discount: 10,
  currency: "USD",
};

export default function BookingDetailsPage() {
  const { id } = useParams();

  // TODO: Replace with fetch(`/api/bookings/${id}`)
  const booking = mockBooking;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side: booking info */}
      <div>
        <img
          src={booking.image}
          alt={booking.title}
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />
        <h1 className="text-2xl font-bold mt-6">{booking.title}</h1>
        <p className="text-gray-600">{booking.location}</p>
        <p className="text-sm text-gray-500 mt-2">
          Booking ID: <span className="font-mono">{id}</span>
        </p>
      </div>

      {/* Right side: Price breakdown */}
      <div>
        <PriceBreakdown
          basePrice={booking.basePrice}
          nights={booking.nights}
          quantity={booking.quantity}
          cleaningFee={booking.cleaningFee}
          serviceFee={booking.serviceFee}
          taxes={booking.taxes}
          discount={booking.discount}
          currency={booking.currency}
        />
      </div>
    </div>
  );
}
