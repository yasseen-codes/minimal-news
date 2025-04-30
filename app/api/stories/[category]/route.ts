// app/api/stories/[category]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { routeValue } from "@/types/api";
import { HN_API_URL } from "@/types/hn";

async function fetchStoryIds(category: routeValue): Promise<number[] | null> {
  const url = `${HN_API_URL}/${category}stories.json`;
  console.log(`Fetching story IDs from: ${url}`);

  try {
    const response = await fetch(url, {
      // Revalidate the cache for this fetch every 60 seconds
      next: { revalidate: 60 },
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      console.error(
        `Error fetching story IDs for category ${category}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    // Parse the JSON response
    const storyIds: number[] = await response.json();

    // Hacker News API returns null if the list is empty or category is invalid
    if (!storyIds) {
      console.warn(`No story IDs returned for category: ${category}`);
      return [];
    }

    return storyIds;
  } catch (error) {
    // Catch any network or other errors during the fetch
    console.error(`Failed to fetch story IDs for category ${category}:`, error);
    return null;
  }
}

// the request parameter is not used in this function, but it's part of the Next.js API route signature
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: routeValue }> },
) {
  const category = (await params).category;

  const validCategories: routeValue[] = ["top", "new", "ask", "show"];
  if (!validCategories.includes(category)) {
    // Return a 400 Bad Request response for invalid categories
    return NextResponse.json(
      { error: "Invalid story category" },
      { status: 400 },
    );
  }

  const storyIds = await fetchStoryIds(category);

  // Check if fetching the IDs was successful
  if (storyIds === null) {
    // Return a 500 Internal Server Error if fetching failed
    return NextResponse.json(
      { error: `Failed to fetch ${category} stories from external API` },
      { status: 500 },
    );
  }

  // Return the fetched story IDs as a JSON response
  // NextResponse.json automatically sets the Content-Type header to application/json
  return NextResponse.json(storyIds);
}
