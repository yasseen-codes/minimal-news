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
      if (response.status === 404) {
        console.warn(`Item with ID ${id} not found on external API (404).`);
        return null; // Return null if external API returns 404
      }
      // For other errors from the external API, throw an error.
      console.error(
        `Error fetching item details for ID ${id} from external API: ${response.status} ${response.statusText}`,
      );
      const error = new Error(
        `External API error fetching item ${id}: ${response.status} ${response.statusText}`,
      );

      throw error; // Throw error for non-404 failures from external API
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
      if (item && item.id) {
        console.warn(
          `Item with ID ${item.id} is not a valid story (${item.type || "unknown type"}) or missing essential data for basic details.`,
        );
      } else {
        console.warn(
          `Fetched item is null or missing ID/type for basic details.`,
        );
      }

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
      console.log(
        `Item with ID ${storyId} treated as not found/not a story for basic details.`,
      );
      return NextResponse.json(null, { status: 200 });
    }

    // Return the fetched basic story details as a JSON response
    return NextResponse.json(story, { status: 200 });
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
