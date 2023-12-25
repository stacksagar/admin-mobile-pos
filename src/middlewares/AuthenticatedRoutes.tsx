import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Roles, roles_checker } from '../config/roles';

const RequireAuth = ({ min_role }: { min_role: Roles }) => {
  const location = useLocation();
  const { auth } = useAuth();

  if (!auth?.user?.role)
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;

  const role_fulfiled = roles_checker(auth?.user?.role, min_role);

  if (role_fulfiled) return <Outlet />;

  return auth?.user?.id ? (
    <Navigate to="/access-denied" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth/signin" state={{ from: location }} replace />
  );
};

export default RequireAuth;
