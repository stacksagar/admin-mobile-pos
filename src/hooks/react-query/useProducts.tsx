import { ProductT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useProducts() {
  const axios = useAxiosPrivate();

  const {
    data: products = [],
    refetch: refetchProducts,
    isLoading: fetchingProducts,
  } = useQuery<ProductT[]>(['fetchStockInProducts'], async () => {
    try {
      const { data } = await axios.get(`/product/stock-in/all`);
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
