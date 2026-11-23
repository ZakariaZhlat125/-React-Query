import { Link } from 'react-router-dom';
import { hasPermission } from '../../lib/permissions';
import { useAuthStore } from '../../store/authStore';

interface Props {
  userId: number;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

// Worksheet Task 4: guest → "Login required", no permission → "No permission", admin → Delete
export default function DeleteUserButton({ userId, onDelete, isDeleting }: Props) {
  const user = useAuthStore((s) => s.user);

  // Authentication: who are you?
  if (!user) {
    return (
      <Link to="/login" className="text-sm text-indigo-600 underline">
        Login required
      </Link>
    );
  }

  // Authorization: what may you do?
  if (!hasPermission(user, 'users.delete')) {
    return <span className="text-xs text-slate-400">No permission</span>;
  }

  return (
    <button
      onClick={() => onDelete(userId)}
      disabled={isDeleting}
      className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
