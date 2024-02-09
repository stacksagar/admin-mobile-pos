import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import supplierHistoriesTableCells from './supplierHistoriesTableCells';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { SupplierHistoryT, SupplierT } from '../../data';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import useObject from '../../hooks/state/useObject';
import useSuppliers from '../../hooks/react-query/useSuppliers';
import PaidSupplierPopup from './PaidSupplierPopup';
import useSupplierHistories from '../../hooks/react-query/useSuppliersHistories';
export default function SupplierHistories() {
  const axios = useAxiosPrivate();

  const {
    supplierHistories,
    refetchSupplierHistories,
    fetchingSupplierHistories,
  } = useSupplierHistories();

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
      refetchSupplierHistories();
    }
  }

  const { suppliers } = useSuppliers();
  const selectedSupplier = useObject({} as SupplierT);

  const openPaidPopupSupplier = useBoolean();
  const selectedSupplierHistory = useObject({} as SupplierHistoryT);

  function toggleAddPopupBtn(history: SupplierHistoryT) {
    selectedSupplierHistory.set(history);
    openPaidPopupSupplier.toggle();
  }

  return (
    <div>
      <Breadcrumb pageName="Purchased Histories" />
      <PaidSupplierPopup
        openModal={openPaidPopupSupplier}
        history={selectedSupplierHistory.data}
        _finally={refetchSupplierHistories}
      />
      <br />

      <div className="max-w-full overflow-hidden">
        <div className="rounded bg-white p-2">
          <MuiSearchSelect
            label={selectedSupplier?.data?.supplier_name || 'Select Supplier'}
            defaultTitle={selectedSupplier?.data?.supplier_name || null}
            options={suppliers || []}
            titleKey="supplier_name"
            onChange={selectedSupplier.set}
          />
        </div>

        <MuiTable
          onRefreshData={refetchSupplierHistories}
          onDelete={onMultipleDelete}
          tableCells={supplierHistoriesTableCells({ toggleAddPopupBtn })}
          rows={
            (selectedSupplier?.data?.id
              ? supplierHistories?.filter(
                  (item) => item.supplierId === selectedSupplier?.data?.id
                )
              : supplierHistories) || []
          }
          loading={fetchingSupplierHistories}
          tableTitle="Supplier Purchase Histories"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
