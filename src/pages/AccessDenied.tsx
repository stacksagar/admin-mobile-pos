import { useEffect } from 'react';
import useLogout from '../hooks/axios/useLogout';

export default function AccessDenied() {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="flex min-h-screen w-full items-center">
        <div className="w-full text-center text-lg font-semibold text-red-500">
          Access Denied!
        </div>
      </div>
    </div>
  );
}
