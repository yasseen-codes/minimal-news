import { StoriesListSkeleton } from "@/components/skeletons";
import Stories from "@/components/stories";
import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next"; // Import Metadata types
import { SITE_URL } from "@/types/hn";

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = parseInt((await params).page || "1");
  return (
    <>
      <h2 className="sr-only">Top Stories</h2>
      <Suspense fallback={<StoriesListSkeleton />}>
        <Stories page={page} route="top" />
      </Suspense>
    </>
  );
}

// This function runs on the server and generates metadata based on the route params
export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ page: string }>;
  }, // Access the route params
  parent: ResolvingMetadata, // Optional: Access parent metadata (e.g., from layout.tsx)
): Promise<Metadata> {
  // Get the page number from the params
  const page = parseInt((await params).page || "1");

  // Define the route name (since this file is specifically for 'top')
  const routeName = "Top Stories";

  // Construct the dynamic title
  const title = page === 1 ? routeName : `${routeName} - Page ${page}`;

  // Construct a dynamic description (can be simple or more detailed)
  const description = `Read the latest ${routeName.toLowerCase()} from Hacker News, page ${page}.`;

  // Optionally, access and extend parent metadata
  const previousOpenGraph = (await parent).openGraph || {};

  return {
    title: title, // Use the dynamic title
    description: description, // Use the dynamic description
    // You can override other metadata properties here if needed, e.g.,
    openGraph: {
      ...previousOpenGraph, // Keep parent Open Graph data
      title: title,
      description: description,
      url: `${SITE_URL}/top/${page}`, // Canonical URL for this page
    },
    alternates: {
      canonical: `${SITE_URL}/top/${page}`, // Canonical URL
    },
  };
}
