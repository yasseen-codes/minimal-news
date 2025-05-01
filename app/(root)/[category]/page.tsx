// app/(root)/[category]/page.tsx

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { routeValue } from "@/types/api";

const validRoutes: routeValue[] = ["top", "new", "ask", "show"];

// This page component handles requests to /top, /new, /ask, /show (without a page number)
export default async function Page({
  params,
}: {
  params: Promise<{ category: routeValue }>;
}) {
  const category = (await params).category;

  // Although the [category]/[page] route also validates, this ensures
  // that a direct hit on the base category path is also validated.
  if (!validRoutes.includes(category)) {
    notFound();
  }

  // If the category is valid, redirect to the first page of that category
  // This is a standard practice for base category URLs.
  redirect(`/${category}/1`);
}
