// components/FavoriteButton.tsx

"use client"; // This component uses a Zustand hook and event handlers, so it must be a Client Component

import React from "react";
import { Button } from "./button"; // Assuming button component is in the same directory or adjust path
import { Bookmark, BookmarkPlus } from "lucide-react"; // Import bookmark icons
import { toast } from "sonner"; // Import toast from sonner

// *** VERIFY THESE IMPORT PATHS CAREFULLY ***
// Import the useShallow hook
import { useShallow } from "zustand/react/shallow";

// Import the Zustand favorite store hook and the FavoriteStore type
import { useFavoriteStore, FavoriteStore } from "@/stores/favorite-store"; // Adjust import path if needed

// Define the props for the FavoriteButton component
interface FavoriteButtonProps {
  storyId: number; // The ID of the story this button is associated with
}

// Define the type for the state slice selected by this component
// Ensure 'favoriteStoryIds' and 'toggleFavorite' match the names in your FavoriteStore type.
type FavoriteButtonStoreSlice = {
  favoriteStoryIds: FavoriteStore["favoriteStoryIds"]; // The Set of favorite IDs
  toggleFavorite: FavoriteStore["toggleFavorite"]; // The toggle action function
};

// The FavoriteButton component, connected to the Zustand store
export default function FavoriteButton({ storyId }: FavoriteButtonProps) {
  // --- Access state and actions from the Zustand store ---
  // We select the specific state (favoriteStoryIds) and action (toggleFavorite)
  // *** Use useShallow to wrap the selector function ***
  const { favoriteStoryIds, toggleFavorite } = useFavoriteStore(
    useShallow(
      (state): FavoriteButtonStoreSlice => ({
        // *** Wrap selector with useShallow and add type annotation ***
        favoriteStoryIds: state.favoriteStoryIds, // Select the set of favorited IDs
        toggleFavorite: state.toggleFavorite, // Select the toggle action
      }),
    ),
    // No second argument needed when using useShallow
  );

  // --- Determine if the current story is favorited based on the store state ---
  // Use the Set's has() method for efficient lookup
  const isFavorited = favoriteStoryIds.has(storyId);

  // --- Render the Button ---
  return (
    // Use the shadcn/ui Button component
    <Button
      variant="outline" // Use outline variant (or ghost if preferred)
      size="icon" // Use icon size for a small button
      // *** Update the onClick handler to use the Zustand action and Sonner ***
      onClick={() => {
        // Call the toggleFavorite action from the Zustand store
        toggleFavorite(storyId);

        // Determine the notification text based on the *new* state after the toggle
        // We can check if the state *before* the toggle to determine the text.
        const notificationText = isFavorited
          ? "Removed from favorites" // If it *was* favorited, it's now removed
          : "Added to favorites"; // If it *wasn't* favorited, it's now added

        // Show the Sonner toast notification using your workaround style
        toast.info(notificationText, {
          style: {
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          },
          duration: 2500, // Keep your duration
        });
      }}
      // *** Update aria-label to reflect the *current* state (what clicking will do) ***
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      // Keep your custom styling classes
      className="hover:bg-background dark:hover:bg-background mr-2 h-6 w-6 cursor-pointer"
    >
      {/* Conditionally render the filled or outline icon based on the store state */}
      {isFavorited ? (
        // Filled icon when favorited (state from Zustand)
        <Bookmark className="fill-primary text-primary h-full w-full" />
      ) : (
        // Outline icon when not favorited (state from Zustand)
        <BookmarkPlus className="text-muted-foreground h-full w-full" />
      )}
    </Button>
  );
}
