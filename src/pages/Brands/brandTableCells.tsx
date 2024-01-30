import { Button } from '@mui/material';
import { BrandT } from '../../data';
import { showDate } from '../../utils/date';

interface Props {
  onEditBtnClick: (b: BrandT) => void;
}

export default function brandTableCells({ onEditBtnClick }: Props) {
  const cells: MuiTableHeader<BrandT>[] = [
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
