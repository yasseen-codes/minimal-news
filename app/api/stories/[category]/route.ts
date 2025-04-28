import { NextRequest, NextResponse } from "next/server"; // For App Router

import { routeValue } from "@/types/api";

// Base URL for the Hacker News API
const HN_API_BASE_URL = "https://hacker-news.firebaseio.com/v0";

// Function to fetch a list of story IDs for a given category
// Using 'string' for category here, but you could use routeValue if imported
async function fetchStoryIds(category: routeValue): Promise<number[] | null> {
  // Construct the correct API URL based on the category
  const url = `${HN_API_BASE_URL}/${category}stories.json`;
  console.log(`Fetching story IDs from: ${url}`); // Log the URL being fetched

  try {
    const response = await fetch(url, {
      // *** Add revalidation option here ***
      // Revalidate the cache for this fetch every 60 seconds
      next: { revalidate: 60 }, // Cache data for 60 seconds
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
      return []; // Return an empty array if the API returns null or empty
    }

    return storyIds;
  } catch (error) {
    // Catch any network or other errors during the fetch
    console.error(`Failed to fetch story IDs for category ${category}:`, error);
    return null; // Return null in case of an error
  }
}

// API Route Handler

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: routeValue }> }, // Extract the dynamic segment 'category'
) {
  const category = (await params).category; // Get the category value from the URL

  // Basic validation for the category parameter
  const validCategories = ["top", "new", "ask", "show"];
  if (!validCategories.includes(category)) {
    // Return a 400 Bad Request response for invalid categories
    return NextResponse.json(
      { error: "Invalid story category" },
      { status: 400 },
    );
  }

  // Fetch the story IDs using the helper function
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
