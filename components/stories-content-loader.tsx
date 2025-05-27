// components/stories-content-loader.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { storyKeys } from "@/lib/query-keys";

import { fetchStoryListIds } from "@/lib/data";
import { useFavoriteStore } from "@/stores/favorite-store";

import { routeValue } from "@/types/api";
import StoriesContent from "./stories-content";

type StoriesContentLoaderProps = {
  storiesPerPage: number;
  pageNumber: number;

  route: routeValue;
};

// This component fetches the list of story IDs (either from HN API or Zustand)
// and passes the current page's IDs and state down to StoriesContent.
export default function StoriesContentLoader({
  storiesPerPage,
  pageNumber,
  route,
}: StoriesContentLoaderProps) {
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
  } = useQuery({
    queryKey: storyKeys.lists(route), // Unique key based on the route
    queryFn: () => fetchStoryListIds(route as routeValue), // Cast route back to routeValue for fetch function
    staleTime: 2 * 60 * 1000, // Data is considered fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Data stays in cache for 5 minutes after last use
    retry: 3, // Retry failed queries
    enabled: !isFavoritesRoute, // Only run this query if it's NOT the favorites route
  });

  // If it's the favorites route, use the data from the Zustand store.
  // Otherwise, use the data from the API fetch result.
  const allStoryIds = isFavoritesRoute
    ? Array.from(favoriteStoryIdsSet)
    : allStoryIdsFromApi;

  // Loading and Error states only apply to the API fetch.
  const isLoadingIds = isFavoritesRoute ? false : isLoadingIdsApi;
  const isErrorIds = isFavoritesRoute ? false : isErrorIdsApi;
  const errorIds = isFavoritesRoute ? null : errorIdsApi;

  // This computation depends on the allStoryIds array being available.
  const startIndex = (pageNumber - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;
  // Slice the array of IDs only if allStoryIds is available and is an array
  const currentPageStoryIds = Array.isArray(allStoryIds)
    ? allStoryIds.slice(startIndex, endIndex)
    : [];

  // Pass the current page's story IDs and the relevant state down.
  return (
    <StoriesContent
      storyIds={currentPageStoryIds}
      storiesPerPage={storiesPerPage}
      isLoadingIds={isLoadingIds}
      isErrorIds={isErrorIds}
      errorIds={errorIds}
    />
  );
}
