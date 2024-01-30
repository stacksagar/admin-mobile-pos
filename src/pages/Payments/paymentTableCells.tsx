import { Button } from '@mui/material';
import { PaymentT } from '../../data';
import { showDate } from '../../utils/date';

interface Props {
  onEditBtnClick: (b: PaymentT) => void;
}

export default function paymentTableCells({ onEditBtnClick }: Props) {
  const cells: MuiTableHeader<PaymentT>[] = [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'name',
      RenderComponent({ row }) {
        return (
          <div>
            <p> {row?.name} </p>
            <img className="max-w-[50px]" src={row?.logo} alt="" />
          </div>
        );
      },
    },

    {
      key: 'wallet',
    },

    {
      key: 'createdAt',
      label: 'Date',
      RenderComponent({ row }) {
        return <p> {showDate(row?.createdAt, true)} </p>;
      },
    },

    {
      key: 'actions',

      ActionButtons({ row }) {
        return (
          <Button
            onClick={() => onEditBtnClick(row)}
            variant="contained"
            title="Edit"
            size="small"
          >
            Edit
          </Button>
        );
      },
    },
  ];
  return cells;
}
