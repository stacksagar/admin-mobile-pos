import { Button } from '@mui/material';
import { VatT } from '../../data';
import { showDate } from '../../utils/date';

interface Props {
  onEditBtnClick: (v: VatT) => void;
}

export default function vatTableCells({ onEditBtnClick }: Props) {
  const cells: MuiTableHeader<VatT>[] = [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'name',
    },
    {
      key: 'type',
      RenderComponent({ row }) {
        return (
          <div>
            <small>{row.type === 'percentage' ? '%' : 'amount'} </small>
            {row.value}
          </div>
        );
      },
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
