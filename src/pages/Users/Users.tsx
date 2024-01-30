import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import usersTableCells from './usersTableCells';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { useGlobalState } from '../../context/globalState';
import AddEditUserPopup from './AddEditUserPopup';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import { UserT } from '../../data';
import filterItems from '../../utils/filterItems';
import useString from '../../hooks/state/useString';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';

export default function Users() {
  const { showUserFormModal, selectedUser, setSelectedUser } = useGlobalState();
  const axios = useAxiosPrivate();

  const { data, refetch, isLoading } = useQuery<UserT[]>(
    ['fetchUsers'],
    async () => {
      const { data } = await axios.get(`/auth/user/all`);
      return data || [];
    }
  );

  const deleting = useBoolean();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(axios.delete('/auth/user', { data: { ids } }), {
        start: 'Deleting.. wait a moment!',
        success: `Successfully deleted ${ids?.length} items!`,
        error: '',
      });
    } finally {
      deleting.setFalse();
      refetch();
    }
  }

  useEffect(() => {
    refetch();
  }, [showUserFormModal]);

  const searchTerm = useString('');

  return (
    <div>
      <AddEditUserPopup editItem={selectedUser} openModal={showUserFormModal} />
      <Breadcrumb pageName="Users" />
      <br />

      <div className="max-w-full overflow-hidden">
        <div className="bg-white p-2">
          <MuiTextField
            label="Search user"
            value={searchTerm.value}
            onChange={searchTerm.change}
          />
        </div>
        <MuiTable
          onRefreshData={refetch}
          onDelete={onMultipleDelete}
          tableCells={usersTableCells}
          rows={filterItems(data, searchTerm.value)}
          loading={isLoading}
          tableTitle="Users"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showUserFormModal?.toggle();
                setSelectedUser({} as UserT);
              }}
              variant="contained"
            >
              Add User
            </Button>
          }
        />
      </div>
    </div>
  );
}
