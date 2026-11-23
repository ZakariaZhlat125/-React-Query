import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPost } from '../../lib/api/posts';
import { QUERY_KEYS } from '../../lib/queryKeys';
import PageLoader from '../PageLoader';

// Worksheet Task 2: choose a post id → load it. `enabled` stops the query while nothing is chosen.
export default function PostViewer() {
  const [id, setId] = useState<number | null>(null);

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.post(id), // ['post', id] → each post is cached separately
    queryFn: () => fetchPost(id!),
    enabled: id !== null, // don't fetch until an id is chosen
  });

  return (
    <div className="space-y-4">
      <select
        value={id ?? ''}
        onChange={(e) => setId(e.target.value ? Number(e.target.value) : null)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Choose a post</option>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            Post {n}
          </option>
        ))}
      </select>

      <p className="text-xs text-slate-500">
        Tip: open post 1, then 2, then 1 again → the 3rd time is instant (served from the cache).
      </p>

      {isLoading && <PageLoader />}
      {isError && <p className="text-red-600">Error: {error.message}</p>}
      {post && (
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold capitalize">{post.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{post.body}</p>
        </article>
      )}
    </div>
  );
}
