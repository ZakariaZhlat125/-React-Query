import type { Todo } from '../../types';
import { api } from './client';

export const fetchTodos = async (): Promise<Todo[]> => (await api.get<Todo[]>('/todos?_limit=8')).data;

export const createTodo = async (title: string): Promise<Todo> =>
  (await api.post<Todo>('/todos', { title, completed: false, userId: 1 })).data;

export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};
