// components/skeletons.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StorySkeleton() {
  return (
    <div
      className={cn(
        "border-border w-full rounded-lg border-b",
        "py-4",
        "space-y-4 md:space-y-5",
      )}
    >
      {/* Title Placeholder */}
      <Skeleton className="h-5 w-3/4 md:w-2/4" />
      {/* Hostname Placeholder */}
      <div className="space-y-3 md:flex md:items-center md:justify-between md:space-y-0">
        <Skeleton className="h-3 w-1/4" />
        {/* Meta Info Placeholder */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function StoriesListSkeleton({
  storiesPerPage,
}: {
  storiesPerPage: number;
}) {
  return (
    <div className="space-y-4">
      {[...Array(storiesPerPage)].map((_, index) => (
        <StorySkeleton key={index} />
      ))}
    </div>
  );
}

export function StoryDetailsSkeleton() {
  return (
    <div
      className={cn(
        "w-full rounded-lg border p-6 shadow-lg md:p-8",
        "space-y-4 md:space-y-6",
      )}
    >
      {/* Title Placeholder */}
      <Skeleton className="mb-4 h-8 w-3/4" />
      {/* Link Placeholder */}
      <Skeleton className="h-4 w-30" />
      {/* Metadata Placeholder */}
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm md:justify-between md:text-base">
        <Skeleton className="h-4 w-20" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {/* Content Placeholder (multiple lines) */}
      <div className="border-border mt-6 space-y-3 border-t pt-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      {/* Comments Section Heading Placeholder */}
      <div className="border-border mt-6 space-y-6 border-t pt-6">
        <Skeleton className="mb-4 h-6 w-1/4" />
        {/* Placeholder for a few comment skeletons */}
        <div className="border-accent/50 space-y-2 border-l-2 pl-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="border-accent/50 space-y-2 border-l-2 pl-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="mt-10 flex items-center justify-center gap-6 md:mt-15">
      <Skeleton className="h-4 w-16" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-4 w-6" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
