"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  rating?: number;
  price?: string;
  type?: "hotel" | "restaurant" | "experience";
}

export default function ListingCard({
  id,
  title,
  location,
  image,
  rating,
  price,
  type,
}: ListingCardProps) {
  return (
    <Link
      href={`/listings/${id}`}
      className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
    >
      {/* Image */}
      <div className="relative w-full h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {type && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-lg">
            {type}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{location}</span>
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between mt-3">
          {rating && (
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
          {price && (
            <span className="text-blue-600 font-semibold">{price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
