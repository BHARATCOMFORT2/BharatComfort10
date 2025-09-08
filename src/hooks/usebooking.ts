"use client";

import { useState } from "react";
import { calculatePrice } from "@/lib/pricing";
import { Logger } from "@/lib/logging";

interface BookingInput {
  listingId: string;
  nights: number;
  guests: number;
  extras?: Record<string, number>; // e.g. { breakfast: 2 }
}

interface BookingState {
  step: "idle" | "review" | "payment" | "confirmed" | "error";
  loading: boolean;
  priceBreakdown?: ReturnType<typeof calculatePrice>;
  bookingId?: string;
  error?: string;
}

export function useBooking() {
  const [state, setState] = useState<BookingState>({ step: "idle", loading: false });

  const startBooking = (input: BookingInput, basePrice: number) => {
    try {
      const breakdown = calculatePrice({
        basePrice,
        nights: input.nights,
        extras: input.extras || {},
      });

      setState({
        step: "review",
        loading: false,
        priceBreakdown: breakdown,
      });
    } catch (err) {
      Logger.error("Failed to start booking", { error: (err as Error).message });
      setState({ step: "error", loading: false, error: "Could not start booking" });
    }
  };

  const createPaymentIntent = async (listingId: string, amount: number, currency: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch("/api/bookings/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, amount, currency }),
      });

      if (!res.ok) throw new Error("Failed to create payment intent");

      const data = await res.json();

      setState((prev) => ({
        ...prev,
        step: "payment",
        loading: false,
        bookingId: data.bookingId,
      }));

      return data;
    } catch (err) {
      Logger.error("Payment intent creation failed", { error: (err as Error).message });
      setState({ step: "error", loading: false, error: "Payment failed" });
    }
  };

  const confirmBooking = (bookingId: string) => {
    setState({
      step: "confirmed",
      loading: false,
      bookingId,
      priceBreakdown: state.priceBreakdown,
    });
  };

  return {
    state,
    startBooking,
    createPaymentIntent,
    confirmBooking,
  };
}
