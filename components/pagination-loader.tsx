// components/PaginationLoader.tsx

import { routeValue } from "@/types/api";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { fetchStoryListIds } from "@/lib/data";

const STORIES_PER_PAGE = 30;

const MAX_PAGINATION_LINKS = 5;

// The PaginationLoader component fetches data and renders the pagination
export default async function PaginationLoader({
  pageNumber,
  route,
}: {
  pageNumber: number;
  route: routeValue;
}) {
  const allStoryIds = await fetchStoryListIds(route);

  // If fetching failed or no IDs, don't render pagination
  if (!allStoryIds || allStoryIds.length === 0) {
    return null;
  }

  // Calculate the total number of pages based on fetched data
  const totalStories = allStoryIds.length;
  const totalPages = Math.ceil(totalStories / STORIES_PER_PAGE);

  // If only one page, no need for pagination
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of pagination links to display
  const startPage = Math.max(
    1,
    pageNumber - Math.floor(MAX_PAGINATION_LINKS / 2),
  );
  const endPage = Math.min(totalPages, startPage + MAX_PAGINATION_LINKS - 1);

  // Adjust startPage if endPage is limited by totalPages
  const adjustedStartPage = Math.max(1, endPage - MAX_PAGINATION_LINKS + 1);

  // Generate an array of page numbers to display in the pagination links
  const pagesToDisplay = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i,
  );

  const isPreviousDisabled = pageNumber <= 1;
  const isNextDisabled = pageNumber >= totalPages;

  return (
    <div className="mt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={isPreviousDisabled ? "#" : `/${route}/${pageNumber - 1}`}
              className={
                isPreviousDisabled ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {/* Pagination Links */}
          {pagesToDisplay.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`/${route}/${page}`}
                isActive={page === pageNumber}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={isNextDisabled ? "#" : `/${route}/${pageNumber + 1}`}
              className={isNextDisabled ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
