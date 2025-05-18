// components/StoriesContentLoader.tsx

"use client"; // This component uses hooks (useQuery, useFavoriteStore, useMemo), so it must be a Client Component

import { useMemo } from "react"; // Import useMemo hook
import { useQuery } from "@tanstack/react-query"; // Import useQuery hook
import { storyKeys } from "@/lib/query-keys"; // Import query keys

import { fetchStoryListIds } from "@/lib/data"; // Import the function to fetch story list IDs
import { useFavoriteStore } from "@/stores/favorite-store"; // Import the Zustand favorite store hook

import { routeValue } from "@/types/api"; // Import routeValue type
import StoriesContent from "./stories-content"; // Import the StoriesContent component

// Define the props for the StoriesContentLoader component
type StoriesContentLoaderProps = {
  storiesPerPage: number; // The number of stories to show per page
  pageNumber: number; // The current page number (1-based)
  // The route can now be a standard routeValue OR 'favorites'
  route: routeValue | "favorites"; // *** Updated route type to include 'favorites' ***
};

// This component fetches the list of story IDs (either from HN API or Zustand)
// and passes the current page's IDs and state down to StoriesContent.
export default function StoriesContentLoader({
  storiesPerPage,
  pageNumber,
  route,
}: StoriesContentLoaderProps) {
  const isFavoritesRoute = route === "favorites";

  const favoriteStoryIdsSet = isFavoritesRoute
    ? useFavoriteStore((state) => state.favoriteStoryIds)
    : null;

  // Recreate array only when the Set changes
  const favoriteStoryIdsArray = useMemo(
    () => (favoriteStoryIdsSet ? Array.from(favoriteStoryIdsSet) : []),
    [favoriteStoryIdsSet],
  );

  // --- Fetch the list of story IDs from HN API for standard routes ---
  // Use useQuery only if it's NOT the favorites route
  const {
    data: allStoryIdsFromApi, // The fetched array of story IDs from API
    isLoading: isLoadingIdsApi, // Loading state for API fetch
    isError: isErrorIdsApi, // Error state for API fetch
    error: errorIdsApi, // Error object for API fetch
  } = useQuery({
    queryKey: storyKeys.lists(route), // Unique key based on the route
    queryFn: () => fetchStoryListIds(route as routeValue), // Cast route back to routeValue for fetch function
    staleTime: 2 * 60 * 1000, // Data is considered fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Data stays in cache for 5 minutes after last use
    retry: 3, // Retry failed queries
    enabled: !isFavoritesRoute, // Only run this query if it's NOT the favorites route
  });

  // --- Determine the final list of story IDs and state to pass down ---
  const allStoryIds = isFavoritesRoute
    ? favoriteStoryIdsArray
    : allStoryIdsFromApi;
  const isLoadingIds = isFavoritesRoute ? false : isLoadingIdsApi; // IDs from store are immediately available
  const isErrorIds = isFavoritesRoute ? false : isErrorIdsApi; // Errors only apply to API fetch
  const errorIds = isFavoritesRoute ? null : errorIdsApi; // Errors only apply to API fetch

  // --- Determine the slice of story IDs for the current page ---
  // This computation depends on the allStoryIds array being available.
  // Use optional chaining (`?`) as allStoryIds might be undefined initially (for API fetch).
  const startIndex = (pageNumber - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;
  // Slice the array of IDs only if allStoryIds is available and is an array
  const currentPageStoryIds = Array.isArray(allStoryIds)
    ? allStoryIds.slice(startIndex, endIndex)
    : [];

  // --- Render the StoriesContent component ---
  // Pass the current page's story IDs and the relevant state down.
  return (
    <StoriesContent
      storyIds={currentPageStoryIds} // Pass the sliced list of IDs
      storiesPerPage={storiesPerPage} // Pass stories per page
      isLoadingIds={isLoadingIds} // Pass the determined loading state
      isErrorIds={isErrorIds} // Pass the determined error state
      errorIds={errorIds} // Pass the determined error object
      // Note: StoriesContent now expects these specific props.
      // It will handle fetching details for these IDs and rendering the list/states.
    />
  );
}
