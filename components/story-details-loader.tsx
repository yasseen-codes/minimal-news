// components/StoryContentLoader.tsx

import { notFound } from "next/navigation";
import StoryDetails from "@/components/story-details";
import { fetchStory } from "@/lib/data";

// The StoryContentLoader component fetches the data and renders StoryDetails
export default async function StoryDetailsLoader({
  storyId,
}: {
  storyId: string;
}) {
  // Fetch the story data using the API route
  const story = await fetchStory(storyId);

  if (!story) {
    notFound();
  }

  // Render the StoryDetails component, passing the fetched story data
  // This part only runs after the fetch is complete
  return (
    <div className="animate-in fade-in-35 duration-300">
      <StoryDetails story={story} />
    </div>
  );
}
