// Component-based code splitting: this modal is lazy-loaded from Settings.
// Its JS chunk is downloaded ONLY when the user opens it (check the Network tab).
const DATA = [
  { label: 'Mon', value: 32 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 41 },
  { label: 'Thu', value: 77 },
  { label: 'Fri', value: 64 },
  { label: 'Sat', value: 25 },
  { label: 'Sun', value: 49 },
];

export default function HeavyChartModal({ onClose }: { onClose: () => void }) {
  const max = Math.max(...DATA.map((d) => d.value));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Weekly visits (lazy-loaded chart)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="flex h-48 items-end gap-2">
          {DATA.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-indigo-500" style={{ height: `${(d.value / max) * 100}%` }} />
              <span className="text-xs text-slate-500">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
