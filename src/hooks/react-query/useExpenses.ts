import { ExpenseT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useExpenses() {
  const axios = useAxiosPrivate();

  const {
    data: expenses = [],
    refetch: refetchExpenses,
    isLoading: fetchingExpenses,
  } = useQuery<ExpenseT[]>(['fetchExpenses'], async () => {
    try {
      const { data } = await axios.get(`/expense/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    expenses,
    refetchExpenses,
    fetchingExpenses,
  };
}
