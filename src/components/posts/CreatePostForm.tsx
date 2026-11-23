import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
      setMessage(`✅ Post #${post.id} created`);
      setTitle('');
      // the cached posts list is now old → mark it stale so it refetches
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts });
    },
    onError: (err) => setMessage(`❌ Failed: ${err.message}`),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) createPostMutation.mutate(title.trim());
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
      <p className="text-xs text-slate-500">
        jsonplaceholder does not really save → always returns id 101. Watch the POST in the Network tab.
      </p>
    </form>
  );
}
