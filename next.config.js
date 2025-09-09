/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: [
      "firebasestorage.googleapis.com", // Firebase Storage
      "lh3.googleusercontent.com",     // Google OAuth profile pics
      "images.unsplash.com",           // Unsplash fallback
    ],
  },

  i18n: {
    locales: ["en", "hi", "fr", "es", "de", "zh", "ja"],
    defaultLocale: "en",
    localeDetection: true,
  },

  experimental: {
    appDir: true, // App Router enabled
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
