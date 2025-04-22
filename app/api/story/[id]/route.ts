// app/api/story/[id]/route.ts (for App Router)

import { HNItem } from "@/types/hn";
import { NextRequest, NextResponse } from "next/server";

// Base URL for the Hacker News API
const HN_API_BASE_URL = "https://hacker-news.firebaseio.com/v0";

// Function to fetch details for a single item by its ID (recursive for comments)
async function fetchItem(id: number): Promise<HNItem | null> {
  const url = `${HN_API_BASE_URL}/item/${id}.json`;
  // console.log(`Fetching item: ${url}`); // Optional: Log each item fetch

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Error fetching item ID ${id}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const item: HNItem = await response.json();

    // If the item is deleted or dead, we might not want to process it further
    if (!item || item.deleted || item.dead) {
      return null;
    }

    // If the item has kids (comments), recursively fetch them
    if (item.kids && item.kids.length > 0) {
      // Fetch all child items concurrently
      const childPromises = item.kids.map((childId) => fetchItem(childId));
      const fetchedChildren = await Promise.all(childPromises);

      // Filter out any null results (deleted/dead items or fetch errors)
      // and assign the valid children to the item
      item.kids = fetchedChildren
        .filter((child): child is HNItem => child !== null)
        .map((child) => child.id); // Store only IDs in kids array for the parent item

      (item as any).children = fetchedChildren.filter(
        (child): child is HNItem => child !== null,
      ); // Add a 'children' property to store the nested items
    }

    return item;
  } catch (error) {
    console.error(`Failed to fetch item ID ${id}:`, error);
    return null;
  }
}

// API Route Handler (for App Router)
// This function handles GET requests to /api/story/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Extract the dynamic segment 'id'
) {
  const storyId = parseInt((await params).id); // Get the story ID from the URL

  // Validate that the ID is a valid number
  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
  }

  // Fetch the main story item and its recursive comments
  const storyItem = await fetchItem(storyId);

  if (!storyItem || storyItem.type !== "story") {
    // Return 404 if the item wasn't found or isn't a story
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  // Return the fetched story item (which now includes nested comments in 'children')
  return NextResponse.json(storyItem);
}
