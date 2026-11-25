import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../../lib/api/posts';
import { QUERY_KEYS } from '../../lib/queryKeys';
import ErrorFallback from '../ErrorFallback';
import PageLoader from '../PageLoader';

// Worksheet Task 1: first 10 posts + loading/error + Refresh + "Refreshing..."
export default function PostsList() {
  const { data: posts, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.posts,
    queryFn: () => fetchPosts(10),
  });

  if (isLoading) return <PageLoader />; // first load only (no cached data yet)
  if (isError) return <ErrorFallback error={error} onRetry={refetch} />;

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Refresh
        </button>
        {/* isFetching = ANY fetch, including background refetches */}
        {isFetching && <span className="text-sm text-slate-500">Refreshing...</span>}
      </div>
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {posts?.map((p) => (
          <li key={p._id} className="px-4 py-2.5 text-sm">
            {p.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
