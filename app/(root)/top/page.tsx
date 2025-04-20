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

export default function Page() {
  const stories = [
    {
      id: "1",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    {
      id: "2",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    {
      id: "3",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    {
      id: "4",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    {
      id: "5",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    {
      id: "6",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    {
      id: "7",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    {
      id: "8",
      title: "Introducing the new Next.js compiler",
      url: "https://nextjs.org/blog/next-13",
      upvotes: 423,
      comments: 127,
      date: "3h",
    },
    // ... more stories
  ];

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 5;
  const totalPages = Math.ceil(stories.length / perPage);

  // 🚨 If invalid page number — go to NotFound
  if (page < 1 || page > totalPages) {
    notFound();
  }

  const paginatedStories = stories.slice((page - 1) * perPage, page * perPage);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="flex flex-col gap-10">
      <ul className="flex max-w-full flex-col items-center gap-5 rounded-md">
        {paginatedStories.map((story) => (
          <li key={story.id} className="w-full">
            <Story {...story} />
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
