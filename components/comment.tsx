// components/Comment.tsx

"use client"; // This component uses useState, so it needs to be a Client Component

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { HNCommentItem } from "@/types/hn";

// The individual Comment component
const Comment: React.FC<{ comment: HNCommentItem }> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false); // Start with replies folded by default

  // Do not render deleted or dead comments
  if (comment.deleted || comment.dead) {
    return null;
  }

  // Use dangerouslySetInnerHTML to render HTML content from the API
  // Be cautious with this if the source is not trusted. HN content is generally safe.
  const commentContent = { __html: comment.text || "" };

  return (
    <div className="border-accent dark:border-accent/50 space-y-4 border-l-2 pl-4">
      {/* Added border and padding for nesting */}
      {/* Comment Header */}
      <div className="text-muted-foreground flex items-center justify-between font-mono text-sm">
        <span className="text-foreground font-semibold">
          {comment.by || "[deleted]"}
        </span>
        {comment.time && (
          <span>{formatTimeAgo(comment.time)} ago</span> // Format the timestamp
        )}
      </div>
      {/* Comment Content */}
      {/* Render the HTML content */}
      <div
        className="text-foreground prose dark:prose-invert prose-a:text-blue-500 max-w-none font-sans text-base leading-relaxed text-pretty"
        dangerouslySetInnerHTML={commentContent}
      />
      {/* Replies */}
      {/* Check if there are children comments to display */}
      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm"
          >
            {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showReplies
              ? "Collapse"
              : `${comment.children.length} ${comment.children.length === 1 ? "reply" : "replies"}`}
          </button>
          {showReplies && (
            <div className="mt-2 space-y-6">
              {/* Recursively render child comments */}
              {comment.children.map((reply) => (
                // Pass the child comment (which is also an HNCommentItem) to a new Comment component
                <Comment key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// The Comments container component
// This component maps over an array of top-level comments (HNCommentItem[])
export const Comments: React.FC<{ comments: HNCommentItem[] }> = ({
  comments,
}) => {
  // Filter out any nulls just in case
  const validComments = comments.filter(
    (comment): comment is HNCommentItem => comment !== null,
  );

  return (
    <div className="space-y-8">
      {/* Space between top-level comments */}
      {validComments.map((comment) => (
        // Render a Comment component for each top-level comment
        <Comment key={comment.id} comment={comment} />
      ))}
      {validComments.length === 0 && (
        <p className="text-muted-foreground text-sm italic">No comments yet.</p>
      )}
    </div>
  );
};
