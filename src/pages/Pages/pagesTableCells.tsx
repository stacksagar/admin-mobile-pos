import { Button } from '@mui/material';
import ButtonWithCopy from '../../common/Buttons/ButtonWithCopy';
import { Link } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';
const pagesTableCells: MuiTableHeader<Page>[] = [
  {
    key: 'id',
    label: 'Page ID',
    RenderComponent({ row }) {
      return <ButtonWithCopy value={row.id.toString()} showValue />;
    },
  },
  {
    key: 'name',
  },
  {
    key: 'actions',
    ActionButtons({ row }) {
      return (
        <>
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
        </>
      );
    },
  },
];

export default pagesTableCells;
