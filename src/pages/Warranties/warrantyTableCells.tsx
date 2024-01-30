import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { WarrantyT } from '../../data';
import { showDate } from '../../utils/date';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';

interface Props {
  onEditBtnClick: (b: WarrantyT) => void;
}

export default function warrantyTableCells({ onEditBtnClick }: Props) {
  const cells: MuiTableHeader<WarrantyT>[] = [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'createdAt',
      label: 'Date',
      RenderComponent({ row }) {
        return (
          <div>
            <p>
              Receive: <b>{showDate(row?.receive_date, true)}</b>{' '}
            </p>
            <p>
              Delivery: <b>{showDate(row?.delivery_date, true)}</b>{' '}
            </p>
          </div>
        );
      },
    },

    {
      key: 'delivery_fee',
      label: 'Amounts/Fees',
      RenderComponent({ row }) {
        return (
          <div>
            <p> Delivery Fee: {row?.delivery_fee} </p>
            <p> Warranty Fee: {row?.warranty_fee} </p>
            <p> Paid: {row?.advance_amount} </p>
            <p> Due: {row?.due_amount} </p>
          </div>
        );
      },
    },

    {
      key: 'customerId',
      label: 'Customer',
      RenderComponent({ row }) {
        return (
          <div>
            <p> {row?.customer?.name} </p>
          </div>
        );
      },
    },
    {
      key: 'productId',
      label: 'Product',
      RenderComponent({ row }) {
        return (
          <div>
            <p> {row?.product?.name} </p>
          </div>
        );
      },
    },
    {
      key: 'brandId',
      label: 'Brand',
      RenderComponent({ row }) {
        return (
          <div>
            <p> {row?.brand?.name} </p>
          </div>
        );
      },
    },

    {
      key: 'status',
      label: 'Brand',
      RenderComponent({ row }) {
        const axios = useAxiosPrivate();
        async function updateStatus(status: string) {
          if (!status) return;
          await axios.put(`/warranty/${row?.id}`, { status });
        }

        return (
          <FormControl fullWidth>
            <InputLabel id="status">Status</InputLabel>
            <Select
              onChange={(e) => updateStatus(e.target.value)}
              defaultValue={row?.status}
              labelId="status"
              id="status"
              label="Status"
            >
              <MenuItem value="received"> Received </MenuItem>
              <MenuItem value="delivery"> Delivery </MenuItem>
              <MenuItem value="success"> Success </MenuItem>
              <MenuItem value="courier"> Courier </MenuItem>
            </Select>
          </FormControl>
        );
      },
    },

    {
      key: 'actions',

      ActionButtons({ row }) {
        return (
          <>
            <Link to={`/warranty-pos?id=${row?.id}`}>
              <Button
                onClick={() => onEditBtnClick(row)}
                variant="contained"
                title="Edit"
                size="small"
              >
                Edit
              </Button>
            </Link>
            <Link to={`/warranty-invoice?id=${row?.id}`}>
              <Button variant="contained" title="Edit" size="small">
                Invoice
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  return cells;
}
