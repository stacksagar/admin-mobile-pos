import { PaymentHistoryT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function usePaymentHistories() {
  const axios = useAxiosPrivate();

  const {
    data: paymenthistories = [],
    refetch: refetchPaymentHistories,
    isLoading: fetchingPaymentHistories,
  } = useQuery<PaymentHistoryT[]>(['fetchPaymentHistories'], async () => {
    try {
      const { data } = await axios.get(`/payment-history/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    paymenthistories,
    refetchPaymentHistories,
    fetchingPaymentHistories,
  };
}
