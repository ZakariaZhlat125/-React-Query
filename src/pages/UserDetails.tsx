import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import ErrorFallback from '../components/ErrorFallback';
import PageLoader from '../components/PageLoader';
import { fetchUser, updateUser } from '../lib/api/users';
import { hasPermission } from '../lib/permissions';
import { QUERY_KEYS } from '../lib/queryKeys';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

export default function UserDetails() {
  const { id } = useParams();
  const userId = Number(id);
  const authUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');

  // The id is IN the key → user 1 and user 2 are cached separately. (Worksheet → Bug 1)
  const { data: user, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.user(userId),
    queryFn: () => fetchUser(userId),
    enabled: Number.isInteger(userId) && userId > 0,
  });

  const updateMutation = useMutation({
    mutationFn: updateUser, // PUT /users/:id
    onSuccess: (updated) => {
      // Write the server's answer straight into the cache (no extra GET needed)
      queryClient.setQueryData<User>(QUERY_KEYS.user(userId), (old) => (old ? { ...old, ...updated } : old));
      setNewName('');
    },
  });

  if (isLoading) return <PageLoader label="Loading user..." />;
  if (isError) return <ErrorFallback error={error} onRetry={refetch} />;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="space-y-4">
      <Link to="/users" className="text-sm text-indigo-600 hover:underline">
        ← Back to users
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-slate-500">@{user.username}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Phone</dt>
            <dd>{user.phone}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Company</dt>
            <dd>{user.company.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Website</dt>
            <dd>{user.website}</dd>
          </div>
        </dl>
      </div>

      {hasPermission(authUser, 'users.write') && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newName.trim()) updateMutation.mutate({ id: userId, data: { name: newName.trim() } });
          }}
          className="flex gap-2 rounded-xl border border-slate-200 bg-white p-4"
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New name"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Update name'}
          </button>
        </form>
      )}
    </div>
  );
}
