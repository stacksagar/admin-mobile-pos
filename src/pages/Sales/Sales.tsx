import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import saleTableCells from './saleTableCells';
import useSales from '../../hooks/react-query/useSales';
import { SaleT, UserT } from '../../data';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import { useState } from 'react';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import useObject from '../../hooks/state/useObject';
import useCustomers from '../../hooks/react-query/useCustomers';

export default function Sales() {
  const axios = useAxiosPrivate();

  const { sales, refetchSales, fetchingSales } = useSales();

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/sale/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchSales();
    }
  }

  const loading = useBoolean();
  const showReturnWarning = useBoolean();
  const [sale, setSale] = useState({} as SaleT);
  async function handleReturn() {
    loading.setTrue();
    try {
      if (sale?.with_variant) {
        await axios.put(`/product/return-imei/${sale?.productId}`, {
          properties: sale.properties,
        });
      } else {
        await axios.put(`/product/return/${sale?.productId}`, {
          quantity: sale?.quantity,
        });
      }

      await axios.delete(`/sale/${sale?.id}`);

      await axios.put(`/customer/remove-amount/${sale?.customerId}`, {
        paid: sale?.paid,
        due: sale?.due,
      });

      toast({
        message: 'Refund Successfull!',
      });
    } catch (error) {
      toast({
        message: error_message(error),
        type: 'error',
      });
    } finally {
      showReturnWarning.setFalse();
      loading.setFalse();
      refetchSales();
    }
  }

  function handleReturnButton(sale: SaleT) {
    setSale(sale);
    showReturnWarning.toggle();
  }

  const { customers } = useCustomers();
  const selectedCustomer = useObject({} as UserT);

  return (
    <div>
      <br />

      <Breadcrumb pageName="Sales" />

      <MuiConfirmationDialog
        warningText={`Want to refund this product?`}
        warningSubText="Also, the customer amount will be removed, Which is included with this sale!"
        showModal={showReturnWarning}
        confirmButtonText="Confirm Return"
        onConfirm={handleReturn}
        loading={loading.true}
      />

      <div className="max-w-full overflow-hidden">
        <div className="rounded bg-white p-2">
          <MuiSearchSelect
            label={selectedCustomer?.data?.name || 'Select Customer'}
            defaultTitle={selectedCustomer?.data?.name || null}
            options={customers || []}
            titleKey="name"
            onChange={selectedCustomer.set}
          />
        </div>
        <MuiTable
          onRefreshData={refetchSales}
          onDelete={onMultipleDelete}
          tableCells={saleTableCells(handleReturnButton)}
          // rows={sales || []}
          rows={
            (selectedCustomer?.data?.id
              ? sales?.filter(
                  (item) => item.customerId === selectedCustomer?.data?.id
                )
              : sales) || []
          }
          loading={fetchingSales}
          tableTitle="Sales"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
