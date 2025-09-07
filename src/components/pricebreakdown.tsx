"use client";

import { useEffect, useState } from "react";
import { calculatePricing, PricingBreakdown } from "@/lib/pricing";

interface PriceBreakdownProps {
  basePrice: number;
  quantity: number;
  cleaningFee?: number;
  serviceFee?: number;
  taxes?: number;
  discount?: number;
  currency?: string;       // default base currency (e.g. USD)
  targetCurrency?: string; // user’s preferred currency (optional)
}

export default function PriceBreakdown({
  basePrice,
  quantity,
  cleaningFee,
  serviceFee,
  taxes,
  discount,
  currency = "USD",
  targetCurrency,
}: PriceBreakdownProps) {
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPricing() {
      setLoading(true);
      const result = await calculatePricing({
        basePrice,
        quantity,
        cleaningFee,
        serviceFee,
        taxes,
        discount,
        currency,
        targetCurrency,
      });
      setPricing(result);
      setLoading(false);
    }
    fetchPricing();
  }, [
    basePrice,
    quantity,
    cleaningFee,
    serviceFee,
    taxes,
    discount,
    currency,
    targetCurrency,
  ]);

  if (loading || !pricing) {
    return <p className="text-gray-500">Calculating price...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-3 border border-gray-200">
      <h2 className="text-lg font-semibold mb-2">Price Breakdown</h2>

      <div className="flex justify-between text-sm">
        <span>Subtotal ({quantity}× {currency})</span>
        <span>
          {pricing.subtotal.toFixed(2)} {pricing.currency}
        </span>
      </div>

      {pricing.discountAmount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>-{pricing.discountAmount.toFixed(2)} {pricing.currency}</span>
        </div>
      )}

      {pricing.cleaningFee > 0 && (
        <div className="flex justify-between text-sm">
          <span>Cleaning Fee</span>
          <span>{pricing.cleaningFee.toFixed(2)} {pricing.currency}</span>
        </div>
      )}

      {pricing.serviceFee > 0 && (
        <div className="flex justify-between text-sm">
          <span>Service Fee</span>
          <span>{pricing.serviceFee.toFixed(2)} {pricing.currency}</span>
        </div>
      )}

      {pricing.taxAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span>Taxes</span>
          <span>{pricing.taxAmount.toFixed(2)} {pricing.currency}</span>
        </div>
      )}

      <hr />

      <div className="flex justify-between font-semibold text-base">
        <span>Total</span>
        <span>{pricing.total.toFixed(2)} {pricing.currency}</span>
      </div>
    </div>
  );
}

"use client";

interface PriceBreakdownProps {
  basePrice: number; // e.g. per night / per person
  nights?: number;   // for hotels
  quantity?: number; // for experiences (people)
  cleaningFee?: number;
  serviceFee?: number;
  taxes?: number;
  discount?: number; // percentage discount (0–100)
  currency?: string; // e.g. "USD", "INR", "EUR"
}

export default function PriceBreakdown({
  basePrice,
  nights = 1,
  quantity = 1,
  cleaningFee = 0,
  serviceFee = 0,
  taxes = 0,
  discount = 0,
  currency = "USD",
}: PriceBreakdownProps) {
  // Subtotal = base × nights × quantity
  const subtotal = basePrice * nights * quantity;

  // Apply discount
  const discountAmount = discount > 0 ? (subtotal * discount) / 100 : 0;

  // Final total
  const total = subtotal - discountAmount + cleaningFee + serviceFee + taxes;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>
            {formatCurrency(basePrice)} × {nights} nights × {quantity}
          </span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({discount}%)</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        {cleaningFee > 0 && (
          <div className="flex justify-between">
            <span>Cleaning Fee</span>
            <span>{formatCurrency(cleaningFee)}</span>
          </div>
        )}

        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
        )}

        {taxes > 0 && (
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{formatCurrency(taxes)}</span>
          </div>
        )}

        <hr className="my-2" />

        <div className="flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
