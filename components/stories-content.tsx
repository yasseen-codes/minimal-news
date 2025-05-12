// components/StoriesContent.tsx

"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { storyKeys } from "@/lib/query-keys";

import { fetchStoryListIds, fetchStory } from "@/lib/data";
import { Story } from "@/components/story";
import { StoriesListSkeleton } from "@/components/skeletons";
import { routeValue } from "@/types/api";
import { HNStory } from "@/types/hn";
import { formatTimeAgo } from "@/lib/utils";

type StoriesContentProps = {
  storiesPerPage: number;
  pageNumber: number;
  route: routeValue;
};

export default function StoriesContent({
  storiesPerPage,
  pageNumber,
  route,
}: StoriesContentProps) {
  const startIndex = (pageNumber - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;

  const {
    data: allStoryIds,
    isLoading: isLoadingIds, //  fetching for the first time
    isFetching: isFetchingIds, //  fetching (initial or background)
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

  const storyQueries = useQueries({
    queries: currentPageStoryIds.map((id) => ({
      queryKey: storyKeys.detailBasic(id),

      queryFn: async () => {
        const data = await fetchStory(id);
        if (data) {
          return data;
        }

        return null;
      },
      staleTime: 15 * 60 * 1000,
      gcTime: 25 * 60 * 1000,
      retry: 3,
    })),
  });

  const isLoadingStories = storyQueries.some((query) => query.isLoading);
  const isErrorStories = storyQueries.some((query) => query.isError);
  // Find the first error object from the story queries
  const firstErrorStories = storyQueries.find((query) => query.isError)?.error;

  // we show skeletons on the first load
  if (isLoadingIds || isLoadingStories) {
    return (
      <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
        <StoriesListSkeleton storiesPerPage={storiesPerPage} />
      </section>
    );
  }

  // If there was an error fetching the list of IDs
  if (isErrorIds) {
    console.error("Error fetching stories:", errorIds);
    return (
      <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
        <ul className="flex max-w-full flex-col items-center gap-5">
          <li className="text-destructive w-full p-8 text-center text-base italic">
            {" "}
            {/* Added padding for visibility */}
            <p className="mb-4 text-xl font-semibold">Error loading stories.</p>
            <p className="text-muted-foreground">Please try again later.</p>
            {/* Optionally display error details in development */}
            {process.env.NODE_ENV === "development" &&
              errorIds && ( // Added check for error object existence
                <pre className="mt-4 overflow-auto text-left text-sm">
                  {JSON.stringify(errorIds, null, 2)}
                </pre>
              )}
          </li>
        </ul>
      </section>
    );
  }

  if (!allStoryIds || allStoryIds.length === 0) {
    return (
      <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
        <ul className="flex max-w-full flex-col items-center gap-5">
          <li className="text-muted-foreground w-full p-8 text-center text-base italic">
            {" "}
            {/* Added padding for visibility */}
            No stories found for this category.
          </li>
        </ul>
      </section>
    );
  }

  if (currentPageStoryIds.length === 0) {
    return (
      // *** Preserved styling classes from the original section/ul ***
      <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
        <ul className="flex max-w-full flex-col items-center gap-5">
          <li className="text-muted-foreground w-full p-8 text-center text-base italic">
            {" "}
            {/* Added padding for visibility */}
            No stories found on this page.
          </li>
        </ul>
      </section>
    );
  }

  const stories = storyQueries
    // Filter for successful queries AND ensure query.data is not null or undefined
    .filter((query) => query.isSuccess && query.data != null)
    .map((query) => query.data as HNStory);

  // If after filtering, the stories array is empty, but we expected stories on this page
  // This could happen if fetching individual details failed for all IDs on the page.
  if (stories.length === 0 && currentPageStoryIds.length > 0) {
    return (
      <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
        <ul className="flex max-w-full flex-col items-center gap-5">
          <li className="text-destructive w-full p-8 text-center text-base italic">
            <p className="mb-4 text-xl font-semibold">
              Failed to load stories on this page.
            </p>
            <p className="text-muted-foreground">Please try again later.</p>
          </li>
        </ul>
      </section>
    );
  }

  return (
    <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
      <ul className="flex max-w-full flex-col items-center gap-5">
        {stories.map((story) => (
          <li key={story.id} className="w-full">
            <Story
              id={story.id.toString()}
              title={story.title}
              url={story.url || undefined}
              upvotes={story.score}
              comments={story.descendants}
              date={formatTimeAgo(story.time)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
