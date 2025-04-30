"use client";

import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  // This is important to avoid hydration errors when using next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="bg-muted relative h-9 w-9 overflow-hidden rounded-md"
        aria-hidden="true"
      />
    );
  }

  return (
    <Toggle
      variant="outline"
      className="group md:data-[state=on]:hover:bg-muted data-[state=on]:bg-card active:bg-muted dark:data-[state=on]:active:bg-card-foreground/15 size-9 shadow-xs transition-colors hover:cursor-pointer"
      pressed={resolvedTheme === "dark"}
      onPressedChange={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
      aria-label={`Switch to ${
        resolvedTheme === "dark" ? "light" : "dark"
      } mode`}
    >
      <Moon
        size={16}
        strokeWidth={2}
        className="text-foreground shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
        aria-hidden="true"
      />
      <Sun
        size={16}
        strokeWidth={2}
        className="text-foreground absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
        aria-hidden="true"
      />
    </Toggle>
  );
}

export { ThemeToggle };
