import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPostsPage } from '../../lib/api/posts';
import { QUERY_KEYS } from '../../lib/queryKeys';
import PageLoader from '../PageLoader';

const LAST_PAGE = 20; // 100 posts / 5 per page

// Challenge: pagination. When `page` changes, the key changes → React Query fetches automatically.
// No useEffect needed!
export default function PagedPosts() {
  const [page, setPage] = useState(1);

  const { data: posts, isLoading, isFetching, isPlaceholderData } = useQuery({
    queryKey: QUERY_KEYS.postsPage(page),
    queryFn: () => fetchPostsPage(page),
    placeholderData: keepPreviousData, // keep showing the old page while the next one loads
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-3">
      <ul
        className={`divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white transition-opacity ${
          isPlaceholderData ? 'opacity-50' : ''
        }`}
      >
        {posts?.map((p) => (
          <li key={p.id} className="px-4 py-2.5 text-sm">
            <span className="mr-2 text-slate-400">{p.id}.</span>
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
          disabled={page === LAST_PAGE}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
