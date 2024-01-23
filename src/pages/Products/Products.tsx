import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import { axios_private } from '../../api/api';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import productsTableCells from './productsTableCells';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import useProducts from '../../hooks/react-query/useProducts';
import { useEffect } from 'react';

export default function Users() {
  const deleting = useBoolean();

  const { products, refetchProducts, fetchingProducts } = useProducts();

  useEffect(() => {
    console.log('products ', products);
  }, [products]);

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
      refetchProducts();
    }
  }

  return (
    <div>
      <Breadcrumb pageName="Products" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchProducts}
          onDelete={onMultipleDelete}
          tableCells={productsTableCells}
          rows={products || []}
          loading={fetchingProducts}
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
