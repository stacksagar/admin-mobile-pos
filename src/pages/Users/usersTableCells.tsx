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
    key: 'address',
  },

  {
    key: 'email',
  },

  {
    key: 'phone',
  },

  {
    key: 'actions',
    ActionButtons({ row }) {
      const { showUserFormModal, setSelectedUser } = useGlobalState();

      return (
        <>
          <Button
            onClick={() => {
              showUserFormModal?.toggle();
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
