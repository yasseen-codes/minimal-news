// components/StoryContentLoader.tsx

// This is a Server Component, it does not need 'use client'
import { notFound } from "next/navigation";
import StoryDetails from "@/components/story-details";
import { fetchStory } from "@/lib/data";

// The StoryContentLoader component fetches the data and renders StoryDetails
export default async function StoryDetailsLoader({
  storyId,
}: {
  storyId: string;
}) {
  // Fetch the story data using the API route
  // This fetch call will cause *this* component to suspend
  const story = await fetchStory(storyId);

  // If the story was not found, render the Next.js notFound page
  if (!story) {
    notFound();
  }

  // Render the StoryDetails component, passing the fetched story data
  // This part only runs after the fetch is complete
  return <StoryDetails story={story} />;
}
