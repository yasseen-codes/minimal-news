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
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years}y`;
  if (months > 12) return `${Math.floor(months / 12)}y`;

  if (months > 0) return `${months}mo`;
  if (days > 30) return `${Math.floor(days / 30)}mo`;

  if (weeks > 0) return `${weeks}w`;
  if (days > 7) return `${Math.floor(days / 7)}w`;

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return "just now";
}

export function formatTimeISO(unixTime: number): string {
  return new Date(unixTime * 1000).toISOString();
}

export function formatCommentCount(count: number): string {
  if (count === 0) {
    return "0 comments";
  } else if (count === 1) {
    return "1 comment";
  } else {
    return `${count} comments`;
  }
}
