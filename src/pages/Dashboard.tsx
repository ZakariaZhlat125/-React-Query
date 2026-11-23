import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../lib/api/posts';
import { fetchTodos } from '../lib/api/todos';
import { fetchUsers } from '../lib/api/users';
import { QUERY_KEYS } from '../lib/queryKeys';
import { useAuthStore } from '../store/authStore';

function StatCard({ label, value, loading }: { label: string; value: string | number; loading: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">
        {loading ? <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" /> : value}
      </p>
    </div>
  );
}

// Several useQuery calls in one page → the requests run IN PARALLEL.
// The keys are the same as on the Users/Posts/Todos pages → the data is SHARED (cache).
export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const users = useQuery({ queryKey: QUERY_KEYS.users, queryFn: fetchUsers });
  const posts = useQuery({ queryKey: QUERY_KEYS.posts, queryFn: () => fetchPosts(10) });
  const todos = useQuery({ queryKey: QUERY_KEYS.todos, queryFn: fetchTodos });

  const doneTodos = todos.data?.filter((t) => t.completed).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
        <p className="text-sm text-slate-500">Server data from React Query · user from Zustand</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={users.data?.length ?? 0} loading={users.isLoading} />
        <StatCard label="Latest posts" value={posts.data?.length ?? 0} loading={posts.isLoading} />
        <StatCard
          label="Todos done"
          value={`${doneTodos} / ${todos.data?.length ?? 0}`}
          loading={todos.isLoading}
        />
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
        <p className="font-semibold">Try this:</p>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>Open DevTools → Network. Reload: 3 requests run at the same time.</li>
          <li>Go to Users, then come back. No new request: the data comes from the cache (staleTime 5 min).</li>
          <li>Open the React Query DevTools (flower button, bottom corner) to see every cache entry.</li>
        </ol>
      </div>
    </div>
  );
}
