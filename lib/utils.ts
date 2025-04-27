import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(unixTime: number): string {
  const secondsAgo = Math.floor(Date.now() / 1000) - unixTime;

  const minutes = Math.floor(secondsAgo / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return "just now";
}

export function formatCommentCount(count: number): string {
  if (count === 0) {
    return "0 comments"; // Or 'Discuss', depending on preference
  } else if (count === 1) {
    return "1 comment";
  } else {
    return `${count} comments`;
  }
}
