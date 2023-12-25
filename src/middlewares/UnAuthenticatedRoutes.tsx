import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';

const UnAuthenticatedRoutes = () => {
  const location = useLocation();
  const { auth } = useAuth();

  return auth?.user?.id ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default UnAuthenticatedRoutes;
