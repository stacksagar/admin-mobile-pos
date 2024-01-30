import { CategoryT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useExpenseCategories() {
  const axios = useAxiosPrivate();

  const {
    data: categories = [],
    refetch: refetchCategories,
    isLoading: fetchingCategories,
  } = useQuery<CategoryT[]>(['fetchECategories'], async () => {
    try {
      const { data } = await axios.get(`/expense-category/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    categories,
    refetchCategories,
    fetchingCategories,
  };
}
