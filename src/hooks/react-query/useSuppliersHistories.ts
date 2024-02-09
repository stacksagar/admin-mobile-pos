import { SupplierHistoryT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useSupplierHistories() {
  const axios = useAxiosPrivate();

  const {
    data: supplierHistories = [],
    refetch: refetchSupplierHistories,
    isLoading: fetchingSupplierHistories,
  } = useQuery<SupplierHistoryT[]>(['fetchSupplierHistories'], async () => {
    try {
      const { data } = await axios.get(`/supplier-history/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    supplierHistories,
    refetchSupplierHistories,
    fetchingSupplierHistories,
  };
}
