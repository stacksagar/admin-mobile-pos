import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import brandTableCells from './brandTableCells';
import AddBrandPopup from './AddBrandPopup';
import useObject from '../../hooks/state/useObject';
import { BrandT } from '../../data';
import { Button } from '@mui/material';
import useBrands from '../../hooks/react-query/useBrands';

export default function Brands() {
  const axios = useAxiosPrivate();

  const { brands, fetchingBrands, refetchBrands } = useBrands();

  const deleting = useBoolean();
  const showAddBrandPopup = useBoolean();
  const selectedItem = useObject({} as BrandT);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/brand/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchBrands();
    }
  }

  return (
    <div>
      <br />

      <AddBrandPopup
        openModal={showAddBrandPopup}
        editItem={selectedItem.data}
        _finally={refetchBrands}
      />
      <Breadcrumb pageName="Brands" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchBrands}
          onDelete={onMultipleDelete}
          tableCells={brandTableCells({
            onEditBtnClick(b) {
              selectedItem.set(b);
              showAddBrandPopup.setTrue();
            },
          })}
          rows={brands || []}
          loading={fetchingBrands}
          tableTitle="Brands"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showAddBrandPopup?.toggle();
                selectedItem.set({} as BrandT);
              }}
              variant="contained"
            >
              Add Brand
            </Button>
          }
        />
      </div>
    </div>
  );
}
