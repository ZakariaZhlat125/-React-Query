import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../lib/api/users';
import { QUERY_KEYS } from '../../lib/queryKeys';

// Exercise 2: create-user mutation + pending button + invalidateQueries
export default function CreateUserForm({ onMessage }: { onMessage: (msg: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser, // POST /users
    onSuccess: (user) => {
      onMessage(`POST /users → created "${user.name}" with id ${user.id}. (Fake API: the refetched list won't change.)`);
      setName('');
      setEmail('');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
    onError: (err) => onMessage(`❌ ${err.message}`),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    createUserMutation.mutate({ name: name.trim(), email: email.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={createUserMutation.isPending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {createUserMutation.isPending ? 'Saving...' : 'Add user'}
      </button>
    </form>
  );
}
