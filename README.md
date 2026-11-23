# Session 6 — React Query, Authentication & Performance

An Admin Dashboard built with React + TypeScript + React Query + Zustand + React Router + Tailwind.
Practice API: https://jsonplaceholder.typicode.com. It accepts POST/PUT/DELETE but does **not** save anything, so watch the **Network** tab.

```bash
npm install
npm run dev
```

Log in with a quick-login button, or with `user@test.com`, `mod@test.com` or `admin@test.com` (password `123456`).

## Where to find each topic

| Topic | File |
|-------|------|
| `QueryClient` + `QueryClientProvider` + DevTools | `src/main.tsx`, `src/lib/queryClient.ts` |
| Centralized query keys | `src/lib/queryKeys.ts` |
| API layer (Axios + interceptors, refresh on 401) | `src/lib/api/client.ts` |
| Typed API functions (Axios / fetch) | `src/lib/api/users.ts`, `posts.ts`, `todos.ts` |
| `useQuery`, `retry`, `useMutation`, `invalidateQueries` | `src/pages/Users.tsx`, `src/components/users/CreateUserForm.tsx` |
| Query key with id + `setQueryData` | `src/pages/UserDetails.tsx` |
| Parallel queries + shared cache | `src/pages/Dashboard.tsx` |
| Worksheet Task 1 (list + Refresh + `isFetching`) | `src/components/posts/PostsList.tsx` |
| Worksheet Task 2 (`enabled`) | `src/components/posts/PostViewer.tsx` |
| Worksheet Task 3 (create mutation) | `src/components/posts/CreatePostForm.tsx` |
| Challenge (pagination + `keepPreviousData`) | `src/components/posts/PagedPosts.tsx` |
| Optimistic updates + rollback | `src/pages/Todos.tsx` |
| Login flow + tokens | `src/pages/Login.tsx`, `src/lib/auth/*` |
| Auth store (Zustand + persist) / UI store | `src/store/authStore.ts`, `src/store/uiStore.ts` |
| Protected routes + roles | `src/components/ProtectedRoute.tsx`, `src/App.tsx` |
| Permissions (`hasPermission`) | `src/lib/permissions.ts`, `src/components/users/DeleteUserButton.tsx` |
| Logout (`queryClient.clear()`) | `src/components/LogoutButton.tsx` |
| `lazy` + `Suspense` (routes), named-export remap | `src/App.tsx` |
| Lazy component (modal) | `src/pages/Settings.tsx`, `src/components/HeavyChartModal.tsx` |
| Profiler + Error boundary | `src/components/layout/AdminLayout.tsx`, `src/components/ErrorBoundary.tsx` |

## Things to try

1. `npm run build` → count the `.js` files in `dist/assets` (one per lazy page).
2. Log in as **user** and open `/admin` → you are sent to `/unauthorized`.
3. On **Todos**, check "Simulate server error" and add a todo → it appears, then rolls back.
4. Open the React Query DevTools (button in the bottom corner) and watch the cache.
