"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="max-w-md text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page. If you think this is a mistake, please contact support.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button variant="default">🏠 Go Home</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">🔑 Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
