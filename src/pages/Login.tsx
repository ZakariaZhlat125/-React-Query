import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DEMO_ACCOUNTS, fakeLogin } from '../lib/auth/fakeAuthApi';
import { setTokens } from '../lib/auth/tokens';
import { useAuthStore } from '../store/authStore';

// Login flow:
// credentials → POST /auth/login → { access_token, refresh_token, user }
// → save tokens → update auth store → redirect to the page the user wanted
export default function Login() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: fakeLogin,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      login(data.user);
      navigate(from, { replace: true });
    },
  });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Admin Dashboard · Session 6</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {loginMutation.isError && <p className="text-sm text-red-600">{loginMutation.error.message}</p>}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="mb-2 text-xs text-slate-500">
            Quick login (password <code className="rounded bg-slate-100 px-1">123456</code>):
          </p>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                disabled={loginMutation.isPending}
                onClick={() => loginMutation.mutate({ email: a.email, password: '123456' })}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-50"
              >
                Login as {a.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
