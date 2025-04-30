// app/api/story/[id]/route.ts

import { HNItem, HN_API_URL } from "@/types/hn";

import { NextRequest, NextResponse } from "next/server";

// Function to fetch details for a single item by its ID (recursive for comments)
async function fetchItem(id: number): Promise<HNItem | null> {
  const url = `${HN_API_URL}/item/${id}.json`;
  console.log(`Fetching item: ${url}`); // Optional: Log each item fetch

  try {
    const response = await fetch(url, {
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

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

      (item as HNItem).children = fetchedChildren.filter(
        (child): child is HNItem => child !== null,
      ); // Add a 'children' property to store the nested items
    }

    return item;
  } catch (error) {
    console.error(`Failed to fetch item ID ${id}:`, error);
    return null;
  }
}

// the request parameter is not used in this function, but it's part of the Next.js API route signature
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const storyId = parseInt((await params).id);

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
