import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import CreateUserForm from '../components/users/CreateUserForm';
import DeleteUserButton from '../components/users/DeleteUserButton';
import ErrorFallback from '../components/ErrorFallback';
import PageLoader from '../components/PageLoader';
import { deleteUser, fetchUsers } from '../lib/api/users';
import { hasPermission } from '../lib/permissions';
import { QUERY_KEYS } from '../lib/queryKeys';
import { useAuthStore } from '../store/authStore';

// Page pattern: useQuery to read + useMutation to change + invalidateQueries after success
export default function Users() {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  // Exercise 1: users query with retry 3 + exponential backoff
  const { data: users, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser, // DELETE /users/:id
    onSuccess: (_data, id) => {
      setMessage(`DELETE /users/${id} → OK. (Fake API: the refetched list won't change. Check the Network tab.)`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (err) => setMessage(`❌ ${err.message}`),
  });

  // Exercise 4: useMemo → filter + sort only when users or search change
  const visibleUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (users?.data ?? [])
      .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, search]);

  if (isLoading) return <PageLoader label="Loading users..." />;
  if (isError) return <ErrorFallback error={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center gap-3">
          {isFetching && <span className="text-sm text-slate-500">Refreshing...</span>}
          <button
            onClick={() => refetch()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Authorization in the UI: only roles with users.write see the form */}
      {hasPermission(authUser, 'users.write') && <CreateUserForm onMessage={setMessage} />}

      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              {/* <th className="px-4 py-2 font-medium">City</th> */}
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleUsers.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-2">
                  <Link to={`/users/${u.id}`} className="font-medium text-indigo-600 hover:underline">
                    {u.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-600">{u.email}</td>
                {/* <td className="px-4 py-2 text-slate-600">{u.address.city}</td> */}
                <td className="px-4 py-2">
                  <DeleteUserButton
                    userId={u._id}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    isDeleting={deleteMutation.isPending && deleteMutation.variables === u._id}
                  />
                </td>
              </tr>
            ))}
            {visibleUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No users match "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
