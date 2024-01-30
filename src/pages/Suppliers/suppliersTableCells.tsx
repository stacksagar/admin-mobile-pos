import { Button } from '@mui/material';
import { SupplierT } from '../../data';
import { useGlobalState } from '../../context/globalState';
import FIcon from '../../common/Icons/FIcon';

const customersTableCells: MuiTableHeader<SupplierT & { key: 'sl' }>[] = [
  {
    key: 'id',
    label: 'ID',
  },

  {
    key: 'supplier_name',
    RenderComponent({ row }) {
      return (
        <div className="flex flex-col gap-2">
          <p> {row?.supplier_name} </p>
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
    key: 'total_puchase_amount',
    label: 'Total Puchase Amount',
  },
  {
    key: 'total_paid',
    label: 'Total Paid',
  },
  {
    key: 'total_due',
    label: 'Total Due',
  },

  {
    key: 'actions',
    ActionButtons({ row }) {
      const { isShow2, setSelectedItem } = useGlobalState();
      return (
        <>
          <Button
            variant="contained"
            title="Edit"
            size="small"
            onClick={() => {
              isShow2.setTrue();
              setSelectedItem(row);
            }}
          >
            Edit
          </Button>
        </>
      );
    },
  },
];

export default customersTableCells;
