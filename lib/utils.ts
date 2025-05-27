import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(unixTime: number): string {
  const secondsAgo = Math.floor(Date.now() / 1000) - unixTime;

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Calculate all time units at once
  const values = {
    year: Math.floor(secondsAgo / intervals.year),
    month: Math.floor(secondsAgo / intervals.month),
    week: Math.floor(secondsAgo / intervals.week),
    day: Math.floor(secondsAgo / intervals.day),
    hour: Math.floor(secondsAgo / intervals.hour),
    minute: Math.floor(secondsAgo / intervals.minute),
  };

  // Find the most appropriate unit
  if (values.year >= 1) return `${values.year}y`;
  if (values.month >= 1) return `${values.month}mo`;
  if (values.week >= 1) return `${values.week}w`;
  if (values.day >= 1) return `${values.day}d`;
  if (values.hour >= 1) return `${values.hour}h`;
  if (values.minute >= 1) return `${values.minute}m`;

  return "now";
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
