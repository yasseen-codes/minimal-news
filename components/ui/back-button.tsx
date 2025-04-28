// components/BackButton.tsx

"use client"; // This is a Client Component

import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button"; // Use shadcn/ui Button
import { ArrowLeft } from "lucide-react"; // Import the left arrow icon

export function BackButton() {
  const router = useRouter(); // Get the router instance

  return (
    // Use a shadcn/ui Button styled as a ghost button
    <Button
      variant="outline" // Ghost variant for a subtle look
      onClick={() => router.back()} // Call router.back() on click
      className="md:hover:text-foreground md:hover:bg-muted active:bg-muted active:text-foreground dark:active:bg-card-foreground/15 flex items-center gap-1 transition-colors" // Styling
    >
      <ArrowLeft size={16} /> {/* Left arrow icon */}
      Back
    </Button>
  );
}
