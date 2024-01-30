import { Button } from '@mui/material';
import { ExpenseT } from '../../data';
import { showDate } from '../../utils/date';

interface Props {
  onEditBtnClick: (b: ExpenseT) => void;
}

export default function expenseTableCells({ onEditBtnClick }: Props) {
  const cells: MuiTableHeader<ExpenseT>[] = [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'name',
    },

    {
      key: 'category',
      RenderComponent({ row }) {
        return <div> {row?.category} </div>;
      },
    },

    {
      key: 'cost',
      RenderComponent({ row }) {
        return <div> {row?.cost} </div>;
      },
    },

    {
      key: 'createdAt',
      label: 'Salary Date',
      RenderComponent({ row }) {
        return <p> {showDate(row?.date, true)} </p>;
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
