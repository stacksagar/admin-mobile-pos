import { Button } from '@mui/material';
import { PageT } from '../../data';
import { showDate } from '../../utils/date';
import { Link } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';

export default function pageTableCells() {
  const cells: MuiTableHeader<PageT>[] = [
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
          <Link to={`/edit-page?id=${row?.id}`}>
            <Button
              className="space-x-2 focus:ring focus:ring-offset-1"
              color="primary"
              variant="contained"
              size="small"
            >
              <FIcon icon="pencil" />
              <span>Edit</span>
            </Button>
          </Link>
        );
      },
    },
  ];
  return cells;
}
