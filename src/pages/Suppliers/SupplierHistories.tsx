import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { SupplierHistoryT } from '../../data';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

interface PropsT {
  supplierID: any;
}

export default function SupplierHistories({ supplierID }: PropsT) {
  const axiosPrivate = useAxiosPrivate();
  const { data } = useQuery<SupplierHistoryT[]>(
    ['fetchSupplierHistory'],
    async () => {
      const { data } = await axiosPrivate.get(
        `/supplier-history/by-supplier/${supplierID}`
      );
      return data || [];
    }
  );

  useEffect(() => {
    console.log('supplierID ', supplierID);
  }, [supplierID]);

  useEffect(() => {
    console.log('data ', data);
  }, [data]);
  return (
    <div className="grid grid-cols-1 gap-4 lg:min-w-[550px]">
      {data?.map((history) => (
        <div className="rounded bg-gray-50 p-4 shadow dark:bg-gray-900 flex flex-col gap-3">
          <p> <b>Product:</b> {history?.product?.name} </p>
          <p> <b>Supplier:</b> {history?.supplier?.supplier_name} </p>
          <p> <b>Purchased By:</b> {history?.user?.name} </p>
          <p> <b>Due Amount:</b> {history?.due_amount} </p>
          <p> <b>Paid Amount:</b> {history?.paid_amount} </p>
          <p> <b>Total Purchased Amount Was:</b> {history?.total_purchase_amount} </p>
          <Link to={`/supplier-history-invoice?id=${history.id}`}>
            <Button variant="contained"> Invoice </Button>{' '}
          </Link>
        </div>
      ))}
    </div>
  );
}
