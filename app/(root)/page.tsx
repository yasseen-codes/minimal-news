// app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/top/1"); // Server-side redirect (no "use client" needed)
}
