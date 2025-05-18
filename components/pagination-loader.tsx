// components/PaginationLoader.tsx

"use client"; // This component uses hooks (useQuery, useFavoriteStore, useMemo), so it must be a Client Component

import { useMemo } from "react"; // Import useMemo hook
import { useQuery } from "@tanstack/react-query"; // Import useQuery hook
import { storyKeys } from "@/lib/query-keys"; // Import query keys

import { routeValue } from "@/types/api"; // Import routeValue type
import { fetchStoryListIds } from "@/lib/data"; // Import the function to fetch story list IDs
import { useFavoriteStore } from "@/stores/favorite-store"; // Import the Zustand favorite store hook (Adjust path if needed)

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationSkeleton } from "@/components/skeletons";

const MAX_PAGINATION_LINKS = 5; // Maximum number of pagination links to display

// Define the props for the PaginationLoader component
type PaginationLoaderProps = {
  storiesPerPage: number; // The number of stories to show per page
  pageNumber: number; // The current page number (1-based)
  // The route can now be a standard routeValue OR 'favorites'
  route: routeValue;
};

// This component fetches the total number of story IDs (either from HN API or Zustand)
// and renders the pagination controls.
export default function PaginationLoader({
  storiesPerPage,
  pageNumber,
  route,
}: PaginationLoaderProps) {
  // --- Conditional Logic: Get total count from Zustand for 'favorites' route ---
  const isFavoritesRoute = route === "favorites";

  // Use useFavoriteStore to get the favorite IDs if it's the favorites route
  // The hook should only be called conditionally based on isFavoritesRoute
  const favoriteStoryIdsSet = isFavoritesRoute
    ? useFavoriteStore((state) => state.favoriteStoryIds)
    : null;

  // Memoize the array of favorite IDs from the Set
  const favoriteStoryIdsArray = useMemo(
    () => (favoriteStoryIdsSet ? Array.from(favoriteStoryIdsSet) : []),
    [favoriteStoryIdsSet], // Recreate array only when the Set changes
  );

  // Determine the total number of stories from the favorite store if it's the favorites route
  const totalStoriesFromFavorites = isFavoritesRoute
    ? favoriteStoryIdsArray.length
    : 0;

  // --- Fetch the list of story IDs from HN API for standard routes ---
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
    enabled: !isFavoritesRoute, // *** Only run this query if it's NOT the favorites route ***
  });

  // --- Determine the total number of stories and state for pagination ---
  // If it's the favorites route, use the count from the store.
  // Otherwise, use the count from the API fetch result.
  const totalStories = isFavoritesRoute
    ? totalStoriesFromFavorites
    : (allStoryIdsFromApi?.length ?? 0);

  // Determine loading and error states
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

  // If no total stories are available after a successful fetch (for API routes)
  // OR if there are no favorite stories (for favorites route).
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
    if (isFavoritesRoute && totalStoriesFromFavorites === 0) {
      console.warn("No favorite story IDs available for pagination.");
    }
    // Don't render pagination if there are no stories
    return null;
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

  // Determine if previous/next buttons should be disabled based on the current page number.
  const pagesToDisplay = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i,
  );
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
