import { SupplierT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useSuppliers() {
  const axios = useAxiosPrivate();

  const {
    data: suppliers = [],
    refetch: refetchSuppliers,
    isLoading: fetchingSuppliers,
  } = useQuery<SupplierT[]>(['fetchSuppliers'], async () => {
    try {
      const { data } = await axios.get(`/supplier/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    suppliers,
    refetchSuppliers,
    fetchingSuppliers,
  };
}
