import { Button } from '@mui/material';
import { CategoryT } from '../../data';
import { showDate } from '../../utils/date';

interface Props {
  onEditBtnClick: (b: CategoryT) => void;
}

export default function categoryTableCells({ onEditBtnClick }: Props) {
  const cells: MuiTableHeader<CategoryT>[] = [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'name',
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
