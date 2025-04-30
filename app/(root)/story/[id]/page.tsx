// app/(root)/story/[id]/page.tsx

import { Suspense } from "react";
import { SITE_URL } from "@/types/hn";
import type { Metadata } from "next";
import { fetchStory } from "@/lib/data";

import { BackButton } from "@/components/ui/back-button";
import { StoryDetailsSkeleton } from "@/components/skeletons";
import StoryDetailsLoader from "@/components/story-details-loader";

import { formatTimeISO } from "@/lib/utils";

// The dynamic page component for displaying a single story

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Get the story ID from the dynamic route segment
  const storyId = (await params).id;

  return (
    <div className="container max-w-full space-y-4">
      <BackButton />

      <Suspense fallback={<StoryDetailsSkeleton />}>
        {/* Render the loader component and pass the storyId */}
        <StoryDetailsLoader storyId={storyId} />
      </Suspense>
    </div>
  );
}

// This function runs on the server and generates metadata based on the story ID
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const storyId = (await params).id;

  // Fetch data for the story to use in metadata
  // Next.js automatically de-duplicates fetch calls for the same URL
  const story = await fetchStory(storyId);

  // Construct the dynamic title

  const title = story?.title || "Story Not Found";

  // Construct a dynamic description

  const description = story?.text
    ? story.text.substring(0, 160) + "..." // Use first 160 chars of text if story.text exists
    : story // If story.text doesn't exist, check if story object exists
      ? `Discussion on: "${story.title}" by ${story.by}. Score: ${story.score}, Comments: ${story.descendants}.` // Default description if story exists
      : "The requested story could not be found on Minimal News."; // Fallback description if story is null

  return {
    title: title, // Use the dynamic title
    description: description, // Use the dynamic description

    // Open Graph tags for social media sharing previews
    openGraph: {
      title: title, // Use the dynamic title
      description: description, // Use the dynamic description
      // Use optional chaining for story.id, fallback to SITE_URL if story is null
      url: story?.id ? `${SITE_URL}/story/${story.id}` : SITE_URL,
      siteName: "Minimal News", // Your site name
      // Type is article if story exists, otherwise website
      type: story ? "article" : "website",
      // Add an image if you have one related to stories, or use a default site image
      images: [`${SITE_URL}/minimal-news-logo.png`], // Ensure this URL is correct

      // Use optional chaining for story.by, fallback if story is null
      authors: story?.by ? [story.by] : ["Hacker News"],
      // Use optional chaining for story.time, format if it exists, otherwise undefined
      publishedTime: story?.time ? formatTimeISO(story.time) : undefined,
      modifiedTime: story?.time ? formatTimeISO(story.time) : undefined, // Use published time if no modified time
    },

    // Twitter Card tags for Twitter sharing previews
    twitter: {
      card: "summary", // Or 'summary_large_image'
      title: title, // Use the dynamic title
      description: description, // Use the dynamic description
      // Add an image if you have one related to stories, or use a default site image
      images: [`${SITE_URL}/minimal-news-logo.png`], // Ensure this URL is correct
      // creator: '@yourtwitterhandle', // Your Twitter handle
    },

    // Canonical URL for this specific story page
    alternates: {
      // Use optional chaining for story.id, fallback to SITE_URL if story is null
      canonical: story?.id ? `${SITE_URL}/story/${story.id}` : SITE_URL,
    },
  };
}
