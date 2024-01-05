import { Button } from '@mui/material';
import { UserT } from '../../data';
import { useGlobalState } from '../../context/globalState';
import FIcon from '../../common/Icons/FIcon';

const customersTableCells: MuiTableHeader<UserT & { key: 'sl' }>[] = [
  {
    key: 'id',
    label: 'ID',
  },

  {
    key: 'name',

    RenderComponent({ row }) {
      return (
        <div className="flex flex-col gap-2">
          <p> {row?.name} </p>
          <p>
            {row?.email ? (
              <a href={`mailto:${row?.email}`} className="text-blue-500">
                <FIcon icon="envelope" /> {row?.email}
              </a>
            ) : null}
          </p>
          <p>
            {row?.phone ? (
              <a href={`mailto:${row?.phone}`} className="text-blue-500">
                <FIcon icon="phone" /> {row?.phone}
              </a>
            ) : null}
          </p>
        </div>
      );
    },
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
