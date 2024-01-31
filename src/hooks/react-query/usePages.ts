import { PageT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function usePages() {
  const axios = useAxiosPrivate();

  const {
    data: pages = [],
    refetch: refetchPages,
    isLoading: fetchingPages,
  } = useQuery<PageT[]>(['fetchPages'], async () => {
    try {
      const { data } = await axios.get(`/page/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    pages,
    refetchPages,
    fetchingPages,
  };
}
