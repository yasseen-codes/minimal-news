// lib/metadata.ts

import type { Metadata, ResolvingMetadata } from "next";
import { routeValue } from "@/types/api";
import { SITE_URL } from "@/types/hn";

export async function generateListPageMetadata(
  route: routeValue,
  page: number,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  let routeName: string;
  switch (route) {
    case "top":
      routeName = "Top Stories";
      break;
    case "new":
      routeName = "New Stories";
      break;
    case "ask":
      routeName = "Ask HN";
      break;
    case "show":
      routeName = "Show HN";
      break;

    case "favorites":
      routeName = "Favorite Stories";

    default:
      routeName = "Minimal News";
  }

  // Uses the template from layout.tsx (e.g., "Top Stories - Page 2 | Minimal News")
  const title = page === 1 ? routeName : `${routeName} - Page ${page}`;

  const description = `Read the latest ${routeName.toLowerCase()} from Hacker News, page ${page}.`;

  // Optionally, access and extend parent metadata
  const previousOpenGraph = (await parent).openGraph || {};

  return {
    title: title,
    description: description,

    // Open Graph tags for social media sharing previews
    openGraph: {
      ...previousOpenGraph,
      title: title,
      description: description,
      url: `${SITE_URL}/${route}/${page}`,

      images: [`${SITE_URL}/minimal-news-logo.png`],
    },

    // Twitter Card tags for Twitter sharing previews
    twitter: {
      card: "summary",
      title: title,
      description: description,
      images: [`${SITE_URL}/minimal-news-logo.png`],
      // creator: '@yourtwitterhandle', // Your Twitter handle
    },

    // Canonical URL for this specific page
    alternates: {
      canonical: `${SITE_URL}/${route}/${page}`,
    },
  };
}
