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
    <div className='grid grid-cols-1 gap-4'> 
      {
        data?.map((history)=>(
          <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded shadow'>           
            <p> Product: {history?.product?.name} </p>
            <p> Supplier: {history?.supplier?.supplier_name} </p>
            <p> Due Amount: {history?.due_amount} </p>
            <p> Paid Amount: {history?.paid_amount} </p>
          </div>
        ))
      }
    </div>
  );
}