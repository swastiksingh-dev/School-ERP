/* ─── ProtectedRoute ───
 * Route guard component that checks authentication and role authorization.
 * Renders <Outlet /> if allowed, otherwise redirects to login or role home.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types';

type Props = {
  allowed: UserRole | UserRole[];
};

export function ProtectedRoute({ allowed }: Props) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!roles.includes(user.role)) {
    const home =
      user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/student';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
