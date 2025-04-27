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
      className="hover:text-foreground hover:bg-muted flex items-center gap-1 transition-colors" // Styling
    >
      <ArrowLeft size={16} /> {/* Left arrow icon */}
      Back
    </Button>
  );
}
