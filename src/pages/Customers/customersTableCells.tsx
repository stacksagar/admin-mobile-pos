import { Button } from '@mui/material';
import { UserT } from '../../data';
import { useGlobalState } from '../../context/globalState';

const customersTableCells: MuiTableHeader<UserT & { key: 'sl' }>[] = [
  {
    key: 'id',
    label: 'ID',
  },

  {
    key: 'name',
  },

  {
    key: 'total_puchase_amount',
    label: 'Total / Paid / Due',
    RenderComponent({ row }) {
      return (
        <div className="max-w-fit">
          <p className="flex items-center justify-between gap-x-4">
            <span> Total Purchase </span>{' '}
            <span> = {row?.total_puchase_amount} </span>
          </p>
          <p className="flex items-center justify-between gap-x-4">
            <span> Total Paid</span> <span> = {row?.paid} </span>
          </p>
          <p className="flex items-center justify-between gap-x-4">
            <span> Total Due </span> <span> = {row?.due} </span>
          </p>
        </div>
      );
    },
  },

  {
    key: 'actions',
    ActionButtons({ row }) {
      const { showCustomerFormModal, setSelectedUser } = useGlobalState();

      return (
        <>
          <Button
            onClick={() => {
              showCustomerFormModal?.toggle();
              setSelectedUser(row);
            }}
            variant="contained"
            title="Edit"
            size="small"
          >
            Edit
          </Button>
        </>
      );
    },
  },
];

export default customersTableCells;
