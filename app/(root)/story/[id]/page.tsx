// app/(root)/story/[id]/page.tsx

import { Suspense } from "react";

import { BackButton } from "@/components/ui/back-button";

import { StoryDetailsSkeleton } from "@/components/skeletons";

import StoryDetailsLoader from "@/components/story-details-loader";

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
