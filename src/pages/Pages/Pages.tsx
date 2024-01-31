import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import pageTableCells from './pageTableCells';
import { Button } from '@mui/material';
import usePages from '../../hooks/react-query/usePages';
import { Link } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';

export default function Pages() {
  const axios = useAxiosPrivate();

  const { pages, fetchingPages, refetchPages } = usePages();

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/page/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchPages();
    }
  }

  return (
    <div>
      <br />

      <Breadcrumb pageName="Pages" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchPages}
          onDelete={onMultipleDelete}
          tableCells={pageTableCells()}
          rows={pages || []}
          loading={fetchingPages}
          tableTitle="Pages"
          deleting={deleting}
          CustomButton={
            <Link to="/add-page">
              <Button
                className="space-x-2 focus:ring focus:ring-offset-1"
                color="primary"
                variant="contained"
                size="large"
              >
                <FIcon icon="plus" />
                <span>Add New Page</span>
              </Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
