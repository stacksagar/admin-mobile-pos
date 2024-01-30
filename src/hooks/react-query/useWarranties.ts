import { WarrantyT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useWarranties() {
  const axios = useAxiosPrivate();

  const {
    data: warranties = [],
    refetch: refetchWarranties,
    isLoading: fetchingWarranties,
  } = useQuery<WarrantyT[]>(['fetchWarranties'], async () => {
    try {
      const { data } = await axios.get(`/warranty/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    warranties,
    refetchWarranties,
    fetchingWarranties,
  };
}
