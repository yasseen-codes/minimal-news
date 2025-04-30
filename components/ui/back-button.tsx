// components/BackButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className="md:hover:text-foreground md:hover:bg-muted active:bg-muted active:text-foreground dark:active:bg-card-foreground/15 flex items-center gap-1 transition-colors"
    >
      <ArrowLeft size={16} />
      Back
    </Button>
  );
}
