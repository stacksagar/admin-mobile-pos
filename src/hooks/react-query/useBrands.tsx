import { BrandT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useBrands() {
  const axios = useAxiosPrivate();

  const {
    data: brands = [],
    refetch: refetchBrands,
    isLoading: fetchingBrands,
  } = useQuery<BrandT[]>(['fetchBrands'], async () => {
    try {
      const { data } = await axios.get(`/brand/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    brands,
    refetchBrands,
    fetchingBrands,
  };
}
