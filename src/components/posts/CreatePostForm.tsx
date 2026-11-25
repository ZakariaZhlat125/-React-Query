import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { createPost } from '../../lib/api/posts';
import { QUERY_KEYS } from '../../lib/queryKeys';

// Worksheet Task 3: useMutation + pending button + success message + invalidate ['posts']
export default function CreatePostForm() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      setMessage(`✅ Post "${post.title}" created`);
      setTitle('');
      // the cached posts list is now old → mark it stale so it refetches
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts });
    },
    onError: (err) => {
      const details = isAxiosError<{ errors?: unknown; message?: string }>(err)
        ? err.response?.data
        : undefined;
      const errors = Array.isArray(details?.errors)
        ? details.errors.filter((error) => typeof error === 'string')
        : [];
      setMessage(`❌ Failed: ${errors.join(' ') || details?.message || err.message}`);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setMessage('Enter a post title.');
      return;
    }
    createPostMutation.mutate(trimmedTitle);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={createPostMutation.isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {createPostMutation.isPending ? 'Saving...' : 'Create'}
        </button>
      </div>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
