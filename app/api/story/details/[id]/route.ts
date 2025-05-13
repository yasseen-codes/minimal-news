// app/api/story/details/[id]/route.ts

import { HNCommentItem, HNItem, HN_API_URL } from "@/types/hn";

import { NextRequest, NextResponse } from "next/server";

// Function to fetch details for a single item by its ID (recursive for comments/replies)
async function fetchItem(id: number): Promise<HNItem | null> {
  const url = `${HN_API_URL}/item/${id}.json`;

  try {
    const response = await fetch(url, {
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

    // If the item has kids (comment IDs), recursively fetch them
    if (item.kids && item.kids.length > 0) {
      // Fetch all child items concurrently
      const childPromises = item.kids.map((childId) => fetchItem(childId));
      // Note: Using Promise.allSettled to handle both fulfilled and rejected promises
      const fetchedChildrenResults = await Promise.allSettled(childPromises);

      // Filter out rejected promises and null results from fulfilled promises
      const validChildren: HNItem[] = fetchedChildrenResults
        .filter(
          (result) => result.status === "fulfilled" && result.value !== null,
        ) // Extract the value from fulfilled results
        .map((result) => (result as PromiseFulfilledResult<HNItem>).value);

      if (item.type === "story") {
        // If it's a story, assign top-level comments to the 'comments' property
        item.comments = validChildren as HNCommentItem[];
      } else if (item.type === "comment") {
        // If it's a comment, assign replies to the 'replies' property
        (item as HNCommentItem).replies = validChildren as HNCommentItem[];
      }
    } else {
      // If no kids, ensure comments/replies properties are empty arrays or undefined
      if (item.type === "story") {
        item.comments = [];
      } else if (item.type === "comment") {
        (item as HNCommentItem).replies = [];
      }
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

  if (!storyItem || (storyItem as HNItem).type !== "story") {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  return NextResponse.json(storyItem);
}
