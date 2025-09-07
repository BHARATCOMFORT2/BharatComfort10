// src/lib/currency.ts

const EXCHANGE_API_URL =
  "https://open.er-api.com/v6/latest"; // free exchange rates API

export interface ExchangeRates {
  [currency: string]: number;
}

/**
 * Fetch exchange rates from base currency.
 * Defaults to USD if none provided.
 */
export async function fetchExchangeRates(
  base: string = "USD"
): Promise<ExchangeRates> {
  try {
    const res = await fetch(`${EXCHANGE_API_URL}/${base}`);
    if (!res.ok) throw new Error("Failed to fetch exchange rates");

    const data = await res.json();
    return data.rates as ExchangeRates;
  } catch (error) {
    console.error("Exchange rate fetch error:", error);
    return {};
  }
}

/**
 * Get conversion rate between two currencies.
 */
export async function getConversionRate(
  from: string,
  to: string
): Promise<number> {
  if (from === to) return 1;

  const rates = await fetchExchangeRates(from);
  return rates[to] ?? 1;
}
