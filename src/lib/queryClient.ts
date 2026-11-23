import { QueryClient } from '@tanstack/react-query';

// One QueryClient for the whole app = one shared cache.
// These defaults apply to every useQuery unless a query overrides them.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000, // data is "fresh" for 5 min → no refetch during that time
      gcTime: 10 * 60_000, // unused cache entries are removed after 10 min
      retry: 1, // retry a failed request once
      refetchOnWindowFocus: false,
    },
  },
});
