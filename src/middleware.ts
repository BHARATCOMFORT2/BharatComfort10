import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { rateLimit } from "@/src/lib/ratelimit";

// Supported locales
const SUPPORTED_LOCALES = ["en", "hi", "fr", "es", "de", "zh", "ar"];
const DEFAULT_LOCALE = "en";

// Protected routes
const AUTH_REQUIRED = [
  "/dashboard",
  "/partner",
  "/bookings",
  "/stories/new",
  "/api/listings/approve",
  "/api/bookings/create-intent"
];

// Role-based admin routes
const ADMIN_ONLY = ["/dashboard/admin", "/api/users/role"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // -----------------------------
  // 1. Locale detection
  // -----------------------------
  const pathname = url.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (!SUPPORTED_LOCALES.includes(locale)) {
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  // -----------------------------
  // 2. Auth check (JWT cookie)
  // -----------------------------
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Protect routes
  if (AUTH_REQUIRED.some((path) => pathname.startsWith(path))) {
    if (!token) {
      url.pathname = `/${locale}/auth/login`;
      return NextResponse.redirect(url);
    }
  }

  // Role-based admin check
  if (ADMIN_ONLY.some((path) => pathname.startsWith(path))) {
    if (!token || token.role !== "admin") {
      url.pathname = `/${locale}`;
      return NextResponse.redirect(url);
    }
  }

  // -----------------------------
  // 3. Rate limiting API routes
  // -----------------------------
  if (pathname.startsWith("/api")) {
    const ip = req.ip ?? "127.0.0.1";
    const { success } = await rateLimit(ip);
    if (!success) {
      return new NextResponse("Too many requests", { status: 429 });
    }
  }

  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
