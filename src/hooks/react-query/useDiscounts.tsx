import { DiscountT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useDiscounts() {
  const axios = useAxiosPrivate();

  const {
    data: discounts = [],
    refetch: refetchDiscounts,
    isLoading: fetchingDiscounts,
  } = useQuery<DiscountT[]>(['fetchDiscounts'], async () => {
    try {
      const { data } = await axios.get(`/discount/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    discounts,
    refetchDiscounts,
    fetchingDiscounts,
  };
}
