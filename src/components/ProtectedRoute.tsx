import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types';

interface Props {
  children?: ReactNode;
  allowedRoles?: Role[]; // optional: only these roles may enter
}

// Two checks:
//  1) Authentication → are you logged in?        No  → /login
//  2) Authorization  → is your role allowed here? No  → /unauthorized
export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated) {
    // remember where the user wanted to go → Login sends them back after success
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Used as a wrapper (<ProtectedRoute><Page/></ProtectedRoute>) or as a layout route
  return children ? <>{children}</> : <Outlet />;
}
