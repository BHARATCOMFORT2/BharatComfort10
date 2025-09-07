// src/lib/pricing.ts

export interface PricingInput {
  basePrice: number;       // price per unit (night, meal, ticket)
  quantity: number;        // how many nights/meals/tickets
  cleaningFee?: number;    // flat fee
  serviceFee?: number;     // flat fee
  taxes?: number;          // percentage (e.g. 10 = 10%)
  discount?: number;       // percentage (e.g. 5 = 5%)
}

export interface PricingBreakdown {
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

/**
 * Calculate booking cost breakdown.
 */
export function calculatePricing(input: PricingInput): PricingBreakdown {
  const {
    basePrice,
    quantity,
    cleaningFee = 0,
    serviceFee = 0,
    taxes = 0,
    discount = 0,
  } = input;

  const subtotal = basePrice * quantity;

  const discountAmount = discount > 0 ? (subtotal * discount) / 100 : 0;
  const taxAmount = taxes > 0 ? ((subtotal - discountAmount) * taxes) / 100 : 0;

  const total =
    subtotal - discountAmount + cleaningFee + serviceFee + taxAmount;

  return {
    subtotal,
    cleaningFee,
    serviceFee,
    taxAmount,
    discountAmount,
    total,
  };
}
