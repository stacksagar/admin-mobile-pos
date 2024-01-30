import { Button } from '@mui/material';
import { UserT } from '../../data';
import { useGlobalState } from '../../context/globalState';
import FIcon from '../../common/Icons/FIcon';
import { Link, useLocation } from 'react-router-dom';

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
    key: 'email',
    label: 'Contacts',
    RenderComponent({ row }) {
      return (
        <div>
          <p> {row?.email} </p>
          <p> {row?.phone} </p>
          <p className="max-w-[220px]"> Address: {row?.address || ' - '} </p>
        </div>
      );
    },
  },

  {
    key: 'role',
    RenderComponent({ row }) {
      return (
        <div>
          <p className="font-semibold capitalize text-pink-600">
            {' '}
            {row?.role}{' '}
          </p>
        </div>
      );
    },
  },
  {
    key: 'actions',
    ActionButtons({ row }) {
      const location = useLocation();
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

          {location.pathname?.includes('moderators') ? (
            <Link to={`/moderators/permissions?id=${row?.id}`}>
              <Button variant="contained" size="small" color="warning">
                {' '}
                Permissions{' '}
              </Button>
            </Link>
          ) : null}
        </>
      );
    },
  },
];

export default customersTableCells;
