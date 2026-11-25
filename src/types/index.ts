// Shared TypeScript types for the whole app.

// ---------- Auth (client state → Zustand) ----------
export type Role = 'user' | 'moderator' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

// ---------- Server data (server state → React Query) ----------
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { city: string };
  company: { name: string };
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface Post {
  _id: string;
  title: string;
  author: { _id: string; name: string; email: string } | null;
  tags: string[];
  comments: { text: string; name?: string }[];
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
