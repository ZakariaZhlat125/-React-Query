import type { Post } from '../../types';
import { api } from './client';

interface PostsPage {
  data: Post[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const fetchPostsPage = async (page: number, limit = 5): Promise<PostsPage> =>
  (await api.get<{ data: PostsPage }>('/posts', { params: { page, limit } })).data.data;

export const fetchPosts = async (limit = 10): Promise<Post[]> =>
  (await fetchPostsPage(1, limit)).data;

export const fetchPost = async (id: string): Promise<Post> =>
  (await api.get<{ data: Post }>(`/posts/${id}`)).data.data;

export const createPost = async (title: string): Promise<Post> =>
  (await api.post<{ data: Post }>('/posts', { title })).data.data;
