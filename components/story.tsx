// components/story.tsx

import Link from "next/link";
import { Clock, MessageCircleMore, CircleArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Define the meta items data
  const metaItems = [
    {
      id: "upvotes",
      icon: CircleArrowUp,
      value: upvotes,
    },
    {
      id: "comments",
      icon: MessageCircleMore,
      value: comments,
    },
    {
      id: "date",
      icon: Clock,
      value: date,
    },
  ];

  return (
    <article className="border-border hover:border-accent focus-visible:ring-ring relative w-full overflow-hidden border-b-2 py-4 transition-all duration-300 ease-in-out focus-within:px-1 focus:outline-none focus-visible:ring-2">
      <div className="flex flex-col">
        <Link href={`/story/${id}`}>
          <h3 className="text-foreground hover:text-primary block font-serif text-base font-medium text-pretty transition-colors duration-300 md:text-xl">
            {title}
          </h3>
        </Link>
        <div className="md:flex md:items-center md:justify-between">
          {url && hostname ? (
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground mt-1 inline-block font-mono text-sm text-pretty break-all hover:underline md:text-base"
            >
              ({hostname})
            </Link>
          ) : (
            <div />
          )}

          <div className="text-foreground mt-2 flex items-center gap-4 font-sans text-xs md:mt-0 md:text-sm">
            {metaItems.map((item) => {
              const Icon = item.icon; // Get the Lucide icon component

              return (
                <div key={item.id} className="flex items-center gap-1">
                  <Icon className="h-[14px] w-[14px] md:h-4 md:w-4" />
                  <span>{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
