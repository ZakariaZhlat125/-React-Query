import type { CreateUserInput, User } from '../../types';
import { api } from './client';

// Typed API functions. Components never call axios directly.
// Axios THROWS automatically on 4xx/5xx → React Query sees the error.
export const fetchUsers = async (): Promise<User[]> => (await api.get<User[]>('/users')).data;

export const fetchUser = async (id: number): Promise<User> => (await api.get<User>(`/users/${id}`)).data;

export const createUser = async (input: CreateUserInput): Promise<User> =>
  (await api.post<User>('/users', input)).data;

export const updateUser = async ({ id, data }: { id: number; data: Partial<User> }): Promise<User> =>
  (await api.put<User>(`/users/${id}`, data)).data;

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};
