// components/Skeletons.tsx

// Import the Skeleton component from shadcn/ui
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

// Skeleton for a single story list item
export function StorySkeleton() {
  return (
    <div
      className={cn(
        "border-border w-full rounded-lg border-b", // Match story item border
        "py-4", // Match story item padding
        "space-y-4 md:space-y-5", // Add spacing between skeleton parts
        // Remove animate-pulse and bg-muted from the container,
        // as shadcn's Skeleton component has its own animation and background
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

// Skeleton for a list of story items (multiple StorySkeletons)
export function StoriesListSkeleton() {
  return (
    <div className="space-y-4">
      {" "}
      {/* Match spacing of the actual list */}
      {[...Array(30)].map(
        (
          _,
          index, // Render 30 skeleton items
        ) => (
          <StorySkeleton key={index} />
        ),
      )}
    </div>
  );
}

// Skeleton for the Story Details page
export function StoryDetailsSkeleton() {
  return (
    <div
      className={cn(
        "w-full rounded-lg border p-6 shadow-lg md:p-8", // Match StoryDetails card styling
        "space-y-4 md:space-y-6", // Add spacing between main sections
        // Remove animate-pulse and bg-muted from the container
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

// You might also need a skeleton for the pagination/footer area if it loads separately
export function PaginationSkeleton() {
  return (
    <div className="border-border bg-muted flex w-full animate-pulse items-center justify-between border-t px-4 py-4 md:px-6">
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
