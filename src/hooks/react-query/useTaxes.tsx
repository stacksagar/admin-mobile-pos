import { TaxT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../axios/useAxiosPrivate';

export default function useTaxes() {
  const axios = useAxiosPrivate();

  const {
    data: taxes = [],
    refetch: refetchTaxes,
    isLoading: fetchingTaxes,
  } = useQuery<TaxT[]>(['fetchTaxes'], async () => {
    try {
      const { data } = await axios.get(`/tax/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
      return [];
    }
  });

  return {
    taxes,
    refetchTaxes,
    fetchingTaxes,
  };
}
