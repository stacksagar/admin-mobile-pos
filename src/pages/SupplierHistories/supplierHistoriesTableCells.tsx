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
    key: 'productId',
    label: 'Product',
    RenderComponent({ row }) {
      return (
        <div>
          <h6 className="max-w-[140px] whitespace-pre-line break-words text-lg font-medium">
            {row?.product?.name}
          </h6>
          <p className="w-fit rounded bg-green-600 px-2 py-1 text-sm text-white">
            In Stock: {row?.product?.in_stock}
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
        <div>
          <p>Name: {row?.supplier?.supplier_name}</p>
          <p>Company: {row?.supplier?.supplier_name}</p>
          <p>Purchased Total: {row?.total_purchase_amount}</p>
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
          <p className='text-xl font-medium'>{row?.user?.name}</p>
          <p className='px-1 py-0.5 bg-pink-500 text-white w-fit rounded opacity-90'>Role: {row?.user?.role} </p>
        </div>
      );
    },
  },

  {
    key: 'createdAt',
    label: 'Date',
    RenderComponent({ row: history }) {
      return <div> {showDate(history?.createdAt, true)} </div>;
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
