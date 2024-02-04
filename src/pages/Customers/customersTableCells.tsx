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
          <>
            {row?.phone ? (
              <>
                <p>
                  <a href={`mailto:${row?.phone}`} className="text-blue-500">
                    <FIcon icon="phone" /> {row?.phone}
                  </a>
                </p>

                <p>
                  <a
                    target="_blank"
                    href={`https://api.whatsapp.com/send?phone=${
                      row?.phone?.includes('+88')
                        ? row?.phone
                        : '+88' + row?.phone
                    }&text=Hi ${row?.name}, `}
                    className="text-blue-500"
                  >
                    <FIcon icon="whatsapp" /> {row?.phone}
                  </a>
                </p>
              </>
            ) : null}
          </>
        </div>
      );
    },
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
