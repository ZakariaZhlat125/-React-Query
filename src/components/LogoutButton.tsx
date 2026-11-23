import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../lib/auth/tokens';
import { useAuthStore } from '../store/authStore';

export default function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens(); // 1. remove the tokens
    logout(); // 2. clear the auth store
    queryClient.clear(); // 3. drop ALL cached server data → the next user sees nothing private
    navigate('/login', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      Logout
    </button>
  );
}
