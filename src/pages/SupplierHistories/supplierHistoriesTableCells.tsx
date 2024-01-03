import { Button } from '@mui/material';
import { showDate } from '../../utils/date';
import { Link } from 'react-router-dom';
import { SupplierHistoryT } from '../../data';

const supplierHistoriesTableCells: MuiTableHeader<
  SupplierHistoryT & { key: 'sl' }
>[] = [
  {
    key: 'id',
    label: 'ID',
  },

  {
    key: 'createdAt',
    label: 'Purchase Date',
    RenderComponent({ row: history }) {
      return <div> {showDate(history?.createdAt, true)} </div>;
    },
  },

  {
    key: 'productId',
    label: 'Product',
    RenderComponent({ row }) {
      return (
        <div>
          <h6 className="max-w-[140px] whitespace-pre-line break-words text-lg font-medium">
            {row?.product?.name}
          </h6>
          <p>
            <b className="font-medium">Purchase Quantity = </b>
            {row?.quantity}
          </p>
          <p>
            <b className="font-medium">Purchase Price (Unit) = </b>
            {Math.floor(row?.total_purchase_amount / row?.quantity)}
          </p>
          <p>
            <b className="font-medium">Total Purchase Price = </b>
            {Math.floor(row?.total_purchase_amount)}
          </p>
          <p className="w-fit rounded bg-green-600 px-2 py-0.5 text-white">
            <b className="font-medium">Now In Stock = </b>
            {row?.product?.in_stock}
          </p>
        </div>
      );
    },
  },

  {
    key: 'supplierId',
    label: 'Supplier',
    RenderComponent({ row }) {
      return (
        <div className="w-fit">
          <p>Name: {row?.supplier?.supplier_name}</p>
          <p>Company: {row?.supplier?.supplier_name}</p>
          <div className="my-1.5 border-t dark:border-gray-600"></div>
          <p className="flex justify-between">
            <span>Total </span>
            <span> = {row?.total_purchase_amount}</span>
          </p>
          <p className="flex justify-between">
            <span>Paid </span> <span> = {row?.paid_amount}</span>
          </p>
          <p className="flex justify-between">
            <span>Due </span> <span> = {row?.due_amount}</span>
          </p>
        </div>
      );
    },
  },

  {
    key: 'userId',
    label: 'Purchased By',
    RenderComponent({ row }) {
      return (
        <div>
          <p className="text-xl font-medium">{row?.user?.name}</p>
          <p className="w-fit rounded bg-pink-500 px-1 py-0.5 text-white opacity-90">
            Role: {row?.user?.role}
          </p>
        </div>
      );
    },
  },

  {
    key: 'actions',
    ActionButtons({ row: history }) {
      return (
        <>
          <Link to={`/supplier-history-invoice?id=${history.id}`}>
            <Button variant="contained" title="Edit" size="small">
              Invoice
            </Button>
          </Link>
        </>
      );
    },
  },
];

export default supplierHistoriesTableCells;
