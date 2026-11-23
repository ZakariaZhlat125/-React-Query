import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-4 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/dashboard" className="text-indigo-600 hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
