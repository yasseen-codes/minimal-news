// components/query-provider.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Create a QueryClient instance inside the component, but using useState
// to ensure it's only created once per component instance on the client.
// This avoids recreating the client on every render.
function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use useState to create and hold the QueryClient instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    // Wrap the children with the QueryClientProvider
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;
