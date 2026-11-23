import { Profiler, Suspense, type ProfilerOnRenderCallback } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import type { Role } from '../../types';
import ErrorBoundary from '../ErrorBoundary';
import LogoutButton from '../LogoutButton';
import PageLoader from '../PageLoader';

const NAV_LINKS: { to: string; label: string; roles?: Role[] }[] = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/users', label: '👥 Users' },
  { to: '/posts', label: '📝 Posts' },
  { to: '/todos', label: '✅ Todos (optimistic)' },
  { to: '/settings', label: '⚙️ Settings & Performance' },
  { to: '/admin', label: '🛡️ Admin panel', roles: ['admin'] },
];

const ROLE_BADGE: Record<Role, string> = {
  user: 'bg-slate-100 text-slate-700',
  moderator: 'bg-amber-100 text-amber-800',
  admin: 'bg-indigo-100 text-indigo-800',
};

// Part 3: React Profiler — logs how long the current page took to render.
const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  if (import.meta.env.DEV) console.log(`[Profiler] ${id} ${phase}: ${actualDuration.toFixed(1)}ms`);
};

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const fetchingCount = useIsFetching(); // how many queries are fetching right now (global)

  const links = NAV_LINKS.filter((l) => !l.roles || (user && l.roles.includes(user.role)));

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {sidebarOpen && (
        <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-4">
          <p className="mb-6 text-lg font-bold text-indigo-700">Admin Dashboard</p>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm ${
                    isActive ? 'bg-indigo-600 font-medium text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="rounded-lg border border-slate-300 px-2.5 py-1 text-sm hover:bg-slate-100"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            {fetchingCount > 0 && <span className="text-xs text-slate-500">⏳ Syncing {fetchingCount}...</span>}
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* <span className="text-sm">{user.name}</span> */}
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_BADGE[user.role]}`}>
                  {user.role}
                </span>
              </>
            )}
            <LogoutButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-6">
          {/* Suspense INSIDE the layout → sidebar stays visible while a lazy page loads */}
          <ErrorBoundary>
            <Suspense fallback={<PageLoader label="Loading page..." />}>
              <Profiler id="Page" onRender={onRender}>
                <Outlet />
              </Profiler>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
