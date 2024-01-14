import { SaleT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useSales() {
  const axios = useAxiosPrivate();

  const {
    data: sales = [],
    refetch: refetchSales,
    isLoading: fetchingSales,
  } = useQuery<SaleT[]>(['fetchSales'], async () => {
    try {
      const { data } = await axios.get(`/sale/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    sales,
    refetchSales,
    fetchingSales,
  };
}
