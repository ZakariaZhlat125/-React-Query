import { useQueryClient } from '@tanstack/react-query';
import { ROLE_PERMISSIONS } from '../lib/permissions';
import type { Role } from '../types';

// Only admins reach this page: <ProtectedRoute allowedRoles={['admin']}>
export default function Admin() {
  const queryClient = useQueryClient();
  const roles = Object.keys(ROLE_PERMISSIONS) as Role[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🛡️ Admin panel</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Role permissions</h2>
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-slate-100">
            {roles.map((role) => (
              <tr key={role}>
                <td className="py-2 pr-4 font-medium">{role}</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {ROLE_PERMISSIONS[role].map((p) => (
                      <code key={p} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                        {p}
                      </code>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Cache tools</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => queryClient.invalidateQueries()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Invalidate everything
          </button>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'none' })}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Mark users stale (no refetch)
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">Open the React Query DevTools to watch the cache entries change.</p>
      </section>
    </div>
  );
}
