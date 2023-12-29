import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import useBoolean from '../../hooks/state/useBoolean';
import { fetchStockInProducts } from '../../app/features/products/requests';
import toast_async from '../../utils/toast_async';
import { axios_private } from '../../api/api';
import { removeProducts } from '../../app/features/products/stockInProductsSlice';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import productsTableCells from './productsTableCells';
import makeToSerialize from '../../utils/makeToSerialize';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

export default function Users() {
  const {
    data: products,
    loading,
    currentPage,
    limit,
  } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const deleting = useBoolean();

  useEffect(() => {
    dispatch(
      fetchStockInProducts({
        limit: 10,
        page: 1,
      })
    );
  }, [dispatch]);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios_private.delete('/product/delete-multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );

      dispatch(removeProducts(ids));
    } finally {
      deleting.setFalse();
    }
  }

  return (
    <div>
      <Breadcrumb pageName="Products" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={() => dispatch(fetchStockInProducts(null))}
          onDelete={onMultipleDelete}
          tableCells={productsTableCells}
          rows={makeToSerialize(products, currentPage, limit)}
          loading={loading}
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
