import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import supplierHistoriesTableCells from './supplierHistoriesTableCells';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { SupplierHistoryT } from '../../data';

export default function SupplierHistories() {
  const axios = useAxiosPrivate();

  const { data, refetch, isLoading } = useQuery<SupplierHistoryT[]>(
    ['fetchSupplierHistory'],
    async () => {
      const { data } = await axios.get(`/supplier-history/all`);
      return data || [];
    }
  );

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/supplier-history/multiple', { data: { ids } }),
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
      <Breadcrumb pageName="Purchased Histories" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetch}
          onDelete={onMultipleDelete}
          tableCells={supplierHistoriesTableCells}
          rows={data || []}
          loading={isLoading}
          tableTitle="Supplier Purchase Histories"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
