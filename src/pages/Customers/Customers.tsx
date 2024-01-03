import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import customersTableCells from './customersTableCells';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { useGlobalState } from '../../context/globalState';
import AddCustomerPopup from './AddCustomerPopup';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { UserT } from '../../data';

export default function Customers() {
  const { showCustomerFormModal, selectedUser, setSelectedUser } =
    useGlobalState();
  const axios = useAxiosPrivate();

  const { data, refetch, isLoading } = useQuery<UserT[]>(
    ['fetchCustomers'],
    async () => {
      const { data } = await axios.get(`/customer/all`);
      return data || [];
    }
  );

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/auth/customer', { data: { ids } }),
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
  }, [showCustomerFormModal]);

  return (
    <div>
      <AddCustomerPopup
        editItem={selectedUser}
        openModal={showCustomerFormModal}
      />

      <Breadcrumb pageName="Purchased Histories" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetch}
          onDelete={onMultipleDelete}
          tableCells={customersTableCells}
          rows={data || []}
          loading={isLoading}
          tableTitle="Supplier Purchase Histories"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showCustomerFormModal?.toggle();
                setSelectedUser({} as UserT);
              }}
              variant="contained"
            >
              Add Customer
            </Button>
          }
        />
      </div>
    </div>
  );
}
