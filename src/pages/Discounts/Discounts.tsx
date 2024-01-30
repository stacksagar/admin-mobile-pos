import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import discountTableCells from './discountTableCells';
import useObject from '../../hooks/state/useObject';
import { DiscountT } from '../../data';
import { Button } from '@mui/material';
import AddDiscountPopup from './AddDiscountPopup';
import useDiscounts from '../../hooks/react-query/useDiscounts';

export default function Discounts() {
  const axios = useAxiosPrivate();

  const { discounts, fetchingDiscounts, refetchDiscounts } = useDiscounts();

  const deleting = useBoolean();
  const showAddDiscountPopup = useBoolean();
  const selectedItem = useObject({} as DiscountT);

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
      refetchDiscounts();
    }
  }

  return (
    <div>
      <br />

      <AddDiscountPopup
        openModal={showAddDiscountPopup}
        editItem={selectedItem.data}
        _finally={() => {
          refetchDiscounts();
        }}
      />
      <Breadcrumb pageName="Discounts" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchDiscounts}
          onDelete={onMultipleDelete}
          tableCells={discountTableCells({
            onEditBtnClick(v) {
              selectedItem.set(v);
              showAddDiscountPopup.setTrue();
            },
          })}
          rows={discounts || []}
          loading={fetchingDiscounts}
          tableTitle="Discounts"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showAddDiscountPopup?.toggle();
                selectedItem.set({} as DiscountT);
              }}
              variant="contained"
            >
              Add Discount
            </Button>
          }
        />
      </div>
    </div>
  );
}
