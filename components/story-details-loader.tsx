// components/story-content-loader.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { storyKeys } from "@/lib/query-keys";

import { fetchStoryDetails } from "@/lib/data";

import { notFound } from "next/navigation";
import StoryDetails from "@/components/story-details";
import { StoryDetailsSkeleton } from "./skeletons";

// The StoryContentLoader component fetches the data and renders StoryDetails
export default function StoryDetailsLoader({ storyId }: { storyId: number }) {
  const {
    data: story,
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
  } = useQuery({
    queryKey: storyKeys.detailFull(storyId),
    queryFn: () => fetchStoryDetails(storyId),

    staleTime: 15 * 60 * 1000,
    gcTime: 25 * 60 * 1000,
    retry: 3,
  });

  if (isLoading || isFetching) {
    return (
      <div className="animate-in fade-in-35 duration-300">
        <StoryDetailsSkeleton />
      </div>
    );
  }

  // If the query failed (e.g., network error, 500 from API route)
  if (isError) {
    console.error(`Error fetching story ${storyId}:`, error);

    return (
      <div className="animate-in fade-in-35 text-destructive p-8 text-center duration-300">
        <p className="mb-4 text-xl font-semibold">Error loading story.</p>
        <p className="text-muted-foreground">Please try again later.</p>

        {process.env.NODE_ENV === "development" && error && (
          <pre className="mt-4 overflow-auto text-left text-sm">
            {JSON.stringify(error, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  if (isSuccess && story === null) {
    notFound();
  }

  if (isSuccess && story) {
    return (
      <div className="animate-in fade-in-35 duration-300">
        <StoryDetails story={story} />
      </div>
    );
  }

  // Fallback return (should ideally not be reached if all states are covered)
  // This might return null initially before the query starts, or if none of the above conditions are met.
  return null;
}
