// app/top/page.tsx
import { Story } from "@/components/story";

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

  return (
    <ul className="flex max-w-full flex-col items-center gap-5 rounded-md">
      {stories.map((story) => (
        <li key={story.id} className="w-full">
          <Story {...story} />
        </li>
      ))}
    </ul>
  );
}
