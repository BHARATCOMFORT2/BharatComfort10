import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n"; // your i18n instance
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Travel & Hospitality Platform",
  description: "Discover hotels, restaurants, stories, and experiences worldwide.",
  keywords: ["travel", "hotels", "restaurants", "booking", "planner", "stories"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"),
  openGraph: {
    title: "Global Travel & Hospitality Platform",
    description: "Discover hotels, restaurants, stories, and experiences worldwide.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
    siteName: "Global Travel & Hospitality",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Global Travel & Hospitality",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={i18n.language}>
      <body className={inter.className}>
        <I18nextProvider i18n={i18n}>
          <CurrencyProvider>
            <Header />
            <main className="min-h-screen pt-16 pb-20 bg-gray-50">
              {children}
            </main>
            <Footer />
          </CurrencyProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
