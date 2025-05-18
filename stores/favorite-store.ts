// stores/favoriteStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the shape of the state in our store
interface FavoriteState {
  // Using a Set is efficient for storing unique IDs and checking for existence
  favoriteStoryIds: Set<number>;
}

// Define the shape of the actions that can modify the state
interface FavoriteActions {
  addFavorite: (storyId: number) => void;

  removeFavorite: (storyId: number) => void;

  toggleFavorite: (storyId: number) => void;
}

// Combine the state and actions types for the store
type FavoriteStore = FavoriteState & FavoriteActions;

// Create the Zustand store
export const useFavoriteStore = create<FavoriteStore>()(
  // Wrap the store creator with the persist middleware
  persist(
    // The state creator function: takes `set` and `get` functions
    // we only need `set` to update the state
    // `get` is not used here but can be useful for accessing the current state
    (set) => ({
      // --- Initial State ---
      // Initialize the state with an empty Set of favorited IDs
      favoriteStoryIds: new Set(),

      // --- Actions ---
      // Action to add a favorite
      addFavorite: (storyId: number) =>
        set((state) => {
          // Create a NEW Set based on the current state
          // We do this because directly modifying the existing Set (state.favoriteStoryIds.add(storyId))
          // would not create a new reference, and React/Zustand might not detect the change,
          // leading to components not re-rendering.
          const newFavorites = new Set(state.favoriteStoryIds);
          newFavorites.add(storyId);

          return { favoriteStoryIds: newFavorites };
        }),

      // Action to remove a favorite
      removeFavorite: (storyId: number) =>
        set((state) => {
          const newFavorites = new Set(state.favoriteStoryIds);
          newFavorites.delete(storyId);

          return { favoriteStoryIds: newFavorites };
        }),

      // Action to toggle a favorite
      toggleFavorite: (storyId: number) =>
        set((state) => {
          const newFavorites = new Set(state.favoriteStoryIds);
          if (newFavorites.has(storyId)) {
            // If already favorited, remove it
            newFavorites.delete(storyId);
          } else {
            // If not favorited, add it
            newFavorites.add(storyId);
          }

          return { favoriteStoryIds: newFavorites };
        }),
    }),
    // --- Persist Middleware Configuration ---
    {
      name: "favorites-storage", // Unique name for the localStorage key
      // Use a custom storage object to handle Set serialization/deserialization
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (value) {
            // Parse the stored JSON string
            const parsed = JSON.parse(value);
            // Check if the parsed structure is as expected (e.g., has a 'state' property)
            if (
              parsed &&
              parsed.state &&
              Array.isArray(parsed.state.favoriteStoryIds)
            ) {
              // Convert the array back to a Set on rehydration
              return {
                state: {
                  favoriteStoryIds: new Set(parsed.state.favoriteStoryIds),
                },
              };
            }
            // If the stored data structure is unexpected, return null to use initial state
            console.warn(
              "Zustand persist: Unexpected data structure in localStorage for favorites.",
            );
            return null;
          }
          // If no data is found in localStorage, return null to use initial state
          return null;
        },
        setItem: (name, value) => {
          // Convert the Set to an array before serializing
          const stateToPersist = {
            state: {
              favoriteStoryIds: Array.from(value.state.favoriteStoryIds),
            },
          };
          localStorage.setItem(name, JSON.stringify(stateToPersist));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      // Optional: versioning for migrations if your state shape changes later
      // version: 1,
      // migrate: (persistedState, version) => { ... }
    },
  ),
);

// Helper selector to check if a story is favorited outside of components if needed,
// or directly use useFavoriteStore in components.
export const isStoryFavorited = (storyId: number) =>
  useFavoriteStore.getState().favoriteStoryIds.has(storyId);
