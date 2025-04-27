"use client";
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
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { routeValue } from "@/types/api";

const routeMap = {
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
};

function getCurrentRoute(pathname: string): routeValue {
  const route = pathname.split("/")[1] as routeValue;
  return route in routeMap ? route : "top";
}

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const currentRoute = getCurrentRoute(pathname);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      const route = Object.entries(routeMap).find(
        ([, { shortcut }]) => shortcut === key, // The '_' here is unused
      )?.[0] as routeValue | undefined;

      if (route) {
        e.preventDefault();
        router.push(routeMap[route].path);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <nav className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className="hover:bg-muted hover:text-foreground flex items-center justify-between gap-2 text-sm hover:cursor-pointer md:text-base"
          >
            <div className="flex items-center gap-2">
              <span className="hidden md:block">
                {routeMap[currentRoute].icon}
              </span>

              <span className="font-sans font-medium">
                {routeMap[currentRoute].label}
              </span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="animate-in fade-in-80 zoom-in-95 w-56 p-1"
          align="start"
          sideOffset={8}
        >
          {Object.entries(routeMap).map(
            ([value, { path, icon, label, shortcut }]) => (
              <DropdownMenuItem
                key={value}
                onClick={() => router.push(path)}
                className={cn(
                  "focus:bg-secondary/50 focus:text-foreground my-1 flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 font-sans text-sm",
                  currentRoute === value ? "bg-secondary" : "",
                )}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="text-foreground rounded px-2 py-1 font-mono text-xs">
                    {shortcut.toUpperCase()}
                  </kbd>
                </div>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
