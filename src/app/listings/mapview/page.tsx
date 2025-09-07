"use client";

import ListingsGrid from "@/components/listingsgrid";
import MapView from "@/components/mapview";

// Mock data for demo (replace with Firestore fetch later)
const mockListings = [
  {
    id: "1",
    title: "Luxury Beach Resort",
    location: "Goa, India",
    lat: 15.2993,
    lng: 74.124,
    image: "https://source.unsplash.com/400x300/?beach,resort",
    rating: 4.8,
    price: "$200/night",
    type: "hotel" as const,
  },
  {
    id: "2",
    title: "Skyline Restaurant",
    location: "New York, USA",
    lat: 40.7128,
    lng: -74.006,
    image: "https://source.unsplash.com/400x300/?restaurant,city",
    rating: 4.6,
    price: "$$$",
    type: "restaurant" as const,
  },
  {
    id: "3",
    title: "Mountain Adventure Tour",
    location: "Swiss Alps, Switzerland",
    lat: 46.8182,
    lng: 8.2275,
    image: "https://source.unsplash.com/400x300/?mountains,adventure",
    rating: 4.9,
    price: "$150/person",
    type: "experience" as const,
  },
];

export default function ListingsMapViewPage() {
  return (
    <div className="flex h-[calc(100vh-80px)]"> {/* subtract navbar height */}
      {/* Left: Listings */}
      <div className="w-full md:w-1/2 overflow-y-auto p-6 border-r">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <ListingsGrid listings={mockListings} />
      </div>

      {/* Right: Map */}
      <div className="hidden md:block md:w-1/2">
        <MapView listings={mockListings} />
      </div>
    </div>
  );
}
