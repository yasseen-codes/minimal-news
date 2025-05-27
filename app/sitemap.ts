// app/sitemap.xml.ts

import { SITE_URL } from "@/types/hn";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // For a news reader, you might want to list popular stories,
  // but fetching ALL story IDs to list every single story might be too much.
  // We'll start by listing the main index pages and a few paginated pages.

  const pageNumbers: number[] = [1, 2];

  // Map over the generated page numbers to create sitemap entries for 'top' stories
  const topStoriesPages: MetadataRoute.Sitemap = pageNumbers.map((page) => ({
    url: `${SITE_URL}/top/${page}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: page === 1 ? 0.9 : 0.8,
  }));

  // Map over the generated page numbers to create sitemap entries for 'new' stories
  const newStoriesPages: MetadataRoute.Sitemap = pageNumbers.map((page) => ({
    url: `${SITE_URL}/new/${page}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: page === 1 ? 0.9 : 0.8,
  }));

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },

    ...topStoriesPages,
    ...newStoriesPages,
    {
      url: `${SITE_URL}/ask/1`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/show/1`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/favorites/1`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  return sitemapEntries;
}
