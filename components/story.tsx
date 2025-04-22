// components/story.tsx

import Link from "next/link";
import { MessageSquare, Clock, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Import shadcn/ui Card components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter, // CardFooter can be useful for meta info
} from "@/components/ui/card";

type StoryProps = {
  id: string;
  title: string;
  url?: string;
  upvotes: number;
  comments: number;
  date: string; // Assuming this is already formatted time ago string
};

export function Story({ id, title, url, upvotes, comments, date }: StoryProps) {
  // Determine the hostname for displaying next to the URL
  const hostname = url ? new URL(url).hostname : null;

  return (
    // Wrap the entire story item in a Card
    <Card
      className={cn(
        "w-full rounded-lg border-2 transition-all duration-200",
        "hover:border-foreground hover:bg-secondary/40 hover:shadow-sm",
        "active:border-primary active:bg-secondary/60 active:scale-[0.98]",
        "focus:ring-primary/50 focus:ring-2 focus:outline-none",
        "dark:hover:bg-muted-foreground/20 dark:hover:border-primary",
        "dark:active:bg-muted-foreground/30 dark:active:border-foreground",
        // Add padding to the card itself instead of the article tag
        "px-6 py-4",
      )}
    >
      {/* CardHeader for the title and external URL */}
      <CardHeader className="p-0">
        {" "}
        {/* Adjust padding as needed */}
        {/* Link the title to the story details page */}
        <Link href={`/story/${id}`}>
          <CardTitle className="mb-1 font-serif text-base font-medium text-pretty hover:underline md:text-xl">
            {title}
          </CardTitle>
        </Link>
        {/* Display the hostname if URL exists */}
        {url && hostname && (
          <Link href={url} target="_blank" rel="noopener noreferrer">
            <CardDescription className="text-muted-foreground dark:hover:text-primary hover:text-primary border-foreground max-w-fit border-b-2 border-dotted font-mono text-xs break-all md:text-sm">
              ({hostname}) {/* Display hostname in parentheses */}
            </CardDescription>
          </Link>
        )}
      </CardHeader>

      {/* CardContent can be used for main content if any, but for list view, meta fits better in footer */}
      {/* <CardContent className="p-0">
          // Story text content would go here if displayed in list view
      </CardContent> */}

      {/* CardFooter for meta information (upvotes, comments, time) */}
      <CardFooter className="text-muted-foreground flex items-center gap-4 p-0 font-sans text-xs md:text-sm">
        {" "}
        {/* Adjust padding as needed */}
        {/* Upvote count (assuming no upvote functionality here) */}
        <div className="flex items-center gap-1">
          <ChevronUp className="h-4 w-4 md:h-5 md:w-5" />{" "}
          {/* Using ChevronUp as in original */}
          <span>{upvotes}</span>
        </div>
        {/* Link to comments on the story details page */}
        <Link
          href={`/story/${id}#comments`}
          className="flex items-center gap-2 hover:underline"
        >
          {" "}
          {/* Added link to comments section */}
          <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
          <span>{comments}</span>
        </Link>
        {/* Time ago */}
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 md:h-4 md:w-4" />
          <span>{date}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
