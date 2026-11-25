// Centralized query keys → no typos, predictable invalidation.
//
// Keys are arrays. invalidateQueries({ queryKey: ['users'] }) matches every key
// that STARTS with 'users': ['users'] and ['users', 3] are both refreshed.
export const QUERY_KEYS = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const, // the id MUST be in the key

  posts: ['posts'] as const,
  postsPage: (page: number) => ['posts', 'page', page] as const,
  post: (id: string) => ['post', id] as const,

  todos: ['todos'] as const,
};
