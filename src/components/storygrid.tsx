"use client";

import StoryCard from "@/components/storycard";

interface Story {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author?: string;
  date?: string;
}

interface StoriesGridProps {
  stories: Story[];
}

export default function StoriesGrid({ stories }: StoriesGridProps) {
  if (!stories || stories.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No stories found. Be the first to share your journey ✈️
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stories.map((story) => (
        <StoryCard key={story.id} {...story} />
      ))}
    </div>
  );
}
