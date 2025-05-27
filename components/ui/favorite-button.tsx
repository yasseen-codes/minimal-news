// components/favorite-button.tsx

"use client";

import React from "react";
import { Button } from "./button";
import { Bookmark, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

import { useShallow } from "zustand/react/shallow";

import { useFavoriteStore, FavoriteStore } from "@/stores/favorite-store";

interface FavoriteButtonProps {
  storyId: number;
}

// Define the type for the state slice selected by this component
// Ensure 'favoriteStoryIds' and 'toggleFavorite' match the names in your FavoriteStore type.
type FavoriteButtonStoreSlice = {
  favoriteStoryIds: FavoriteStore["favoriteStoryIds"]; // The Set of favorite IDs
  toggleFavorite: FavoriteStore["toggleFavorite"]; // The toggle action function
};

// The FavoriteButton component, connected to the Zustand store
export default function FavoriteButton({ storyId }: FavoriteButtonProps) {
  const { favoriteStoryIds, toggleFavorite } = useFavoriteStore(
    // Use Zustand's useStore with a shallow selector to avoid unnecessary re-renders
    useShallow(
      (state): FavoriteButtonStoreSlice => ({
        // *** Wrap selector with useShallow and add type annotation ***
        favoriteStoryIds: state.favoriteStoryIds, // Select the set of favorited IDs
        toggleFavorite: state.toggleFavorite, // Select the toggle action
      }),
    ),
  );

  // Use the Set's has() method for efficient lookup
  const isFavorited = favoriteStoryIds.has(storyId);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        toggleFavorite(storyId);

        // Determine the notification text based on the *new* state after the toggle
        // We can check if the state *before* the toggle to determine the text.
        const notificationText = isFavorited
          ? "Removed from favorites" // If it *was* favorited, it's now removed
          : "Added to favorites"; // If it *wasn't* favorited, it's now added

        // Show the Sonner toast
        toast.info(notificationText, {
          style: {
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          },
          duration: 2500,
        });
      }}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className="hover:bg-background dark:hover:bg-background mr-2 h-6 w-6 cursor-pointer"
    >
      {isFavorited ? (
        <Bookmark className="fill-primary text-primary h-full w-full" />
      ) : (
        <BookmarkPlus className="text-muted-foreground h-full w-full" />
      )}
    </Button>
  );
}
