import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorFallback from '../components/ErrorFallback';
import PageLoader from '../components/PageLoader';
import { createTodo, deleteTodo, fetchTodos } from '../lib/api/todos';
import { QUERY_KEYS } from '../lib/queryKeys';
import type { Todo } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// OPTIMISTIC UPDATES: change the screen first, then talk to the server, roll back on error.
export default function Todos() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [message, setMessage] = useState('');

  const { data: todos, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.todos,
    queryFn: fetchTodos,
  });

  const addTodo = useMutation({
    mutationFn: async (newTitle: string) => {
      if (simulateError) {
        await delay(1000);
        throw new Error('Simulated server error → rolled back');
      }
      return createTodo(newTitle);
    },

    // 1) BEFORE the request: update the cache immediately
    onMutate: async (newTitle) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.todos }); // stop in-flight refetches
      const previous = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todos); // snapshot for rollback
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todos, (old = []) => [
        { id: Date.now(), userId: 1, title: newTitle, completed: false },
        ...old,
      ]);
      setTitle('');
      return { previous }; // → becomes `context` in onError
    },

    // 2) Request failed → put the old data back
    onError: (err, _newTitle, context) => {
      queryClient.setQueryData(QUERY_KEYS.todos, context?.previous);
      setMessage(`❌ ${err.message}`);
    },

    onSuccess: () => setMessage('✅ Saved on the server'),

    // 3) Success OR error → sync with the server.
    //    Real app: invalidateQueries({ queryKey: QUERY_KEYS.todos })
    //    The fake API doesn't save, so a refetch would remove our new todo.
    //    refetchType: 'none' → mark it stale but don't refetch now.
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todos, refetchType: 'none' }),
  });

  const removeTodo = useMutation({
    mutationFn: async (id: number) => {
      if (simulateError) {
        await delay(1000);
        throw new Error('Simulated server error → rolled back');
      }
      return deleteTodo(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.todos });
      const previous = queryClient.getQueryData<Todo[]>(QUERY_KEYS.todos);
      queryClient.setQueryData<Todo[]>(QUERY_KEYS.todos, (old = []) => old.filter((t) => t.id !== id));
      return { previous };
    },
    onError: (err, _id, context) => {
      queryClient.setQueryData(QUERY_KEYS.todos, context?.previous);
      setMessage(`❌ ${err.message}`);
    },
    onSuccess: () => setMessage('✅ Deleted on the server'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.todos, refetchType: 'none' }),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) addTodo.mutate(title.trim());
  };

  if (isLoading) return <PageLoader label="Loading todos..." />;
  if (isError) return <ErrorFallback error={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Todos · Optimistic updates</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Add
        </button>
      </form>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />
        Simulate server error (watch the item appear, then disappear after 1s = rollback)
      </label>

      {message && <p className="text-sm">{message}</p>}

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {todos?.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <span className={t.completed ? 'text-slate-400 line-through' : ''}>{t.title}</span>
            <button onClick={() => removeTodo.mutate(t.id)} className="text-slate-400 hover:text-red-600" aria-label="Delete">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
