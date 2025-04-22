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
  title?: string; // Story title
  by?: string; // Author's username
  time?: number; // Unix timestamp
  text?: string; // Story content (for Ask HN, etc.)
  url?: string; // URL for external links
  score?: number; // Score (upvotes)
  descendants?: number; // Comment count (optional, can get from children length)
  children?: HNCommentItem[]; // Top-level comments (fetched recursively by API)
  type?: "story"; // Ensure it's a story type
}
