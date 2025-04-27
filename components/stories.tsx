import { Story } from "@/components/story";
import { formatTimeAgo } from "@/lib/utils";
import { routeValue } from "@/types/api"; // Assuming routeValue is defined here
import { HNStory } from "@/types/hn"; // Assuming HNStory is defined here
import { redirect } from "next/navigation"; // Import redirect

// Import shadcn/ui Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Adjust the import path based on your shadcn setup

// Define the number of stories to show per page
const STORIES_PER_PAGE = 30;
// Define the maximum number of pages to display in the pagination control
const MAX_PAGINATION_LINKS = 5;
// Define the maximum number of story IDs to process from the initial fetch
// Updated to 300 as requested
const MAX_STORY_IDS_TO_PROCESS = 300;

// Access the environment variable for the site URL
// Provide a fallback for development if the variable is not set
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function Stories({
  page,
  route,
}: {
  page: number;
  route: routeValue;
}) {
  // --- START: Fetching the full list of story IDs from our API route ---
  // Use the SITE_URL environment variable to construct the full API route URL
  const listApiRoute = `${SITE_URL}/api/stories/${route}`;
  let allStoryIds: number[] = [];

  try {
    const response = await fetch(listApiRoute);

    if (!response.ok) {
      console.error(
        `Error fetching story IDs from ${listApiRoute}: ${response.status} ${response.statusText}`,
      );
      // Depending on how you want to handle errors, you might render an error message
      // or return an empty state. For now, we proceed with an empty array.
    } else {
      const fetchedIds = await response.json();
      // Ensure fetchedIds is actually an array of numbers
      if (
        Array.isArray(fetchedIds) &&
        fetchedIds.every((id) => typeof id === "number")
      ) {
        // --- Modification: Limit the number of story IDs to process ---
        allStoryIds = fetchedIds.slice(0, MAX_STORY_IDS_TO_PROCESS);
        // --- End Modification ---
      } else {
        console.error(
          `API route ${listApiRoute} did not return an array of numbers.`,
        );
        allStoryIds = []; // Reset to empty array if data is unexpected
      }
    }
  } catch (error) {
    console.error(`Failed to fetch story IDs from ${listApiRoute}:`, error);
    // Handle network or other errors during the initial fetch
  }
  // --- END: Fetching the full list of story IDs ---

  // Calculate the total number of pages based on fetched data
  const totalStories = allStoryIds.length;
  const totalPages = Math.ceil(totalStories / STORIES_PER_PAGE);

  // --- START: Handle invalid page numbers ---
  // If the requested page is less than 1 or greater than the total number of pages,
  // redirect to a valid page (e.g., page 1 or the last page).
  // Only redirect if totalPages is known and greater than 0
  if (totalPages > 0 && (page < 1 || page > totalPages)) {
    const validPage = Math.max(1, Math.min(page, totalPages));
    redirect(`/${route}/${validPage}`);
    // Note: `redirect` throws an error, so the code below it won't execute
  } else if (totalPages === 0 && page !== 1) {
    // Handle case where there are no stories but user is not on page 1
    redirect(`/${route}/1`);
  }
  // If totalPages is 0 and page is 1, we just render an empty list.
  // --- END: Handle invalid page numbers ---

  // Calculate the start and end indices for the current page
  const startIndex = (page - 1) * STORIES_PER_PAGE;
  const endIndex = startIndex + STORIES_PER_PAGE;

  // Get the story IDs for the current page
  const currentPageStoryIds = allStoryIds.slice(startIndex, endIndex);

  // --- START: Fetching details for the current page's stories from our API route ---
  let storiesForCurrentPage: HNStory[] = [];
  // Use the SITE_URL environment variable to construct the full API route URL
  const detailsApiRoute = `${SITE_URL}/api/stories/details`;

  // Only fetch details if there are story IDs for the current page
  if (currentPageStoryIds.length > 0) {
    try {
      const response = await fetch(detailsApiRoute, {
        method: "POST", // Use POST method as designed
        headers: {
          "Content-Type": "application/json", // Specify content type
        },
        body: JSON.stringify(currentPageStoryIds), // Send the array of IDs in the body
      });

      if (!response.ok) {
        console.error(
          `Error fetching story details from ${detailsApiRoute}: ${response.status} ${response.statusText}`,
        );
        // Handle error fetching details (e.g., show a message)
      } else {
        const fetchedStories = await response.json();
        // Ensure fetchedStories is an array of HNStory
        if (Array.isArray(fetchedStories)) {
          storiesForCurrentPage = fetchedStories;
        } else {
          console.error(
            `API route ${detailsApiRoute} did not return an array.`,
          );
        }
      }
    } catch (error) {
      console.error(
        `Failed to fetch story details from ${detailsApiRoute}:`,
        error,
      );
      // Handle network or other errors during details fetch
    }
  }
  // --- END: Fetching details for the current page's stories ---

  // Calculate the range of pagination links to display
  const startPage = Math.max(1, page - Math.floor(MAX_PAGINATION_LINKS / 2));
  const endPage = Math.min(totalPages, startPage + MAX_PAGINATION_LINKS - 1);

  // Adjust startPage if endPage is limited by totalPages
  const adjustedStartPage = Math.max(1, endPage - MAX_PAGINATION_LINKS + 1);

  // Generate an array of page numbers to display in the pagination links
  const pagesToDisplay = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i,
  );

  // Determine if previous/next buttons should be disabled
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <section className="flex flex-col gap-10">
      <ul className="flex max-w-full flex-col items-center gap-5">
        {/* Map over the fetched storiesForCurrentPage */}
        {storiesForCurrentPage.map((story) => (
          <li key={story.id} className="w-full">
            <Story
              id={story.id.toString()}
              title={story.title}
              // Use the story.url if available, otherwise construct the HN item URL
              url={story.url || undefined}
              upvotes={story.score}
              comments={story.descendants}
              // Ensure formatTimeAgo handles the timestamp correctly
              date={formatTimeAgo(story.time)}
            />
          </li>
        ))}
        {/* Optional: Display a message if no stories are found */}
        {storiesForCurrentPage.length === 0 && allStoryIds.length > 0 && (
          <li className="w-full text-center text-gray-500 dark:text-gray-400">
            No stories found for this page.
          </li>
        )}
        {storiesForCurrentPage.length === 0 && allStoryIds.length === 0 && (
          <li className="w-full text-center text-gray-500 dark:text-gray-400">
            Failed to load stories or no stories available.
          </li>
        )}
      </ul>

      {/* Shadcn UI Pagination Component */}
      {/* Only show pagination if there is more than one page */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous Page Button */}
            <PaginationItem>
              <PaginationPrevious
                href={isPreviousDisabled ? "#" : `/${route}/${page - 1}`}
                className={
                  isPreviousDisabled ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* Pagination Links */}
            {pagesToDisplay.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink href={`/${route}/${p}`} isActive={p === page}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next Page Button */}
            <PaginationItem>
              <PaginationNext
                href={isNextDisabled ? "#" : `/${route}/${page + 1}`}
                className={
                  isNextDisabled ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
