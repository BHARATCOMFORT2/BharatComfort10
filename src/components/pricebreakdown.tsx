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
