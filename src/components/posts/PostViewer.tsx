import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPost, fetchPosts } from '../../lib/api/posts';
import { QUERY_KEYS } from '../../lib/queryKeys';
import PageLoader from '../PageLoader';

// Worksheet Task 2: choose a post id → load it. `enabled` stops the query while nothing is chosen.
export default function PostViewer() {
  const [id, setId] = useState('');
  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useQuery({
    queryKey: QUERY_KEYS.posts,
    queryFn: () => fetchPosts(),
  });

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.post(id),
    queryFn: () => fetchPost(id),
    enabled: id !== '',
  });

  return (
    <div className="space-y-4">
      <select
        value={id}
        onChange={(e) => setId(e.target.value)}
        disabled={isLoadingPosts}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">{isLoadingPosts ? 'Loading posts...' : 'Choose a post'}</option>
        {posts?.map((item) => (
          <option key={item._id} value={item._id}>
            {item.title}
          </option>
        ))}
      </select>

      {postsError && <p className="text-red-600">{postsError.message}</p>}
      {isLoading && <PageLoader />}
      {isError && <p className="text-red-600">Error: {error.message}</p>}
      {post && (
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold capitalize">{post.title}</h3>
          {post.author && <p className="mt-2 text-sm text-slate-600">By {post.author.name}</p>}
          {post.tags.length > 0 && <p className="mt-2 text-sm text-slate-600">{post.tags.join(', ')}</p>}
        </article>
      )}
    </div>
  );
}
