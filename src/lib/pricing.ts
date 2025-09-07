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
// src/lib/pricing.ts

export interface PricingInput {
  basePrice: number;       // price per unit (night, meal, ticket)
  quantity: number;        // how many nights/meals/tickets
  cleaningFee?: number;    // flat fee
  serviceFee?: number;     // flat fee
  taxes?: number;          // percentage (e.g. 10 = 10%)
  discount?: number;       // percentage (e.g. 5 = 5%)
  currency?: string;       // currency code (e.g. "USD", "EUR", "INR")
  targetCurrency?: string; // user’s preferred currency
}

export interface PricingBreakdown {
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
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
    currency = "USD",
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
    currency,
  };
}

/**
 * Convert a price breakdown to another currency using exchange rates.
 * 
 * @param breakdown - pricing breakdown object
 * @param rate - exchange rate (target per base, e.g. 0.92 for USD→EUR)
 * @param targetCurrency - target currency code
 */
export function convertPricing(
  breakdown: PricingBreakdown,
  rate: number,
  targetCurrency: string
): PricingBreakdown {
  return {
    subtotal: breakdown.subtotal * rate,
    cleaningFee: breakdown.cleaningFee * rate,
    serviceFee: breakdown.serviceFee * rate,
    taxAmount: breakdown.taxAmount * rate,
    discountAmount: breakdown.discountAmount * rate,
    total: breakdown.total * rate,
    currency: targetCurrency,
  };
}
// src/lib/pricing.ts
import { getConversionRate } from "@/lib/currency";

export interface PricingInput {
  basePrice: number;
  quantity: number;
  cleaningFee?: number;
  serviceFee?: number;
  taxes?: number;
  discount?: number;
  currency?: string;       // default: USD
  targetCurrency?: string; // auto-convert to this if provided
}

export interface PricingBreakdown {
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
}

/**
 * Core calculation
 */
function calculateBase(input: PricingInput): PricingBreakdown {
  const {
    basePrice,
    quantity,
    cleaningFee = 0,
    serviceFee = 0,
    taxes = 0,
    discount = 0,
    currency = "USD",
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
    currency,
  };
}

/**
 * Public function: calculate + convert (if targetCurrency provided).
 */
export async function calculatePricing(
  input: PricingInput
): Promise<PricingBreakdown> {
  const base = calculateBase(input);

  if (input.targetCurrency && input.targetCurrency !== base.currency) {
    const rate = await getConversionRate(base.currency, input.targetCurrency);

    return {
      subtotal: base.subtotal * rate,
      cleaningFee: base.cleaningFee * rate,
      serviceFee: base.serviceFee * rate,
      taxAmount: base.taxAmount * rate,
      discountAmount: base.discountAmount * rate,
      total: base.total * rate,
      currency: input.targetCurrency,
    };
  }

  return base;
}

  return {
    subtotal,
    cleaningFee,
    serviceFee,
    taxAmount,
    discountAmount,
    total,
  };
}
