// components/stories-content.tsx

"use client";

import { fetchStory } from "@/lib/data";
import { storyKeys } from "@/lib/query-keys";
import { formatTimeAgo } from "@/lib/utils";
import { HNStory } from "@/types/hn";
import { useQueries } from "@tanstack/react-query";
import React from "react";
import { StoriesListSkeleton } from "./skeletons";
import { Story } from "./story";

function StoriesContent({
  storyIds,
  storiesPerPage,
  errorIds,
  isLoadingIds,
  isErrorIds,
}: {
  storyIds: number[];
  storiesPerPage: number;
  errorIds: Error | null;
  isLoadingIds: boolean;
  isErrorIds: boolean;
}) {
  const storyQueries = useQueries({
    queries: storyIds.map((id) => ({
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

  // we show skeletons on the first load
  if (isLoadingStories || isLoadingIds) {
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

  if (storyIds.length === 0) {
    return (
      <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
        <ul className="flex max-w-full flex-col items-center gap-5">
          <li className="text-muted-foreground w-full p-8 text-center text-base italic">
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
  if (stories.length === 0 && storyIds.length > 0) {
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
              id={story.id}
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

export default StoriesContent;
