// components/story.tsx
import Link from "next/link";
import { ArrowUp, MessageSquare, Clock, MoveUp, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StoryProps = {
  id: string;
  title: string;
  url?: string;
  upvotes: number;
  comments: number;
  date: string;
};

export function Story({ id, title, url, upvotes, comments, date }: StoryProps) {
  return (
    <article
      className={cn(
        "w-full rounded-lg border-2 p-4 transition-all duration-200",
        "hover:border-foreground hover:bg-secondary/40 hover:shadow-sm",
        "active:border-primary active:bg-secondary/60 active:scale-[0.98]",
        "focus:ring-primary/50 focus:ring-2 focus:outline-none",
        "dark:hover:bg-muted-foreground/20 dark:hover:border-primary",
        "dark:active:bg-muted-foreground/30 dark:active:border-foreground",
      )}
    >
      <div className="flex items-start gap-2">
        {/* Content */}
        <div className="flex-1">
          <Link href={"/"}>
            <h3 className="font-serif text-base font-medium text-pretty md:text-xl">
              {title}
            </h3>
          </Link>
          {url && (
            <Link href={url}>
              <span className="text-muted-foreground dark:hover:text-primary hover:text-primary border-foreground border-b-2 border-dotted font-mono text-xs break-all md:text-base">
                {new URL(url).hostname}
              </span>
            </Link>
          )}
          {/* Meta */}
          <div className="text-muted-foreground mt-3 flex items-center gap-4 font-sans text-xs md:text-sm">
            {/* Upvote Button */}
            <div className="flex items-center gap-1">
              <ChevronUp className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-muted-foreground">{upvotes}</span>
            </div>

            <div className="flex items-center gap-2">
              <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-muted-foreground">{comments}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-muted-foreground">{date}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
