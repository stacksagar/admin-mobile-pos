import { Query, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { SupplierHistoryT } from '../../data';

interface PropsT {
  supplierID: any;
}

export default function SupplierHistories({ supplierID }: PropsT) {
  const axiosPrivate = useAxiosPrivate();
  const { data, refetch } = useQuery<SupplierHistoryT[]>(
    ['fetchSupplierHistory'],
    async () => {
      try {
        const { data } = await axiosPrivate.get(
          `/supplier-history/by-supplier/${supplierID}`
        );
        return data;
      } catch (error) {
        console.log(error);
        return [];
      }
    }
  );

  useEffect(() => {
    console.log('supplierID ', supplierID);
  }, [supplierID]);

  useEffect(() => {
    console.log('data ', data);
  }, [data]);
  return (
    <div> 
      {
        data?.map((history)=>(
          <div>
            <p> Due Amount: {history?.due_amount} </p>
            <p> Paid Amount: {history?.paid_amount} </p>
          </div>
        ))
      }
    </div>
  );
}
