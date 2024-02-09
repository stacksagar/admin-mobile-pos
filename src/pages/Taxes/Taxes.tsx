import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import vatTableCells from './taxTableCells';
import useTaxes from '../../hooks/react-query/useTaxes';

export default function Taxes() {
  const axios = useAxiosPrivate();

  const { taxes, fetchingTaxes, refetchTaxes } = useTaxes();

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(axios.delete('/vat/multiple', { data: { ids } }), {
        start: 'Deleting.. wait a moment!',
        success: `Successfully deleted ${ids?.length} items!`,
        error: '',
      });
    } finally {
      deleting.setFalse();
      refetchTaxes();
    }
  }

  return (
    <div>
      <Breadcrumb pageName="Taxes" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchTaxes}
          onDelete={onMultipleDelete}
          tableCells={vatTableCells()}
          rows={taxes || []}
          loading={fetchingTaxes}
          tableTitle="Taxes"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
