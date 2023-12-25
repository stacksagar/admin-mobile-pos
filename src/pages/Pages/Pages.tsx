import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import useBoolean from '../../hooks/state/useBoolean';
import { fetchPages } from '../../app/features/pages/requests';
import toast_async from '../../utils/toast_async';
import { axios_private } from '../../api/api';
import { removePages } from '../../app/features/pages/pagesSlice';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import pagesTableCells from './pagesTableCells';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';

export default function Pages() {
  const { data: pages, loading } = useAppSelector((state) => state.pages);
  const dispatch = useAppDispatch();
  const deleting = useBoolean();

  useEffect(() => {
    dispatch(fetchPages(null));
  }, [dispatch]);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(axios_private.delete('/page', { data: { ids } }), {
        start: 'Deleting.. wait a moment!',
        success: `Successfully deleted ${ids?.length} items!`,
        error: '',
      });
      dispatch(removePages(ids));
    } finally {
      deleting.setFalse();
    }
  }

  return (
    <div>
      <Breadcrumb pageName="Pages" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={() => dispatch(fetchPages(null))}
          onDelete={onMultipleDelete}
          tableCells={pagesTableCells}
          rows={pages}
          loading={loading}
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
