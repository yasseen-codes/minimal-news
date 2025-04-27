// app/story/[id]/page.tsx

import { notFound } from "next/navigation"; // Import notFound for handling missing stories

// Import the StoryDetails component
import StoryDetails from "@/components/story-details";
import { HNStoryItem } from "@/types/hn";
import { BackButton } from "@/components/ui/back-button";

// We'll define or import types for the fetched story data here
// Based on our API route, the fetched item will match the HNItem structure
// Ensure this interface matches the structure returned by your /api/story/[id] route

// Access the environment variable for the site URL
// Provide a fallback for development if the variable is not set
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Function to fetch a single story item by its ID from our API route
async function fetchStory(id: string): Promise<HNStoryItem | null> {
  const apiRoute = `${SITE_URL}/api/story/${id}`;
  console.log(`Fetching story details from: ${apiRoute}`); // Log the URL being fetched

  try {
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

// The dynamic page component for displaying a single story
export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const storyId = (await params).id; // Get the story ID from the dynamic route segment

  // Fetch the story data using the API route
  const story = await fetchStory(storyId);

  // If the story was not found, render the Next.js notFound page
  if (!story) {
    notFound();
  }

  // Render the StoryDetails component, passing the fetched story data
  return (
    <div className="container max-w-full space-y-4">
      <BackButton />
      {/* Pass the entire fetched story object to the StoryDetails component */}
      <StoryDetails story={story} />
    </div>
  );
}
