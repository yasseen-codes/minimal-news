// app/(root)/story/[id]/page.tsx

import { SITE_URL } from "@/types/hn";
import type { Metadata } from "next";
import { fetchStoryDetails } from "@/lib/data";

import { BackButton } from "@/components/ui/back-button";
import StoryDetailsLoader from "@/components/story-details-loader";

import { formatTimeISO } from "@/lib/utils";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Get the story ID from the dynamic route segment
  const storyId = parseInt((await params).id);

  return (
    <div className="container max-w-full space-y-4">
      <BackButton />

      <StoryDetailsLoader storyId={storyId} />
    </div>
  );
}

// This function runs on the server and generates metadata based on the story ID
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const storyId = parseInt((await params).id);

  // Fetch data for the story to use in metadata
  // Next.js automatically de-duplicates fetch calls for the same URL
  const story = await fetchStoryDetails(storyId);

  const title = story?.title || "Story Not Found";

  const description = story?.text
    ? story.text.substring(0, 160) + "..." // Use first 160 chars of text if story.text exists
    : story // If story.text doesn't exist, check if story object exists
      ? `Discussion on: "${story.title}" by ${story.by}. Score: ${story.score}, Comments: ${story.descendants}.` // Default description if story exists
      : "The requested story could not be found on Minimal News."; // Fallback description if story is null

  return {
    title: title,
    description: description,

    // Open Graph tags for social media sharing previews
    openGraph: {
      title: title,
      description: description,
      url: story?.id ? `${SITE_URL}/story/${story.id}` : SITE_URL,
      siteName: "Minimal News", // Your site name
      type: story ? "article" : "website",
      images: [`${SITE_URL}/minimal-news-logo.png`],
      authors: story?.by ? [story.by] : ["Hacker News"],
      publishedTime: story?.time ? formatTimeISO(story.time) : undefined,
      modifiedTime: story?.time ? formatTimeISO(story.time) : undefined,
    },

    // Twitter Card tags for Twitter sharing previews
    twitter: {
      card: "summary",
      title: title,
      description: description,

      images: [`${SITE_URL}/minimal-news-logo.png`],
      // creator: '@yourtwitterhandle', // Your Twitter handle
    },

    // Canonical URL for this specific story page
    alternates: {
      canonical: story?.id ? `${SITE_URL}/story/${story.id}` : SITE_URL,
    },
  };
}
