// lib/queryKeys.ts

import { routeValue } from "@/types/api";

// Define query keys for TanStack Query
export const storyKeys = {
  // Key for fetching the list of story IDs for a specific route/category
  lists: (route: routeValue) => ["storyIds", route] as const,

  // Key for fetching BASIC details of a single story (for list view)
  // This key is used for caching individual stories across the app (list, detail page).
  detailBasic: (id: number) => ["story-basic", id] as const,

  // Key for fetching FULL details of a single story (for detail page).
  // This key is used for caching the full story item with comments.
  detailFull: (id: number) => ["story-full", id] as const,
};
