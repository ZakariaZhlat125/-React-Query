import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPostsPage } from '../../lib/api/posts';
import { QUERY_KEYS } from '../../lib/queryKeys';
import ErrorFallback from '../ErrorFallback';
import PageLoader from '../PageLoader';

// Challenge: pagination. When `page` changes, the key changes → React Query fetches automatically.
// No useEffect needed!
export default function PagedPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.postsPage(page),
    queryFn: () => fetchPostsPage(page),
    placeholderData: keepPreviousData, // keep showing the old page while the next one loads
  });

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorFallback error={error} onRetry={refetch} />;

  return (
    <div className="space-y-3">
      <ul
        className={`divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white transition-opacity ${
          isPlaceholderData ? 'opacity-50' : ''
        }`}
      >
        {data?.data.map((p) => (
          <li key={p._id} className="px-4 py-2.5 text-sm">
            {p.title}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} {isFetching && '⏳'}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={isPlaceholderData || page >= (data?.meta.totalPages ?? 0)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
