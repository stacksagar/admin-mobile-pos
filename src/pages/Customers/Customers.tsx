import { useAppDispatch, useAppSelector } from '../../app/store';
import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { fetchCustomers } from '../../app/features/customers/requests';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import useFetchWithPagination from '../../hooks/redux/useFetchWithPagination';
import Breadcrumb from '../../components/Breadcrumb';
import AddCustomerPopup from './AddCustomerPopup';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { axios_private } from '../../api/api';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import {
  removeCustomer,
  removeCustomers,
} from '../../app/features/customers/customerSlice';
import { useState } from 'react';
import { showDate } from '../../utils/date';
import makeToSerialize from '../../utils/makeToSerialize';

export default function Customers() {
  const appDispatch = useAppDispatch();
  const {
    data: customers,
    limit,
    currentPage,
    totalItems,
    totalPages,
    loading,
  } = useAppSelector((s) => s.customers);

  const { changePage } = useFetchWithPagination({
    data: customers,
    fetchFunc: fetchCustomers,
  });

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();
  const [editItem, setEditItem] = useState<Customer>({} as Customer);

  const showAddCustomerPopup = useBoolean(false);

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();
  async function deleteMultipleItems() {
    selectedDeleting.setTrue();
    try {
      await axios_private.delete('/customer/delete-multiples', {
        data: { ids: selectedID || selectedIds },
      });

      selectedID
        ? appDispatch(removeCustomer(selectedID))
        : appDispatch(removeCustomers(selectedIds));

      toast({ message: 'Successfully Deleted!' });
    } catch (error) {
      toast({
        message: error_message(error),
      });
    } finally {
      showSelectedDeletePopup.setFalse();
      selectedDeleting.setFalse();
    }
  }

  const columns: GridColDef[] = [
    { field: 'sl', headerName: 'SL', width: 10 },
    {
      field: 'createdAt',
      headerName: 'Date',
      renderCell(params) {
        return <div> {showDate(params.row?.createdAt, true)} </div>;
      },
    },

    { field: 'name', headerName: 'Name', width: 110 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 110 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'due', headerName: 'Due', width: 200 },

    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 200,

      renderCell(params) {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="contained"
              title="Edit"
              size="small"
              onClick={() => {
                showAddCustomerPopup.setTrue();
                setEditItem(params.row);
              }}
            >
              Edit
            </Button>
            <Button
              title="Delete"
              variant="contained"
              size="small"
              color="error"
              onClick={() => {
                setSelectedID(params?.id || '');
                showSelectedDeletePopup.setTrue();
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Breadcrumb pageName="Customers" />

      <AddCustomerPopup openModal={showAddCustomerPopup} editItem={editItem} />

      <MuiConfirmationDialog
        loading={selectedDeleting.true}
        showModal={showSelectedDeletePopup}
        warningText={
          selectedID
            ? 'Want to delete customer?'
            : `Want to delete all selected '${selectedIds?.length}' customers?`
        }
        onConfirm={deleteMultipleItems}
        confirmButtonText={selectedID ? 'Delete' : 'Delete All'}
      />

      <MaterialTableServer
        // -- data
        data={makeToSerialize(customers, currentPage, limit)}
        filterKeys={['name', 'email']}
        columns={columns}
        onChangeSelected={onChangeSelected}
        // -- pagination options
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        changePage={changePage}
        limit={limit}
        loading={loading}
        // -- buttons/handlers
        addNewText={'Add New Customer'}
        addNewHandler={() => {
          showAddCustomerPopup.setTrue();
          setEditItem({} as Customer);
        }}
        // filterHandler={() => {}}
        // downloadHandler={() => {}}

        multipleDeleteHandler={() => {
          setSelectedID(null);
          showSelectedDeletePopup.setTrue();
        }}
        showMultipleDeleteHandler={selectedIds.length > 0}
      />
    </div>
  );
}
