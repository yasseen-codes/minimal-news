import { NextRequest, NextResponse } from "next/server";

// Get top 300 story IDs
const TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const STORY_URL = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

const PER_PAGE = 30;
const MAX_STORIES = 300;

export async function GET(req: NextRequest) {
  const pageParam = req.nextUrl.searchParams.get("page") || "1";
  const page = parseInt(pageParam);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 404 });
  }

  try {
    const topStoriesRes = await fetch(TOP_STORIES_URL);
    const topStoryIds: number[] = await topStoriesRes.json();

    const selectedIds = topStoryIds.slice(0, MAX_STORIES);
    const totalPages = Math.ceil(MAX_STORIES / PER_PAGE);

    if (page > totalPages) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageIds = selectedIds.slice(start, end);

    // Fetch story details in parallel
    const stories = await Promise.all(
      pageIds.map(async (id) => {
        const res = await fetch(STORY_URL(id));
        return res.json();
      }),
    );

    return NextResponse.json({
      page,
      totalPages,
      stories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 },
    );
  }
}
