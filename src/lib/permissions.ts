import type { AuthUser, Role } from '../types';

// Authorization = "what are you ALLOWED to do?"
export type Permission =
  | 'users.read'
  | 'users.write'
  | 'users.delete'
  | 'posts.read'
  | 'posts.write'
  | 'todos.read'
  | 'todos.write'
  | '*';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  user: ['users.read', 'posts.read', 'todos.read', 'todos.write'],
  moderator: ['users.read', 'users.write', 'posts.read', 'posts.write', 'todos.read', 'todos.write'],
  admin: ['*'], // admin can do everything
};

export const hasPermission = (user: AuthUser | null, perm: Permission): boolean => {
  if (!user) return false;
  const perms = ROLE_PERMISSIONS[user.role];
  return perms.includes('*') || perms.includes(perm);
};
