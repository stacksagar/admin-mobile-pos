import { ProductT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useStockOutProducts() {
  const axios = useAxiosPrivate();

  const {
    data: products = [],
    refetch: refetchProducts,
    isLoading: fetchingProducts,
  } = useQuery<ProductT[]>(['fetchStockOutProducts'], async () => {
    try {
      const { data } = await axios.get(`/product/stock-out/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    products,
    refetchProducts,
    fetchingProducts,
  };
}
