import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import vatTableCells from './paymentHistoriesTableCells';
import usePaymentHistories from '../../hooks/react-query/usePaymentHistories';

export default function PaymentHistories() {
  const axios = useAxiosPrivate();

  const {
    paymenthistories,
    fetchingPaymentHistories,
    refetchPaymentHistories,
  } = usePaymentHistories();

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/payment-history/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchPaymentHistories();
    }
  }

  return (
    <div>
      <Breadcrumb pageName="Payment Paid/Due Histories" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchPaymentHistories}
          onDelete={onMultipleDelete}
          tableCells={vatTableCells()}
          rows={paymenthistories || []}
          loading={fetchingPaymentHistories}
          tableTitle="Payment Histories"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
