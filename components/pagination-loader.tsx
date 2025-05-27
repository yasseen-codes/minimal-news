// components/pagination-loader.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { storyKeys } from "@/lib/query-keys"; //

import { routeValue } from "@/types/api";
import { fetchStoryListIds } from "@/lib/data";
import { useFavoriteStore } from "@/stores/favorite-store";

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

type PaginationLoaderProps = {
  storiesPerPage: number;
  pageNumber: number;

  route: routeValue;
};

// This component fetches the total number of story IDs (either from HN API or Zustand)
// and renders the pagination controls.
export default function PaginationLoader({
  storiesPerPage,
  pageNumber,
  route,
}: PaginationLoaderProps) {
  const favoriteStoryIdsSet = useFavoriteStore(
    (state) => state.favoriteStoryIds,
  );

  const isFavoritesRoute = route === "favorites";

  // Use useQuery only if it's NOT the favorites route
  const {
    data: allStoryIdsFromApi, // The fetched array of story IDs from API
    isLoading: isLoadingIdsApi, // Loading state for API fetch
    isError: isErrorIdsApi, // Error state for API fetch
    error: errorIdsApi, // Error object for API fetch
    isSuccess: isSuccessIdsApi, // Success state for API fetch
  } = useQuery({
    queryKey: storyKeys.lists(route), // Use the same key as StoriesContentLoader
    queryFn: () => fetchStoryListIds(route as routeValue), // Cast route back to routeValue for fetch function
    staleTime: 2 * 60 * 1000, // Data is considered fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Data stays in cache for 5 minutes after last use
    retry: 3, // Retry failed queries
    enabled: !isFavoritesRoute, // Only run this query if it's NOT the favorites route
  });

  // If it's the favorites route, use the count from the store.
  // Otherwise, use the count from the API fetch result.
  const totalStories = isFavoritesRoute
    ? favoriteStoryIdsSet.size
    : (allStoryIdsFromApi?.length ?? 0);

  // Loading/Error only applies to the API fetch, not the Zustand store access.
  const isLoadingIds = isLoadingIdsApi;
  const isErrorIds = isErrorIdsApi;
  const errorIds = errorIdsApi;
  const isSuccessIds = isSuccessIdsApi;

  // Show the pagination skeleton only on the first load when there's no data in the cache (for API routes).
  // For favorites, there's no initial loading state for the count itself.
  if (isLoadingIds && !isFavoritesRoute) {
    return <PaginationSkeleton />;
  }

  // If there was an error fetching the list of IDs (for API routes).
  if (isErrorIds && !isFavoritesRoute) {
    console.error("Error fetching story list IDs for pagination:", errorIds);
    return null; // Don't render pagination on error
  }

  if (totalStories === 0) {
    // Log a warning if no IDs are available after a successful fetch for API routes
    if (
      isSuccessIds &&
      !isFavoritesRoute &&
      (!allStoryIdsFromApi || allStoryIdsFromApi.length === 0)
    ) {
      console.warn(
        "No story IDs available for pagination after successful API fetch.",
      );
    }
    // Log a warning if no favorite stories are found for the favorites route
    if (isFavoritesRoute && totalStories === 0) {
      console.warn("No favorite story IDs available for pagination.");
    }
    return null; // Don't render pagination if there are no stories
  }

  // Calculate total pages based on the total number of stories.
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

  // Adjust startPage if endPage is limited by totalPages, to ensure MAX_PAGINATION_LINKS are shown if possible.
  const endPage = Math.min(totalPages, startPage + MAX_PAGINATION_LINKS - 1);

  // Generate an array of page numbers to display in the pagination links.
  const adjustedStartPage = Math.max(1, endPage - MAX_PAGINATION_LINKS + 1);

  // Ensure we don't go below 1
  const pagesToDisplay = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i,
  );

  // Determine if previous/next buttons should be disabled based on the current page number.
  const isPreviousDisabled = pageNumber <= 1;
  const isNextDisabled = pageNumber >= totalPages;

  // Determine the base path for pagination links
  const basePath = isFavoritesRoute ? "/favorites" : `/${route}`;

  return (
    // Add a key based on route and pageNumber to force re-render when navigating
    // This helps ensure the pagination state is correct immediately on navigation.
    <div className="mt-10 md:mt-15" key={`pagination-${route}-${pageNumber}`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={isPreviousDisabled ? "#" : `${basePath}/${pageNumber - 1}`}
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
                href={`${basePath}/${p}`}
                isActive={p === pageNumber}
                className="dark:hover:text-foreground"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={isNextDisabled ? "#" : `${basePath}/${pageNumber + 1}`}
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
