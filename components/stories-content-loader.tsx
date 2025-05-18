// components/StoriesContent.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { storyKeys } from "@/lib/query-keys";

import { fetchStoryListIds } from "@/lib/data";

import { routeValue } from "@/types/api";
import StoriesContent from "./stories-content";

type StoriesContentProps = {
  storiesPerPage: number;
  pageNumber: number;
  route: routeValue;
};

export default function StoriesContentLoader({
  storiesPerPage,
  pageNumber,
  route,
}: StoriesContentProps) {
  const startIndex = (pageNumber - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;

  const {
    data: allStoryIds,
    isLoading: isLoadingIds, //  fetching for the first time
    // isFetching: isFetchingIds, //  fetching (initial or background)
    isError: isErrorIds,
    error: errorIds, // Error object if the query failed
  } = useQuery({
    queryKey: storyKeys.lists(route),
    queryFn: () => fetchStoryListIds(route),
    staleTime: 2 * 60 * 1000, // Data is considered fresh for 2 minutes
    gcTime: 5 * 60 * 1000, // Data stays in cache for 5 minutes after last use
    retry: 3,
  });

  const currentPageStoryIds = Array.isArray(allStoryIds)
    ? allStoryIds.slice(startIndex, endIndex)
    : [];

  return (
    <StoriesContent
      storyIds={currentPageStoryIds}
      storiesPerPage={storiesPerPage}
      isErrorIds={isErrorIds}
      errorIds={errorIds}
      isLoadingIds={isLoadingIds}
    />
  );
}
