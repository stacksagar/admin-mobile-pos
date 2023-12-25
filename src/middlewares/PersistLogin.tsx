import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useRefreshToken from '../hooks/axios/useRefreshToken';
import Loader from '../common/Loaders/Loader';
import { useAuth } from '../context/auth';

export default function PersistLogin() {
  const { auth, persist } = useAuth();
  const refresh = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.access_token && isMounted
      ? verifyRefreshToken()
      : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  if (!persist) return <Outlet />;
  else return isLoading ? <Loader /> : <Outlet />;
}
