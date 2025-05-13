// components/PaginationLoader.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { storyKeys } from "@/lib/query-keys";

import { routeValue } from "@/types/api";
import { fetchStoryListIds } from "@/lib/data";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationSkeleton } from "@/components/skeletons";

const MAX_PAGINATION_LINKS = 5;

export default function PaginationLoader({
  storiesPerPage,
  pageNumber,
  route,
}: {
  storiesPerPage: number;
  pageNumber: number;
  route: routeValue;
}) {
  const {
    data: allStoryIds,
    isLoading: isLoadingIds,
    isError: isErrorIds,
    error: errorIds,
    isSuccess: isSuccessIds,
  } = useQuery({
    queryKey: storyKeys.lists(route), // Use the same key as StoriesContent
    queryFn: () => fetchStoryListIds(route),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
  });

  // Show the pagination skeleton only on the first load when there's no data in the cache.
  if (isLoadingIds) {
    return <PaginationSkeleton />;
  }

  if (isErrorIds) {
    console.error("Error fetching story list IDs for pagination:", errorIds);
    return null;
  }

  if (!isSuccessIds || !allStoryIds || allStoryIds.length === 0) {
    // Log a warning if no IDs are available after a successful fetch
    if (isSuccessIds && (!allStoryIds || allStoryIds.length === 0)) {
      console.warn(
        "No story IDs available for pagination after successful fetch.",
      );
    }
    return null;
  }

  // This section is reached only if data is successfully loaded (isSuccessIds is true)
  // This data could be fresh or stale cached data.
  const totalStories = allStoryIds.length;
  const totalPages = Math.ceil(totalStories / storiesPerPage);

  // If only one page, no need for pagination controls.
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of pagination links to display.
  const startPage = Math.max(
    1,
    pageNumber - Math.floor(MAX_PAGINATION_LINKS / 2),
  );
  const endPage = Math.min(totalPages, startPage + MAX_PAGINATION_LINKS - 1);

  // Adjust startPage if endPage is limited by totalPages, to ensure MAX_PAGINATION_LINKS are shown if possible.
  const adjustedStartPage = Math.max(1, endPage - MAX_PAGINATION_LINKS + 1);

  // Generate an array of page numbers to display in the pagination links.
  const pagesToDisplay = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i,
  );

  // Determine if previous/next buttons should be disabled based on the current page number.
  const isPreviousDisabled = pageNumber <= 1;
  const isNextDisabled = pageNumber >= totalPages;

  return (
    // Add a key based on route and pageNumber to force re-render when navigating
    // This helps ensure the pagination state is correct immediately on navigation.
    <div className="mt-10 md:mt-15" key={`pagination-${route}-${pageNumber}`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={isPreviousDisabled ? "#" : `/${route}/${pageNumber - 1}`}
              className={
                isPreviousDisabled
                  ? "pointer-events-none opacity-50"
                  : "dark:hover:text-foreground"
              }
            />
          </PaginationItem>

          {pagesToDisplay.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={`/${route}/${p}`}
                isActive={p === pageNumber}
                className="dark:hover:text-foreground"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={isNextDisabled ? "#" : `/${route}/${pageNumber + 1}`}
              className={
                isNextDisabled
                  ? "pointer-events-none opacity-50"
                  : "dark:hover:text-foreground"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
