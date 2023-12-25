import { axios_req } from '../../api/api';
import { useAuth } from '../../context/auth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios_req.get('/auth/refresh', {
      withCredentials: true,
    });

    if (setAuth) {
      setAuth({
        access_token: response.data?.access_token,
        user: response?.data?.user,
      });
    }

    return response.data.access_token;
  };
  // console.clear()
  return refresh;
};

export default useRefreshToken;
