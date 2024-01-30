import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import vatTableCells from './vatTableCells';
import useVats from '../../hooks/react-query/useVats';
import AddVatPopup from './AddVatPopup';
import useObject from '../../hooks/state/useObject';
import { VatT } from '../../data';
import { Button } from '@mui/material';

export default function Vats() {
  const axios = useAxiosPrivate();

  const { vats, fetchingVats, refetchVats } = useVats();

  const deleting = useBoolean();
  const showAddVatPopup = useBoolean();
  const selectedItem = useObject({} as VatT);

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
      refetchVats();
    }
  }

  return (
    <div>
      <br />

      <AddVatPopup
        openModal={showAddVatPopup}
        editItem={selectedItem.data}
        _finally={() => {
          refetchVats();
        }}
      />
      <Breadcrumb pageName="Vats" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchVats}
          onDelete={onMultipleDelete}
          tableCells={vatTableCells({
            onEditBtnClick(v) {
              selectedItem.set(v);
              showAddVatPopup.setTrue();
            },
          })}
          rows={vats || []}
          loading={fetchingVats}
          tableTitle="Vats"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showAddVatPopup?.toggle();
                selectedItem.set({} as VatT);
              }}
              variant="contained"
            >
              Add Vat
            </Button>
          }
        />
      </div>
    </div>
  );
}
