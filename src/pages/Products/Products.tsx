import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import { axios_private } from '../../api/api';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import productsTableCells from './productsTableCells';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { ProductT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';

export default function Users() {
  const axios = useAxiosPrivate();
  const deleting = useBoolean();

  const { data, refetch, isLoading } = useQuery<ProductT[]>(
    ['fetchStockInProducts'],
    async () => {
      try {
        const { data } = await axios.get(`/product/stock-in/all`);
        return data || [];
      } catch (error) {
        console.log('error ', error);
      }
    }
  );

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();

    try {
      await toast_async<any>(
        axios_private.delete('/product/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetch();
    }
  }

  return (
    <div>
      <Breadcrumb pageName="Products" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetch}
          onDelete={onMultipleDelete}
          tableCells={productsTableCells}
          rows={data || []}
          loading={isLoading}
          CustomButton={
            <Button variant="contained" size="medium">
              <Link to="/add-product"> Buy Product </Link>
            </Button>
          }
          tableTitle="Products"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
