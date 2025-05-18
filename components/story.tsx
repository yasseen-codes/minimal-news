// components/story.tsx

import Link from "next/link";
import { Clock, MessageCircleMore, CircleArrowUp } from "lucide-react";
import FavoriteButton from "./ui/favorite-button";

type StoryProps = {
  id: number;
  title: string;
  url?: string;
  upvotes: number;
  comments: number;
  date: string;
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
    <article className="border-border md:hover:border-accent focus-visible:ring-ring active:border-accent relative w-full border-b py-4 overflow-ellipsis transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <Link href={`/story/${id}`}>
            <h3 className="text-foreground md:hover:text-primary active:text-primary block font-serif text-lg font-medium text-pretty transition-colors duration-300 md:text-xl">
              {title}
            </h3>
          </Link>
          <div className="hidden md:block">
            <FavoriteButton storyId={id} />
          </div>
        </div>
        <div className="md:flex md:items-center md:justify-between">
          {url && hostname ? (
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground mt-2 inline-block font-mono text-sm text-pretty break-all active:underline md:text-base md:hover:underline"
            >
              ({hostname})
            </Link>
          ) : (
            <div />
          )}
          <div className="mt-4 flex flex-row items-center justify-between">
            <div className="text-foreground flex items-center gap-4 pr-0 font-sans text-xs md:pr-2 md:text-sm">
              {metaItems.map((item) => {
                const Icon = item.icon; // Get the Lucide icon component

                return (
                  <div
                    key={item.id}
                    className="text-muted-foreground flex items-center gap-1"
                  >
                    <Icon className="h-[14px] w-[14px] md:h-4 md:w-4" />
                    <span>{item.value}</span>
                  </div>
                );
              })}
            </div>
            <div className="md:hidden">
              <FavoriteButton storyId={id} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
