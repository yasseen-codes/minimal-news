import { StoriesListSkeleton } from "@/components/skeletons";
import Stories from "@/components/stories";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page || "1");
  return (
    <Suspense fallback={<StoriesListSkeleton />}>
      <Stories page={page} route="new" />
    </Suspense>
  );
}
