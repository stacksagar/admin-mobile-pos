import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import barcodeTableCells from './barcodeTableCells';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { BarcodeT } from '../../data';
import { Button } from '@mui/material';
import AddBarcodeModal from './AddBarcodeModal';

export default function BarcodePrint() {
  const axios = useAxiosPrivate();
  const showCarcodeModal = useBoolean();

  const { data, refetch, isLoading } = useQuery<BarcodeT[]>(
    ['fetchBarcodes'],
    async () => {
      const { data } = await axios.get(`/barcode/all`);
      return data || [];
    }
  );

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/barcode/multiple', { data: { ids } }),
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
      <AddBarcodeModal openModal={showCarcodeModal} onSuccess={refetch} />
      <Breadcrumb pageName="Barcode Print" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetch}
          onDelete={onMultipleDelete}
          tableCells={barcodeTableCells}
          rows={data || []}
          loading={isLoading}
          CustomButton={
            <Button onClick={showCarcodeModal.toggle} variant="contained">
              Add Barcode
            </Button>
          }
          tableTitle="Barcode Purchase Histories"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
