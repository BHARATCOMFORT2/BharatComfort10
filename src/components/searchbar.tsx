"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState({ start: "", end: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Push to search results page with filters
    console.log("Searching for:", { query, location, dates });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
    >
      {/* Destination */}
      <div className="flex-1 p-4 border-b md:border-b-0 md:border-r">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where do you want to go?"
          className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Keywords */}
      <div className="flex-1 p-4 border-b md:border-b-0 md:border-r">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hotels, restaurants, experiences..."
          className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Dates */}
      <div className="flex-1 p-4 border-b md:border-b-0 md:border-r">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dates
        </label>
        <div className="flex gap-2">
          <input
            type="date"
            value={dates.start}
            onChange={(e) => setDates({ ...dates, start: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="date"
            value={dates.end}
            onChange={(e) => setDates({ ...dates, end: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="p-4 flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </form>
  );
}
