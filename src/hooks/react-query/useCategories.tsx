import { CategoryT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useCategories() {
  const axios = useAxiosPrivate();

  const {
    data: categories = [],
    refetch: refetchCategories,
    isLoading: fetchCategories,
  } = useQuery<CategoryT[]>(['fetchCategories'], async () => {
    try {
      const { data } = await axios.get(`/product/category/all`);
      return data?.categories || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    categories,
    refetchCategories,
    fetchCategories,
  };
}
