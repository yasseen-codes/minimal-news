// components/stories.tsx

import { Story } from "@/components/story";
import { formatTimeAgo } from "@/lib/utils";
import { routeValue } from "@/types/api";

import { redirect } from "next/navigation";

import { fetchStoryListIds, fetchStoriesWithDetails } from "@/lib/data";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const STORIES_PER_PAGE = 30;

const MAX_PAGINATION_LINKS = 5;

export default async function Stories({
  page,
  route,
}: {
  page: number;
  route: routeValue;
}) {
  const allStoryIds = await fetchStoryListIds(route);

  // Handle error or no IDs fetched by the data fetching function
  // fetchStoryListIds returns null on error, [] if API returns null/empty
  if (!allStoryIds || allStoryIds.length === 0) {
    // You might want to render a specific message here if no stories are found
    // This component is inside Suspense, so an empty state is fine.
    return (
      <section className="flex flex-col gap-10">
        <ul className="flex max-w-full flex-col items-center gap-5">
          <li className="text-muted-foreground w-full text-center text-base italic">
            Failed to load stories or no stories available.
          </li>
        </ul>
        {/* Optionally render a disabled pagination skeleton or message */}
        {/* <PaginationSkeleton /> // If you had one */}
      </section>
    );
  }

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
  // If totalPages is 0 and page is 1, we just render an empty list (handled above).
  // --- END: Handle invalid page numbers ---

  // Calculate the start and end indices for the current page
  const startIndex = (page - 1) * STORIES_PER_PAGE;
  const endIndex = startIndex + STORIES_PER_PAGE;

  // Get the story IDs for the current page
  const currentPageStoryIds = allStoryIds.slice(startIndex, endIndex);

  // --- START: Fetching details for the current page's stories using the helper function ---
  // This call is now delegated to the function in lib/data.ts
  // Removed the try/catch block as error handling is now inside fetchStoriesWithDetails
  const storiesForCurrentPage =
    await fetchStoriesWithDetails(currentPageStoryIds);
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
              // Use the story.url if available, otherwise undefined
              url={story.url || undefined}
              upvotes={story.score}
              comments={story.descendants}
              // Ensure formatTimeAgo handles the timestamp correctly
              date={formatTimeAgo(story.time)}
            />
          </li>
        ))}
        {/* Optional: Display a message if no stories are found for this specific page */}
        {/* This case should ideally be handled by the redirect logic in the page component,
             but this provides a fallback if the API returns an empty array for details */}
        {storiesForCurrentPage.length === 0 && allStoryIds.length > 0 && (
          <li className="text-muted-foreground w-full text-center text-base italic">
            No stories found for this page.
          </li>
        )}
        {/* The fallback for allStoryIds.length === 0 is now handled at the top */}
        {/* {storiesForCurrentPage.length === 0 && allStoryIds.length === 0 && (
            <li className="w-full text-center text-gray-500 dark:text-gray-400">
                Failed to load stories or no stories available.
            </li>
        )} */}
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
