// components/StoryDetails.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, Clock, MessageCircleMore } from "lucide-react";
import { Comments } from "./comment";
import { formatCommentCount, formatTimeAgo } from "@/lib/utils";
import { HNStoryItem } from "@/types/hn";
import Link from "next/link";

// The StoryDetails component
const StoryDetails: React.FC<{ story: HNStoryItem }> = ({ story }) => {
  // Use dangerouslySetInnerHTML for story text content (like Ask HN posts)
  const storyContent = { __html: story.text || "" };

  // Get top-level comments from the story's children array
  const topLevelComments = story.children || [];

  // Determine the comment count to display
  // Prioritize children length if available, otherwise use descendants
  const commentCount =
    topLevelComments.length > 0
      ? topLevelComments.length
      : (story.descendants ?? 0);

  // Determine the hostname for displaying next to the URL in the header if no story text
  const hostname = story.url ? new URL(story.url).hostname : null;

  return (
    <Card className="bg-background rounded-lg border-2 p-6 shadow-lg md:p-8">
      <CardHeader className="p-0">
        <CardTitle className="mb-2 font-serif text-base leading-tight font-bold md:text-2xl">
          {story.title}
        </CardTitle>

        {story.url && hostname && (
          <Link
            href={story.url}
            className="text-foreground font-mono text-sm hover:underline md:text-lg"
          >
            ({hostname})
          </Link>
        )}

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm md:justify-between md:text-base">
          {story.by ? (
            <span>
              by <span className="text-foreground">{story.by}</span>
            </span>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3 pr-0 text-xs md:gap-4 md:text-sm">
            {story.score !== undefined && (
              <span className="flex items-center gap-1">
                <ArrowUpCircle className="h-[14px] w-[14px] md:h-4 md:w-4" />

                {story.score}
              </span>
            )}

            {story.time && (
              <span className="flex items-center gap-1">
                <Clock className="h-[14px] w-[14px] md:h-4 md:w-4" />
                {formatTimeAgo(story.time)} ago
              </span>
            )}
            {/* Comment Count - Link to comments section */}
            {commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircleMore className="h-[14px] w-[14px] md:h-4 md:w-4" />
                <span>{formatCommentCount(commentCount)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Only display content if it exists */}
      {story.text && (
        <CardContent className="border-border border-t-2 p-0 pt-6 font-sans leading-relaxed md:text-xl">
          <h3 className="mb-4 font-semibold">Description</h3>
          <div
            className="prose dark:prose-invert text-foreground max-w-none text-pretty"
            dangerouslySetInnerHTML={storyContent}
          />
        </CardContent>
      )}

      {/* Render comments if there are any top-level comments or descendants count > 0 */}
      {commentCount && (
        // Add an ID for the comments section to link to from the list page
        <CardContent
          id="comments"
          className="border-border border-t-2 p-0 pt-6 md:text-xl"
        >
          <h3 className="mb-4 font-semibold">Comments ({commentCount})</h3>
          {/* Adjusted heading size and added comment count */}
          {/* Pass the top-level comments (children) to the Comments component */}
          <Comments comments={topLevelComments} />
        </CardContent>
      )}
    </Card>
  );
};

export default StoryDetails;
