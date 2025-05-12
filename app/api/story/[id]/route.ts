// app/api/story/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { HN_API_URL, HNStory } from "@/types/hn";

async function fetchItemBasicDetails(id: number): Promise<HNStory | null> {
  const url = `${HN_API_URL}/item/${id}.json`;

  try {
    const response = await fetch(url, {
      // Cache data for individual item details.
      // Since details are mostly static, a longer cache time is appropriate.
      next: { revalidate: 900 },
    });

    // Check if the response is OK
    if (!response.ok) {
      console.error(
        `Error fetching item details for ID ${id}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    // Parse the JSON response
    const item = await response.json();

    // Basic check to ensure the item is a story and has necessary properties
    // The HN API can return different item types (comment, poll, job)
    if (
      !item ||
      item.type !== "story" ||
      !item.title ||
      item.time === undefined
    ) {
      return null;
    }

    const story: HNStory = {
      id: item.id,
      title: item.title,
      url: item.url,
      score: item.score || 0,
      descendants: item.descendants || 0,
      time: item.time,
      by: item.by || "unknown",
    };

    return story;
  } catch (error) {
    // Catch any network or other errors during the fetch
    console.error(`Failed to fetch item details for ID ${id}:`, error);
    throw error;
  }
}

// This function handles GET requests to /api/story/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const storyId = parseInt((await params).id);

  if (isNaN(storyId)) {
    return NextResponse.json(
      { error: "Invalid story ID format" },
      { status: 400 },
    );
  }

  try {
    const story = await fetchItemBasicDetails(storyId);

    if (story === null) {
      return NextResponse.json(
        { error: `Story with ID ${storyId} not found or is not a story` },
        { status: 404 },
      );
    }

    // Return the fetched basic story details as a JSON response
    return NextResponse.json(story);
  } catch (error) {
    console.error(
      `Error in /api/story/[id] GET handler for ID ${storyId}:`,
      error,
    );
    return NextResponse.json(
      { error: `Failed to fetch story details for ID ${storyId}` },
      { status: 500 },
    );
  }
}

/* export async function POST(request: NextRequest) {
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
 */
