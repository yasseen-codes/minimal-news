// components/StoryContentLoader.tsx

// This is a Server Component, it does not need 'use client'
import { notFound } from "next/navigation"; // Import notFound
import StoryDetails from "@/components/story-details"; // Import StoryDetails
import { HNStoryItem } from "@/types/hn"; // Import HNStoryItem type

// Access the environment variable for the site URL
// Provide a fallback for development if the variable is not set
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Function to fetch a single story item by its ID from our API route
// This function should return the HNStoryItem type which includes the children
async function fetchStory(id: string): Promise<HNStoryItem | null> {
  const apiRoute = `${SITE_URL}/api/story/${id}`;
  console.log(`Fetching story details from: ${apiRoute}`); // Log the URL being fetched

  try {
    // This fetch call will suspend this component until it completes
    const response = await fetch(apiRoute);

    if (!response.ok) {
      // If the API route returns 404, it means the story wasn't found
      if (response.status === 404) {
        console.warn(`Story with ID ${id} not found via API route.`);
        return null; // Indicate story not found
      }
      console.error(
        `Error fetching story details from ${apiRoute}: ${response.status} ${response.statusText}`,
      );
      // For other errors, you might want to throw or return null
      return null;
    }

    const storyItem: HNStoryItem = await response.json();

    // Basic check to ensure we got a valid story item of type 'story'
    if (!storyItem || storyItem.type !== "story") {
      console.warn(
        `Fetched item with ID ${id} is not a valid story:`,
        storyItem,
      );
      return null;
    }

    return storyItem;
  } catch (error) {
    console.error(`Failed to fetch story details for ID ${id}:`, error);
    return null;
  }
}

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
  // Note: notFound() should ideally be called in the page component
  // but for simplicity in this pattern, we handle it here.
  if (!story) {
    notFound(); // This will stop rendering and show the not-found page
  }

  // Render the StoryDetails component, passing the fetched story data
  // This part only runs after the fetch is complete
  return <StoryDetails story={story} />;
}
