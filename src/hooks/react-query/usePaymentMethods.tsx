import { PaymentT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function usePaymentMethods() {
  const axios = useAxiosPrivate();

  const {
    data: paymentMethods = [],
    refetch: refetchMethods,
    isLoading: fetchingMethods,
  } = useQuery<PaymentT[]>(['fetchPMethods'], async () => {
    try {
      const { data } = await axios.get(`/payment-method/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    paymentMethods,
    refetchMethods,
    fetchingMethods,
  };
}
