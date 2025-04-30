// lib/data.ts

import { routeValue } from "@/types/api";
import { HNStory, HNStoryItem } from "@/types/hn";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const MAX_STORY_IDS_TO_PROCESS = 300;

// Function to fetch a single story item by its ID from our INTERNAL API route /api/story/[id]
export async function fetchStory(id: string): Promise<HNStoryItem | null> {
  const apiRoute = `${SITE_URL}/api/story/${id}`;
  console.log(`Fetching story details from: ${apiRoute}`);

  try {
    const response = await fetch(apiRoute);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Story with ID ${id} not found via internal API route.`);
        return null; // Indicate story not found
      }
      console.error(
        `Error fetching story details from internal API ${apiRoute}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const storyItem: HNStoryItem = await response.json();

    // Ensure the fetched item is a valid story
    if (!storyItem || storyItem.type !== "story") {
      console.warn(
        `Fetched item with ID ${id} is not a valid story from internal API:`,
        storyItem,
      );
      return null;
    }

    return storyItem;
  } catch (error) {
    console.error(
      `Failed to fetch story details for ID ${id} from internal API:`,
      error,
    );
    return null;
  }
}

// Function to fetch a list of story IDs (e.g., top, new, ask, show) from our INTERNAL API route /api/stories/[category]
export async function fetchStoryListIds(
  category: routeValue,
): Promise<number[] | null> {
  const apiRoute = `${SITE_URL}/api/stories/${category}`;
  console.log(`Fetching story IDs from internal API: ${apiRoute}`);

  try {
    // This fetch call targets from internal API route.
    const response = await fetch(apiRoute);

    if (!response.ok) {
      console.error(
        `Error fetching story IDs from internal API ${apiRoute}: ${response.status} ${response.statusText}`,
      );
      return null; // Return null on error
    }

    const ids: number[] = await response.json();

    //  internal API route should handle null/empty from external HN API
    if (!ids) {
      console.warn(
        `No story IDs returned from internal API for type: ${category}`,
      );
      return [];
    }

    // We still limit the number of IDs processed here before fetching details
    return ids.slice(0, MAX_STORY_IDS_TO_PROCESS);
  } catch (error) {
    console.error(
      `Failed to fetch story IDs for type ${category} from internal API:`,
      error,
    );
    return null; // Return null in case of an error
  }
}

// Function to fetch details for a batch of story IDs from our INTERNAL API route /api/stories/details
export async function fetchStoriesWithDetails(
  ids: number[],
): Promise<HNStory[]> {
  // If no IDs are provided, return an empty array immediately
  if (ids.length === 0) {
    return [];
  }
  const detailsApiRoute = `${SITE_URL}/api/stories/details`;
  console.log(
    `Fetching details for ${ids.length} stories from internal API: ${detailsApiRoute}`,
  );

  try {
    // This fetch call targets your internal API route.
    // Caching/revalidation is handled within your /api/stories/details/route.ts.
    const response = await fetch(detailsApiRoute, {
      method: "POST", // Use POST method as designed by your API route
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    });

    if (!response.ok) {
      console.error(
        `Error fetching story details from internal API: ${response.status} ${response.statusText}`,
      );
      return []; // Return empty array on error
    }

    const stories: HNStory[] = await response.json();
    // Ensure returned data is an array (your API route should ensure this)
    if (!Array.isArray(stories)) {
      console.error(
        `Internal API route ${detailsApiRoute} did not return an array.`,
      );
      return [];
    }

    return stories;
  } catch (error) {
    console.error(`Failed to fetch story details from internal API:`, error);
    return []; // Return empty array in case of error
  }
}
