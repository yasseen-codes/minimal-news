// components/Comment.tsx

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { HNCommentItem } from "@/types/hn";

function Comment({ comment }: { comment: HNCommentItem }) {
  // Start with replies folded by default
  const [showReplies, setShowReplies] = useState(false);

  // Do not render deleted or dead comments
  if (comment.deleted || comment.dead) {
    return null;
  }

  // Use dangerouslySetInnerHTML to render HTML content from the API
  // Be cautious with this if the source is not trusted. HN content is generally safe.
  const commentContent = { __html: comment.text || "" };

  return (
    <div className="border-accent dark:border-accent/50 space-y-4 border-l-2 pl-4">
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
      <div
        className="text-foreground prose dark:prose-invert prose-a:text-secondary md:prose-a:hover:text-accent prose-a:active:text-accent prose-a:break-all max-w-none font-sans text-base leading-relaxed text-pretty"
        dangerouslySetInnerHTML={commentContent}
      />
      {/* Replies */}
      {/* Check if there are children comments to display */}
      {comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-muted-foreground md:hover:text-primary active:text-primary flex items-center gap-1 text-sm"
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
                <Comment key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// This component maps over an array of top-level
export function Comments({ comments }: { comments: HNCommentItem[] }) {
  // Filter out any nulls just in case
  const validComments = comments.filter(
    (comment): comment is HNCommentItem => comment !== null,
  );

  return (
    <div className="space-y-8">
      {validComments.map((comment) => (
        // Render a Comment component for each top-level comment
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
