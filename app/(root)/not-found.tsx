// app/not-found.tsx

import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  // prevent indexing if desired:
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="mb-4 text-4xl font-bold">Not Found</h2>
      <p className="text-muted-foreground mb-6 text-lg">
        Could not find the requested resource.
      </p>
      <Link href="/top/1" className="text-primary hover:underline">
        Return Home
      </Link>
    </div>
  );
}
