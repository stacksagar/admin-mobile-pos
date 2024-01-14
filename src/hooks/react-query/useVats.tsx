import { VatT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useVats() {
  const axios = useAxiosPrivate();

  const {
    data: vats = [],
    refetch: refetchVats,
    isLoading: fetchingVats,
  } = useQuery<VatT[]>(['fetchVats'], async () => {
    try {
      const { data } = await axios.get(`/vat/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    vats,
    refetchVats,
    fetchingVats,
  };
}
