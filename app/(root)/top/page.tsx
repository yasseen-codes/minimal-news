"use client";

import {
  useSearchParams,
  usePathname,
  useRouter,
  notFound,
} from "next/navigation";
import { Story } from "@/components/story";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { formatTimeAgo } from "@/lib/utils";

const PER_PAGE = 30;

type HNStory = {
  id: number;
  title: string;
  url: string;
  score: number;
  descendants: number;
  time: number;
  by: string;
};

type ApiResponse = {
  page: number;
  totalPages: number;
  stories: HNStory[];
};

async function fetchStories(page: number): Promise<ApiResponse | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/top?page=${page}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function Page() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");

  const apiResponse = await fetchStories(page);

  if (!apiResponse) {
    notFound();
  }

  const { stories, totalPages } = apiResponse;

  // 🚨 If invalid page number — go to NotFound
  if (page < 1 || page > totalPages) {
    notFound();
  }

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="flex flex-col gap-10">
      <ul className="flex max-w-full flex-col items-center gap-5 rounded-md">
        {stories.map((story) => (
          <li key={story.id} className="w-full">
            <Story
              id={story.id.toString()}
              title={story.title}
              url={
                story.url || `https://news.ycombinator.com/item?id=${story.id}`
              }
              upvotes={story.score}
              comments={story.descendants}
              date={formatTimeAgo(story.time)}
            />
          </li>
        ))}
      </ul>

      <Pagination>
        <PaginationContent className="mt-6 gap-3">
          <PaginationItem>
            <PaginationLink
              onClick={() => page !== 1 && goToPage(page - 1)}
              aria-disabled={page === 1}
              className={`cursor-pointer rounded-md border px-10 py-1 text-sm ${page === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-muted"}`}
            >
              Previous
            </PaginationLink>
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={page === index + 1}
                onClick={() => goToPage(index + 1)}
                className={`cursor-pointer rounded-md border px-3 py-1 text-sm ${
                  page === index + 1
                    ? "bg-primary dark:bg-primary text-muted dark:hover:bg-primary/40"
                    : ""
                }`}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationLink
              onClick={() => page !== totalPages && goToPage(page + 1)}
              aria-disabled={page === totalPages}
              className={`cursor-pointer rounded-md border px-10 py-1 text-sm ${page === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-muted"}`}
            >
              Next
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
