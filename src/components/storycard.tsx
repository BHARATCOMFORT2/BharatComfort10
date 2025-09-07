"use client";

import Link from "next/link";

interface StoryCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author?: string;
  date?: string;
}

export default function StoryCard({
  id,
  title,
  excerpt,
  image,
  author,
  date,
}: StoryCardProps) {
  return (
    <Link
      href={`/stories/${id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
    >
      {/* Image */}
      <div className="relative w-full h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {excerpt}
        </p>

        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          {author && <span>By {author}</span>}
          {date && <span>{new Date(date).toLocaleDateString()}</span>}
        </div>
      </div>
    </Link>
  );
}
