"use client";

import ListingCard from "@/components/listingcard";

interface Listing {
  id: string;
  title: string;
  location: string;
  image: string;
  rating?: number;
  price?: string;
  type?: "hotel" | "restaurant" | "experience";
}

interface ListingsGridProps {
  listings: Listing[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No listings found. Try adjusting your search 🔍
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} {...listing} />
      ))}
    </div>
  );
}
