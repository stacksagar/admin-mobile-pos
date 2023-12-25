import { axios_private } from '../../api/api';
import { useAuth } from '../../context/auth';

export default function useLogout() {
  const { setAuth, setLoading } = useAuth();

  const logout = async () => {
    setLoading(true);
    try {
      await axios_private.get('/auth/logout', {
        withCredentials: true,
      });
      setAuth({});
    } catch (error) {
      console.log('LOGOUT: ', error);
    } finally {
      setLoading(false);
    }
  };

  return logout;
}
