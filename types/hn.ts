export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const HN_API_URL = "https://hacker-news.firebaseio.com/v0";

export type HNStory = {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants: number;
  time: number;
  by: string;
};

// Define a type for a generic Hacker News item (could be story, comment, etc.)
export interface HNItem {
  id: number;
  deleted?: boolean;
  type?: "job" | "story" | "comment" | "poll" | "pollopt";
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[]; // Array of child item IDs (comments)
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number; // Only for stories/polls
  children?: HNItem[]; // Added for recursive fetching
}

export interface HNCommentItem {
  id: number;
  by?: string; // Author's username
  time?: number; // Unix timestamp
  text?: string; // Comment content (HTML)
  parent?: number; // Parent item ID
  kids?: number[]; // Array of child comment IDs (not used directly here, but part of HNItem)
  children?: HNCommentItem[]; // Nested comments (fetched recursively by API)
  deleted?: boolean; // Indicates if the comment is deleted
  dead?: boolean; // Indicates if the comment is dead
}

export interface HNStoryItem {
  id: number;
  deleted?: boolean;
  type?: "job" | "story" | "comment" | "poll" | "pollopt";
  by?: string;
  time?: number;
  text?: string; // Content of the story (for Ask HN, etc.) or comment
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[]; // Array of child item IDs (comments)
  url?: string; // URL for stories
  score?: number; // Score for stories
  title?: string; // Title for stories
  parts?: number[];
  descendants?: number; //  Comment count for stories/polls
  children?: HNCommentItem[]; //  Added in our API route for nested comments (comments are also HNItems)
}
