// app/api/story/details/[id]/route.ts

import { HNCommentItem, HNItem, HN_API_URL } from "@/types/hn";

import { NextRequest, NextResponse } from "next/server";

// Function to fetch details for a single item by its ID (recursive for comments)
async function fetchItem(id: number): Promise<HNItem | HNCommentItem | null> {
  const url = `${HN_API_URL}/item/${id}.json`;

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

    if (!item || item.deleted || item.dead) {
      return null;
    }

    // If the item has kids (comments), recursively fetch them
    if (item.kids && item.kids.length > 0) {
      const commentsPromises = item.kids.map((kidId) => fetchItem(kidId));
      const fetchedComments = await Promise.all(commentsPromises);

      item.kids = fetchedComments
        .filter((kid): kid is HNCommentItem => kid !== null)
        .map((kid) => kid.id);

      (item as HNItem).comments = fetchedComments.filter(
        (comment): comment is HNCommentItem => comment !== null,
      );
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
