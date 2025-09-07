"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  uid: string;
  role: "user" | "partner" | "staff" | "admin" | "superadmin";
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Fetch user role from API
  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/users/role");
        if (res.ok) {
          const data = await res.json();
          if (data.success) setUser({ uid: data.uid, role: data.role });
        }
      } catch (err) {
        console.error("Navbar role fetch error:", err);
      }
    }
    fetchRole();
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Listings" },
    { href: "/planner", label: "Travel Planner" },
    { href: "/stories", label: "Stories" },
  ];

  if (user?.role === "partner") {
    links.push({ href: "/dashboard/partner", label: "Partner Dashboard" });
  }

  if (user?.role === "admin" || user?.role === "superadmin") {
    links.push({ href: "/dashboard/admin", label: "Admin" });
  }

  const isActive = (href: string) =>
    pathname === href ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            🌍 GlobalTravel
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${isActive(link.href)} hover:text-blue-500 transition`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link href="/auth/logout">
                <Button variant="outline">Logout</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block ${isActive(link.href)} hover:text-blue-500 transition`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <Link href="/auth/logout" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full mt-2">
                Logout
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2">Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
