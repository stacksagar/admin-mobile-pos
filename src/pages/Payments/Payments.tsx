import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import paymentTableCells from './paymentTableCells';
import AddPaymentPopup from './AddPaymentPopup';
import useObject from '../../hooks/state/useObject';
import { PaymentT } from '../../data';
import { Button } from '@mui/material';
import usePaymentMethods from '../../hooks/react-query/usePaymentMethods';

export default function Payments() {
  const axios = useAxiosPrivate();

  const { paymentMethods, refetchMethods, fetchingMethods } =
    usePaymentMethods();

  const deleting = useBoolean();
  const showAddPaymentPopup = useBoolean();
  const selectedItem = useObject({} as PaymentT);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/payment/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchMethods();
    }
  }

  return (
    <div>
      <br />

      <AddPaymentPopup
        openModal={showAddPaymentPopup}
        editItem={selectedItem.data}
        _finally={() => {
          refetchMethods();
        }}
      />
      <Breadcrumb pageName="Payments" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchMethods}
          onDelete={onMultipleDelete}
          tableCells={paymentTableCells({
            onEditBtnClick(b) {
              selectedItem.set(b);
              showAddPaymentPopup.setTrue();
            },
          })}
          rows={paymentMethods || []}
          loading={fetchingMethods}
          tableTitle="Payments"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showAddPaymentPopup?.toggle();
                selectedItem.set({} as PaymentT);
              }}
              variant="contained"
            >
              Add Payment
            </Button>
          }
        />
      </div>
    </div>
  );
}
