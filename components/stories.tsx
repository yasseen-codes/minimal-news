// components/StoriesContent.tsx

import { Story } from "@/components/story";
import { formatTimeAgo } from "@/lib/utils";
import { routeValue } from "@/types/api";
import { redirect } from "next/navigation";

import { fetchStoryListIds, fetchStoriesWithDetails } from "@/lib/data";

export default async function Stories({
  storiesPerPage,
  pageNumber,
  route,
}: {
  storiesPerPage: number;
  pageNumber: number;
  route: routeValue;
}) {
  const allStoryIds = await fetchStoryListIds(route);

  // fetchStoryListIds returns null on error, [] if API returns null/empty
  if (!allStoryIds || allStoryIds.length === 0) {
    return (
      <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
        <ul className="flex max-w-full flex-col items-center gap-5">
          <li className="text-muted-foreground w-full text-center text-base italic">
            Failed to load stories or no stories available.
          </li>
        </ul>
      </section>
    );
  }

  // Calculate the total number of pages based on fetched data
  const totalStories = allStoryIds.length;
  const totalPages = Math.ceil(totalStories / storiesPerPage);

  // redirect to a valid page (e.g., page 1 or the last page).
  if (totalPages > 0 && (pageNumber < 1 || pageNumber > totalPages)) {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    redirect(`/${route}/${validPage}`);
  } else if (totalPages === 0 && pageNumber !== 1) {
    redirect(`/${route}/1`);
  }

  // Calculate the start and end indices for the current page
  const startIndex = (pageNumber - 1) * storiesPerPage;
  const endIndex = startIndex + storiesPerPage;

  // Get the story IDs for the current page
  const currentPageStoryIds = allStoryIds.slice(startIndex, endIndex);

  const storiesForCurrentPage =
    await fetchStoriesWithDetails(currentPageStoryIds);

  return (
    <section className="animate-in fade-in-35 flex flex-col gap-10 duration-300">
      <ul className="flex max-w-full flex-col items-center gap-5">
        {storiesForCurrentPage.map((story) => (
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

        {/* If there are no stories for the current page, show a message */}
        {storiesForCurrentPage.length === 0 && allStoryIds.length > 0 && (
          <li className="text-muted-foreground w-full text-center text-base italic">
            No stories found for this page.
          </li>
        )}
      </ul>
    </section>
  );
}
