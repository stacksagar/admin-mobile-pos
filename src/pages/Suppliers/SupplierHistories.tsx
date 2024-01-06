import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { SupplierHistoryT } from '../../data';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import DefaultSketelon from '../../common/Skeletons/DefaultSketelon';

interface PropsT {
  supplierID: any;
}

export default function SupplierHistories({ supplierID }: PropsT) {
  const axiosPrivate = useAxiosPrivate();
  const { data, isLoading } = useQuery<SupplierHistoryT[]>(
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

  if (isLoading)
    return (
      <div className="py-2">
        <DefaultSketelon />
      </div>
    );

  if (data?.length === 0) return <div className="py-2">Empty!</div>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:min-w-[550px]">
      {data?.map((history) => (
        <div
          key={history?.id}
          className="flex flex-col gap-3 rounded bg-gray-50 p-4 shadow dark:bg-gray-900"
        >
          <p>
            <b>Product Name:</b> {history?.product?.name}
          </p>
          <p>
            <b>Supplier Name:</b> {history?.supplier?.supplier_name}
          </p>
          <p>
            <b>Purchased By:</b>{' '}
            <span className="inline-block rounded bg-rose-600 px-2 py-1 text-white shadow">
              {history?.user?.name}
            </span>
          </p>
          <p>
            <b>Product Quantity:</b> {history?.quantity}
          </p>
          <p>
            <b>Purchase Price (Unit):</b>{' '}
            {history?.total_purchase_amount / history?.quantity}
          </p>
          <p>
            <b>Due Amount:</b> {history?.due_amount}
          </p>
          <p>
            <b>Paid Amount:</b> {history?.paid_amount}
          </p>
          <p>
            <b>Total Purchased Amount Was:</b> {history?.total_purchase_amount}
          </p>
          <Link to={`/supplier-history-invoice?id=${history.id}`}>
            <Button variant="contained"> Invoice </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
