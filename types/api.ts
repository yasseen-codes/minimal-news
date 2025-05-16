import { HNStory } from "@/types/hn";

export type ApiResponse = {
  page: number;
  totalPages: number;
  stories: HNStory[];
};

export type routeValue = "top" | "new" | "ask" | "show" | "favorites";
