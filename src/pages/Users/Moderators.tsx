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

export default function Moderators() {
  const { showUserFormModal, selectedUser, setSelectedUser } = useGlobalState();
  const axios = useAxiosPrivate();

  const { data, refetch, isLoading } = useQuery<UserT[]>(
    ['fetchModerators'],
    async () => {
      const { data } = await axios.get(`/auth/moderators/all`);
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

  return (
    <div>
      <AddEditUserPopup editItem={selectedUser} openModal={showUserFormModal} />

      <Breadcrumb pageName="Moderatos & Admin" />
      <br />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetch}
          onDelete={onMultipleDelete}
          tableCells={usersTableCells}
          rows={data || []}
          loading={isLoading}
          tableTitle="Moderators"
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
