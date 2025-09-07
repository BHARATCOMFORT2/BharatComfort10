"use client";

import Link from "next/link";
import StoriesGrid from "@/components/storiesgrid";

// Mock data (replace with Firestore/API later)
const mockStories = [
  {
    id: "1",
    title: "Exploring the Hidden Beaches of Goa",
    excerpt:
      "Discover secret spots along the Goan coastline where turquoise waters meet golden sands...",
    image: "https://source.unsplash.com/400x300/?beach,goa",
    author: "Aarav Sharma",
    date: "2024-12-20",
  },
  {
    id: "2",
    title: "A Culinary Journey in Bangkok",
    excerpt:
      "From street food stalls to rooftop restaurants, Bangkok offers a feast for every traveler...",
    image: "https://source.unsplash.com/400x300/?food,thailand",
    author: "Meera Kapoor",
    date: "2024-11-15",
  },
];

export default function StoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Travel Stories</h1>
        <Link
          href="/stories/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          + New Story
        </Link>
      </div>

      {/* Stories Grid */}
      <StoriesGrid stories={mockStories} />
    </div>
  );
}
