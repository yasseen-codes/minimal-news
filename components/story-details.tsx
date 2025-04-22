// components/StoryDetails.tsx

// This component can be a Server Component as it doesn't use client-side hooks directly,

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // shadcn/ui Card
import { ChevronUp } from "lucide-react"; // Icon from lucide-react
import { Comments } from "./comment"; // Import Comments and HNCommentItem type
import { formatTimeAgo } from "@/lib/utils"; // Assuming formatTimeAgo is here
import { HNStoryItem } from "@/types/hn";
import Link from "next/link";

// Define the type for the main story item, matching the relevant parts of HNItem
// This component expects the main story object fetched from the API

// The StoryDetails component
const StoryDetails: React.FC<{ story: HNStoryItem }> = ({ story }) => {
  // Use dangerouslySetInnerHTML for story text content (like Ask HN posts)
  const storyContent = { __html: story.text || "" };

  // Get top-level comments from the story's children array
  const topLevelComments = story.children || [];

  return (
    <Card className="bg-background rounded-lg border text-pretty shadow-md">
      {/* Header */}
      <CardHeader>
        {/* Link the title to the story URL if available */}
        <CardTitle className="font-serif text-2xl font-bold">
          {story.url ? (
            <Link
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {story.title}
            </Link>
          ) : (
            // If no URL, just display the title (e.g., for Ask HN)
            story.title
          )}
        </CardTitle>

        {/* Metadata: Author, Score, Save Button */}
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span className="font-mono">by {story.by || "[deleted]"}</span>{" "}
          {/* Display author or [deleted] */}
          <div className="flex items-center gap-2">
            {story.score !== undefined && ( // Only show score if available
              <span className="flex items-center gap-1">
                <ChevronUp className="h-4 w-4 md:h-5 md:w-5" /> {story.score}
              </span>
            )}
          </div>
        </div>

        {/* Timestamp and Comment Count */}
        <CardDescription className="font-sans text-xs">
          {story.time && (
            <span>{formatTimeAgo(story.time)} ago</span> // Format the timestamp
          )}
          {/* Display comment count - can use descendants or children length */}
          {/* Using children length is more accurate if API fetches all comments */}
          {topLevelComments.length > 0 && (
            <span>
              {" "}
              | {topLevelComments.length}{" "}
              {topLevelComments.length === 1 ? "comment" : "comments"}
            </span>
          )}
          {topLevelComments.length === 0 &&
            story.descendants !== undefined &&
            story.descendants > 0 && (
              // Fallback to descendants if API didn't fetch children or if you prefer
              <span>
                {" "}
                | {story.descendants}{" "}
                {story.descendants === 1 ? "comment" : "comments"}
              </span>
            )}
        </CardDescription>
      </CardHeader>

      {/* Content (for Ask HN posts, etc.) */}
      {/* Only display content if it exists */}
      {story.text && (
        <CardContent className="space-y-4 font-sans">
          <div
            className="story-content text-base leading-relaxed"
            dangerouslySetInnerHTML={storyContent}
          />
          {/* Display 'Read more' link only if there's an external URL */}
          {story.url && (
            <Link
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Read more →
            </Link>
          )}
        </CardContent>
      )}
      {/* If there's no story text but there is an external URL, the link is in the title */}

      {/* Comments Section */}
      {/* Render comments if there are any top-level comments */}
      {topLevelComments.length > 0 ||
      (story.descendants !== undefined && story.descendants > 0) ? (
        <CardContent className="mt-6 space-y-4 border-t pt-6">
          {" "}
          {/* Added border-t and pt-6 for separation */}
          <h3 className="text-lg font-semibold">Comments</h3>
          {/* Pass the top-level comments (children) to the Comments component */}
          <Comments comments={topLevelComments} />
        </CardContent>
      ) : (
        // Display message if no comments
        <CardContent className="mt-6 space-y-4 border-t pt-6">
          <p className="text-muted-foreground text-center italic">
            No comments yet.
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default StoryDetails;
