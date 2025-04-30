// app/api/stories/details/route.ts

import { NextRequest, NextResponse } from "next/server";
import { HN_API_URL, HNStory } from "@/types/hn";

// API Route Handler (for App Router)
// This function handles POST requests to /api/stories/details
export async function POST(request: NextRequest) {
  let itemIds: number[];

  try {
    // Parse the request body to get the array of item IDs
    const body = await request.json();

    // Validate that the body is an array of numbers
    if (!Array.isArray(body) || !body.every((id) => typeof id === "number")) {
      return NextResponse.json(
        {
          error:
            "Invalid request body. Expected an array of numbers (item IDs).",
        },
        { status: 400 },
      );
    }

    itemIds = body;
  } catch (error) {
    // Handle errors during body parsing
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // If no IDs are provided, return an empty array immediately
  if (itemIds.length === 0) {
    return NextResponse.json([]);
  }

  // Fetch details for all the provided item IDs concurrently
  // Use Promise.all to wait for all fetch promises to settle
  const itemPromises = itemIds.map((id) => fetchItemDetails(id));
  const fetchedItems = await Promise.all(itemPromises);

  // Filter out any items that failed to fetch or were not valid stories
  const validStories: HNStory[] = fetchedItems.filter(
    (item): item is HNStory => item !== null,
  );

  // Return the array of fetched and validated story details
  return NextResponse.json(validStories);
}

export async function fetchItemDetails(id: number): Promise<HNStory | null> {
  // Construct the API URL for a specific item
  const url = `${HN_API_URL}/item/${id}.json`;
  // console.log(`Fetching item details from: ${url}`); // Optional: Log each item fetch

  try {
    const response = await fetch(url, {
      // *** Add caching/revalidation option here ***
      // Cache data for individual item details.
      // Since details are mostly static, a longer cache time is appropriate.
      next: { revalidate: 3600 }, // Cache data for 1 hour (adjust as needed)
      // You could also use cache: 'force-cache' if you never expect details to change
      // but revalidate allows for potential updates if HN API changes behavior.
    });

    // Check if the response is OK
    if (!response.ok) {
      console.error(
        `Error fetching item details for ID ${id}: ${response.status} ${response.statusText}`,
      );
      return null; // Return null if the fetch failed
    }

    // Parse the JSON response
    const item = await response.json();

    // Basic check to ensure the item is a story and has necessary properties
    // The HN API can return different item types (comment, poll, job)
    if (
      !item ||
      item.type !== "story" ||
      !item.title ||
      !item.by ||
      item.time === undefined ||
      item.score === undefined ||
      item.descendants === undefined
    ) {
      // console.warn(`Item with ID ${id} is not a valid story or missing data:`, item);
      return null; // Return null if it's not a valid story item
    }

    // Cast the item to the HNStory type (assuming it matches the interface)
    // Note: The HN API might return other properties not in HNStory, which is fine.
    const story: HNStory = {
      id: item.id,
      title: item.title,
      url: item.url, // URL might be missing for Ask HN or internal stories
      score: item.score,
      descendants: item.descendants,
      time: item.time,
      by: item.by,
      // Add other properties from HNStory if needed and available in the API response
      // e.g., text: item.text, // for Ask HN stories
      // kids: item.kids, // for comments
    };

    return story;
  } catch (error) {
    // Catch any network or other errors during the fetch
    console.error(`Failed to fetch item details for ID ${id}:`, error);
    return null; // Return null in case of an error
  }
}
