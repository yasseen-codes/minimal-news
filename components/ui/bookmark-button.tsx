"use client";

import React from "react";
import { Button } from "./button";
import { Bookmark, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

function BookmarkButton() {
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const bookmarkNotificationText = isBookmarked
    ? "Removed from bookmarks"
    : "Added to bookmarks";

  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsBookmarked(!isBookmarked);
        toast.info(bookmarkNotificationText, {
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          },
          duration: 2000,
        });
      }}
      aria-label={bookmarkNotificationText}
      className="hover:bg-background dark:hover:bg-background mr-2 h-6 w-6 cursor-pointer"
    >
      {isBookmarked ? (
        <Bookmark className="fill-primary text-primary h-full w-full" />
      ) : (
        <BookmarkPlus className="text-muted-foreground h-full w-full" />
      )}
    </Button>
  );
}

export default BookmarkButton;
