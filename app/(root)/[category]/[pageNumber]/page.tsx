// app/(root)/[category]/[page]/page.tsx

import { Suspense } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { generateListPageMetadata } from "@/lib/metadata";

import {
  PaginationSkeleton,
  StoriesListSkeleton,
} from "@/components/skeletons";

import { routeValue } from "@/types/api";
import StoriesContent from "@/components/stories-content";
import PaginationLoader from "@/components/pagination-loader";

// This function runs on the server and generates metadata based on BOTH category and page params
export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{
      category: routeValue;
      pageNumber: string;
    }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Get the category and page number from the params
  const category = (await params).category;
  const page = parseInt((await params).pageNumber || "1");

  return generateListPageMetadata(category, page, parent);
}

export default async function Page({
  params,
}: {
  params: Promise<{
    category: routeValue;
    pageNumber: string;
  }>;
}) {
  const category = (await params).category;
  const pageNumber = parseInt((await params).pageNumber || "1");
  const storiesPerPage = 30;

  const validRoutes: routeValue[] = ["top", "new", "ask", "show"];

  if (!validRoutes.includes(category)) {
    notFound();
  }

  let pageTitle: string;
  switch (category) {
    case "top":
      pageTitle = "Top Stories";
      break;
    case "new":
      pageTitle = "New Stories";
      break;
    case "ask":
      pageTitle = "Ask HN";
      break;
    case "show":
      pageTitle = "Show HN";
      break;

    default:
      pageTitle = "Minimal News";
  }

  return (
    <>
      <h2 className="sr-only">{pageTitle}</h2>

      <Suspense
        fallback={<StoriesListSkeleton storiesPerPage={storiesPerPage} />}
      >
        <StoriesContent
          pageNumber={pageNumber}
          route={category}
          storiesPerPage={storiesPerPage}
        />
      </Suspense>

      <Suspense fallback={<PaginationSkeleton />}>
        <PaginationLoader
          pageNumber={pageNumber}
          route={category}
          storiesPerPage={storiesPerPage}
        />
      </Suspense>
    </>
  );
}
