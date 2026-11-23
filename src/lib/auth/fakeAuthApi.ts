import type { AuthUser, LoginCredentials, LoginResponse, Role } from '../../types';
import { getRefreshToken } from './tokens';

// ⚠️ FAKE backend for practice. A real app would call:
//    POST /auth/login    → { access_token, refresh_token, user }
//    POST /auth/refresh  → { access_token }
// Every demo account uses the password: 123456

const DEMO_PASSWORD = '123456';

export const DEMO_ACCOUNTS: { email: string; name: string; role: Role }[] = [
  { email: 'user@test.com', name: 'Demo User', role: 'user' },
  { email: 'mod@test.com', name: 'Demo Moderator', role: 'moderator' },
  { email: 'admin@test.com', name: 'Demo Admin', role: 'admin' },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const makeToken = (prefix: string) => `${prefix}.${Math.random().toString(36).slice(2)}`;

export async function fakeLogin({ email, password }: LoginCredentials): Promise<LoginResponse> {
  await delay(700); // pretend we are talking to a server

  const index = DEMO_ACCOUNTS.findIndex((a) => a.email === email.trim().toLowerCase());
  if (index === -1 || password !== DEMO_PASSWORD) {
    // Throwing → useMutation puts this in `error` and calls onError
    throw new Error('Invalid email or password');
  }

  const account = DEMO_ACCOUNTS[index];
  const user: AuthUser = { id: index + 1, name: account.name, email: account.email, role: account.role };

  return {
    access_token: makeToken('access'), // short-lived (~15 min in real apps)
    refresh_token: makeToken('refresh'), // long-lived, only used to get a new access token
    user,
  };
}

export async function fakeRefresh(): Promise<{ access_token: string }> {
  await delay(300);
  if (!getRefreshToken()) throw new Error('No refresh token');
  return { access_token: makeToken('access') };
}
