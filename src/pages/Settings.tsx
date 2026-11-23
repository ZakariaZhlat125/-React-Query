import { lazy, Suspense, useState } from 'react';
import { useUIStore } from '../store/uiStore';

// Component-based code splitting: the modal code is downloaded only when opened.
const HeavyChartModal = lazy(() => import('../components/HeavyChartModal'));

// ⚠️ NAMED export on purpose → App.tsx must remap it for lazy():
//    lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
export function Settings() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings & Performance</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">UI preferences (Zustand)</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sidebarOpen} onChange={toggleSidebar} />
          Show sidebar
        </label>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 font-semibold">Lazy-loaded component</h2>
        <p className="mb-3 text-sm text-slate-600">
          Open DevTools → Network → JS, then click the button. A new file <code>HeavyChartModal-xxxx.js</code> is
          downloaded only now.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Open chart
        </button>

        {isModalOpen && (
          <Suspense fallback={<p className="mt-3 text-sm text-slate-500">Loading chart...</p>}>
            <HeavyChartModal onClose={() => setIsModalOpen(false)} />
          </Suspense>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h2 className="mb-2 font-semibold text-slate-900">Measure, then optimize</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Console: every page render is logged by <code>&lt;Profiler id="Page"&gt;</code> in AdminLayout.
          </li>
          <li>React DevTools → Profiler: record a click and find the slowest components.</li>
          <li>
            <code>npm run build</code> → count the chunk files in <code>dist/assets</code> (one per lazy page).
          </li>
        </ul>
      </section>
    </div>
  );
}
