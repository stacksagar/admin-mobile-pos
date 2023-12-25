import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import useBoolean from '../../hooks/state/useBoolean';
import { fetchOrders } from '../../app/features/orders/requests';
import toast_async from '../../utils/toast_async';
import { axios_private } from '../../api/api';
import { removeOrders } from '../../app/features/orders/orderSlice';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import ordersTableCells from './ordersTableCells';
import makeToSerialize from '../../utils/makeToSerialize';

export default function Users() {
  const {
    data: orders,
    loading,
    currentPage,
    limit,
  } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();
  const deleting = useBoolean();

  useEffect(() => {
    dispatch(
      fetchOrders({
        limit: 10,
        page: 1,
      })
    );
  }, [dispatch]);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios_private.delete('/order/delete-multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );

      dispatch(removeOrders(ids));
    } finally {
      deleting.setFalse();
    }
  }

  return (
    <div>
      <Breadcrumb pageName="Orders" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={() => dispatch(fetchOrders(null))}
          onDelete={onMultipleDelete}
          tableCells={ordersTableCells}
          rows={makeToSerialize(orders, currentPage, limit)}
          loading={loading}
          tableTitle="Orders"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
