"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-3">🌍 GlobalTravel</h2>
          <p className="text-gray-600 text-sm">
            Explore hotels, restaurants, and unique experiences worldwide.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/listings" className="hover:text-blue-600">Listings</Link></li>
            <li><Link href="/planner" className="hover:text-blue-600">Travel Planner</Link></li>
            <li><Link href="/stories" className="hover:text-blue-600">Stories</Link></li>
          </ul>
        </div>

        {/* Partner Links */}
        <div>
          <h3 className="font-semibold mb-3">Partners</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/partner" className="hover:text-blue-600">Join as Partner</Link></li>
            <li><Link href="/dashboard/partner" className="hover:text-blue-600">Partner Dashboard</Link></li>
            <li><Link href="/dashboard/admin" className="hover:text-blue-600">Admin Panel</Link></li>
          </ul>
        </div>

        {/* Social + Language */}
        <div>
          <h3 className="font-semibold mb-3">Connect</h3>
          <div className="flex gap-3 mb-4">
            <Link href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </Link>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <Globe className="w-4 h-4" />
            <span>Language & Currency</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-200 text-center text-sm text-gray-600 py-4">
        © {new Date().getFullYear()} GlobalTravel. All rights reserved.
      </div>
    </footer>
  );
}
