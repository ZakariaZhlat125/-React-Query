import type { Post } from '../../types';
import { API_URL } from './client';

// This file uses plain fetch (like "Your Turn: Part 1") to compare with Axios.
// ⚠️ fetch does NOT throw on HTTP errors (404, 500...). We must check res.ok ourselves,
//    otherwise React Query thinks the request succeeded. (Worksheet → Bug 3)
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const fetchPosts = (limit = 10) => getJson<Post[]>(`${API_URL}/posts?_limit=${limit}`);

export const fetchPost = (id: number) => getJson<Post>(`${API_URL}/posts/${id}`);

export const fetchPostsPage = (page: number, limit = 5) =>
  getJson<Post[]>(`${API_URL}/posts?_page=${page}&_limit=${limit}`);

export async function createPost(title: string): Promise<Post> {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body: '...', userId: 1 }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
