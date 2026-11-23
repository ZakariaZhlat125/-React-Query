import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-4 text-center">
      <p className="text-5xl">⛔</p>
      <h1 className="text-2xl font-bold">You don't have permission</h1>
      <p className="text-slate-500">You are logged in, but your role can't open this page (authorization).</p>
      <Link to="/dashboard" className="text-indigo-600 hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
