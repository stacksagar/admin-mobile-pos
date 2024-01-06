import { UserT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useCustomers() {
  const axios = useAxiosPrivate();

  const {
    data: customers = [],
    refetch: refetchCustomers,
    isLoading: fetchingCustomers,
  } = useQuery<UserT[]>(['fetchCustomers'], async () => {
    try {
      const { data } = await axios.get(`/customer/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    customers,
    refetchCustomers,
    fetchingCustomers,
  };
}
