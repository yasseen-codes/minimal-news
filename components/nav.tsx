// components/CategoryNav.tsx
"use client"; // This component uses usePathname and useRouter, so it must be a Client Component

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  Eye,
  Clock,
  MessageCircleQuestion,
  ChevronDown,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { routeValue } from "@/types/api"; // Assuming routeValue is defined here

// Define the routes and their details
const routeMap: {
  [key in routeValue]: {
    path: string;
    icon: React.ReactNode; // Use React.ReactNode for icons
    label: string;
    shortcut: string;
  };
} = {
  top: {
    path: "/top/1",
    icon: <TrendingUp className="text-foreground h-4 w-4" />,
    label: "Top",
    shortcut: "t",
  },
  show: {
    path: "/show/1",
    icon: <Eye className="text-foreground h-4 w-4" />,
    label: "Show",
    shortcut: "s",
  },
  new: {
    path: "/new/1",
    icon: <Clock className="text-foreground h-4 w-4" />,
    label: "New",
    shortcut: "n",
  },
  ask: {
    path: "/ask/1",
    icon: <MessageCircleQuestion className="text-foreground h-4 w-4" />,
    label: "Ask",
    shortcut: "a",
  },
  favorites: {
    path: "/favorites/1",
    icon: <Bookmark className="text-foreground h-4 w-4" />,
    label: "Favs",
    shortcut: "f",
  },
};

// Define valid route keys from the routeMap
const validRouteKeys = Object.keys(routeMap) as routeValue[];

function getCurrentRouteType(pathname: string): routeValue | "details" | "404" {
  // Split the pathname into segments, filtering out empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "");

  const firstSegment = segments[0];

  if (firstSegment === "story" && segments.length > 1) {
    // If the first segment is 'story' and there's a second segment (the ID), it's a story page
    return "details";
  }

  // Check if the first segment is a valid route key from our routeMap
  if (validRouteKeys.includes(firstSegment as routeValue)) {
    return firstSegment as routeValue;
  }

  return "404";
}

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const currentRouteType = getCurrentRouteType(pathname);

  // Determine the label and icon to display based on currentRouteType
  let displayLabel: string;
  let displayIcon: React.ReactNode | null = null; // Icon might be null for non-route pages

  if (currentRouteType === "details") {
    displayLabel = "details";

    displayIcon = null;
  } else if (currentRouteType === "404") {
    displayLabel = "404";

    displayIcon = null;
  } else {
    // It's a valid category route, get details from routeMap
    displayLabel = routeMap[currentRouteType].label;
    displayIcon = routeMap[currentRouteType].icon;
  }

  // Keyboard shortcuts (only apply to the defined routes in routeMap)
  useEffect(() => {
    function handleKeyDown(kbdEvent: KeyboardEvent) {
      // Ignore if any modifier keys are pressed or if an input/textarea is focused
      if (
        kbdEvent.ctrlKey ||
        kbdEvent.metaKey ||
        kbdEvent.altKey ||
        kbdEvent.shiftKey
      )
        return;

      // Check if the active element is an input field or textarea
      const target = kbdEvent.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return; // Ignore keyboard shortcuts when typing in input fields
      }

      const key = kbdEvent.key.toLowerCase();
      // Check if the key pressed matches a route shortcut from the validRouteKeys
      const route = validRouteKeys.find(
        (routeKey) => routeMap[routeKey].shortcut === key,
      );

      // If the key pressed matches a route shortcut, navigate to that route
      if (route) {
        kbdEvent.preventDefault(); // Prevent default browser behavior (like 't' opening a new tab)
        router.push(routeMap[route].path);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <nav className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* The Button displays the current page type */}
          <Button
            variant="outline"
            size="default"
            className={cn(
              "hover:bg-muted hover:text-foreground flex items-center gap-2 text-sm hover:cursor-pointer md:text-base",
              // Add a class to disable pointer events if not on a valid route page
            )}
            // Disable the button if not on a valid route page
            disabled={
              currentRouteType === "details" || currentRouteType === "404"
            }
            // to prevent focus on click
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Icon and label for the current route type */}
            <div className="flex items-center gap-2">
              {displayIcon && (
                <span className="sr-only md:not-sr-only">{displayIcon}</span>
              )}
              <span className="font-sans font-medium">{displayLabel}</span>
            </div>
            {/* Only show the ChevronDown icon if it's a valid route page (dropdown is active) */}
            {currentRouteType !== "details" && currentRouteType !== "404" && (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        {/* Only render the DropdownMenuContent if it's a valid route page */}
        {currentRouteType !== "details" && currentRouteType !== "404" && (
          <DropdownMenuContent
            className="animate-in fade-in-80 zoom-in-95 mr-2 w-56 p-1"
            align="start"
            sideOffset={8}
          >
            {/* Map through the routeMap to create menu items */}
            {Object.entries(routeMap).map(
              ([value, { path, icon, label, shortcut }]) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => router.push(path)}
                  className={cn(
                    "focus:bg-accent/50 focus:text-foreground my-1 flex w-full cursor-pointer items-center justify-between px-2 py-1.5 font-sans text-sm",

                    currentRouteType === value
                      ? "bg-accent dark:bg-accent/83"
                      : "",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Display the keyboard shortcut */}
                    <kbd className="text-foreground rounded px-2 py-1 font-mono text-xs">
                      {shortcut.toUpperCase()}
                    </kbd>
                  </div>
                </DropdownMenuItem>
              ),
            )}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </nav>
  );
}
