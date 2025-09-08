// src/lib/ratelimit.ts

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

interface RateLimitOptions {
  limit: number;     // max requests allowed
  windowMs: number;  // time window in ms
}

/**
 * Simple in-memory store (works per server instance).
 * For production: swap with Redis or Firestore TTL.
 */
const store = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt < now) {
    // new window
    store.set(key, { count: 1, expiresAt: now + options.windowMs });
    return { success: true, remaining: options.limit - 1, reset: now + options.windowMs };
  }

  if (entry.count < options.limit) {
    entry.count += 1;
    store.set(key, entry);
    return {
      success: true,
      remaining: options.limit - entry.count,
      reset: entry.expiresAt,
    };
  }

  return { success: false, remaining: 0, reset: entry.expiresAt };
}
