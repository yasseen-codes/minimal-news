// lib/data.ts

import { routeValue } from "@/types/api";
import { HNStory, HNItem } from "@/types/hn";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const MAX_STORY_IDS_TO_PROCESS = 300;

// Function to fetch a list of story IDs (e.g., top, new, ask, show)
export async function fetchStoryListIds(
  category: routeValue,
): Promise<number[]> {
  const apiRoute = `${SITE_URL}/api/stories/${category}`;
  console.log(`Fetching story IDs from internal API: ${apiRoute}`);

  try {
    // This fetch call targets from internal API route.
    const response = await fetch(apiRoute);

    if (!response.ok) {
      console.error(
        `Error fetching story IDs from internal API ${apiRoute}: ${response.status} ${response.statusText}`,
      );
      throw new Error("Failed to fetch story IDs");
    }

    const ids: number[] = await response.json();

    //  internal API route should handle null/empty from external HN API
    if (!ids) {
      console.warn(
        `No story IDs returned from internal API for type: ${category}`,
      );
      throw new Error("No story IDs found");
    }

    // We still limit the number of IDs processed here before fetching details
    return ids.slice(0, MAX_STORY_IDS_TO_PROCESS);
  } catch (error) {
    console.error(
      `Failed to fetch story IDs for type ${category} from internal API:`,
      error,
    );
    throw new Error("Failed to fetch story IDs");
  }
}

// Function to fetch basic story details
export async function fetchStory(id: number): Promise<HNStory> {
  if (!id || typeof id !== "number") {
    throw new Error("Invalid story ID");
  }
  const apiRoute = `${SITE_URL}/api/story/${id}`;
  console.log(
    `Fetching details for story ID ${id} from internal API: ${apiRoute}`,
  );

  try {
    const response = await fetch(apiRoute);

    if (!response.ok) {
      console.error(
        `Error fetching story details from internal API: ${response.status} ${response.statusText}`,
      );
      throw new Error("Failed to fetch story details");
    }

    const story: HNStory = await response.json();
    // Check if the returned object looks like a valid HNStory.
    if (
      !story ||
      typeof story.id !== "number" ||
      typeof story.title !== "string" ||
      typeof story.by !== "string"
    ) {
      console.warn(
        `Internal API route ${apiRoute} did not return a valid HNStory object for ID ${id}.`,
        story,
      );
    }

    return story;
  } catch (error) {
    console.error(`Failed to fetch story details from internal API:`, error);
    throw new Error("Failed to fetch story details");
  }
}

// Function to fetch  story details
export async function fetchStoryDetails(id: string): Promise<HNItem> {
  const apiRoute = `${SITE_URL}/api/story/details/${id}`;
  console.log(`Fetching story details from: ${apiRoute}`);

  try {
    const response = await fetch(apiRoute);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Story with ID ${id} not found via internal API route.`);
        throw new Error("Story not found");
      }
      console.error(
        `Error fetching story details from internal API ${apiRoute}: ${response.status} ${response.statusText}`,
      );
      throw new Error("Failed to fetch story details");
    }

    const storyItem: HNItem = await response.json();

    // Ensure the fetched item is a valid story
    if (!storyItem || storyItem.type !== "story") {
      console.warn(
        `Fetched item with ID ${id} is not a valid story from internal API:`,
        storyItem,
      );
      throw new Error("Failed to fetch story details");
    }

    return storyItem;
  } catch (error) {
    console.error(
      `Failed to fetch story details for ID ${id} from internal API:`,
      error,
    );
    throw new Error("Failed to fetch story details");
  }
}
