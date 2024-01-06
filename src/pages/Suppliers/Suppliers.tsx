import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import usersTableCells from './suppliersTableCells';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { useGlobalState } from '../../context/globalState';
import AddEditSupplierPopup from './AddEditSupplierPopup';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { SupplierT } from '../../data';
import SupplierHistories from './SupplierHistories';
import MuiContentModal from '../../common/MaterialUi/Modal/MuiContentModal';

export default function Users() {
  const { selectedItem, setSelectedItem, selectedID, isShow, isShow2 } =
    useGlobalState();
  const axios = useAxiosPrivate();

  const { data, refetch, isLoading } = useQuery<SupplierT[]>(
    ['fetchSuppliers'],
    async () => {
      const { data } = await axios.get(`/supplier/all`);
      return data || [];
    }
  );

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/supplier/multiple', { data: { ids } }),
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

  useEffect(() => {
    refetch();
  }, [isShow2]);

  useEffect(() => {
    console.log('selectedItem ', selectedItem);
  }, [selectedItem]);

  return (
    <div>
      <AddEditSupplierPopup openModal={isShow2} editItem={selectedItem} />

      <br />

      <Breadcrumb pageName="Suppliers" />

      <MuiContentModal title={'Supplier Purchase Histories'} openModal={isShow}>
        <SupplierHistories supplierID={selectedID} />
      </MuiContentModal>

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetch}
          onDelete={onMultipleDelete}
          tableCells={usersTableCells}
          rows={data || []}
          loading={isLoading}
          tableTitle="Suppliers"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                isShow2?.toggle();
                setSelectedItem({});
              }}
              variant="contained"
            >
              Add Supplier
            </Button>
          }
        />
      </div>
    </div>
  );
}
