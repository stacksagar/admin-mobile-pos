import { useAppDispatch, useAppSelector } from '../../app/store';
import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { fetchSuppliers } from '../../app/features/suppliers/requests';
import { GridColDef } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import useFetchWithPagination from '../../hooks/redux/useFetchWithPagination';
import Breadcrumb from '../../components/Breadcrumb';
import AddSupplierPopup from './AddSupplierPopup';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { axios_private } from '../../api/api';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import {
  removeSupplier,
  removeSuppliers,
} from '../../app/features/suppliers/supplierSlice';
import { useState } from 'react';
import { showDate } from '../../utils/date';
import makeToSerialize from '../../utils/makeToSerialize';
import { SupplierT } from '../../data';
import FIcon from '../../common/Icons/FIcon';
import MuiContentModal from '../../common/MaterialUi/Modal/MuiContentModal';
import SupplierHistories from './SupplierHistories';

export default function Suppliers() {
  const appDispatch = useAppDispatch();
  const {
    data: suppliers,
    limit,
    currentPage,
    totalItems,
    totalPages,
    loading,
  } = useAppSelector((s) => s.suppliers);

  const { changePage } = useFetchWithPagination({
    data: suppliers,
    fetchFunc: fetchSuppliers,
  });

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();
  const [editItem, setEditItem] = useState<SupplierT>({} as SupplierT);

  const showAddSupplierPopup = useBoolean(false);
  const showSupplierHistories = useBoolean(false);

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();
  async function deleteMultipleItems() {
    selectedDeleting.setTrue();
    try {
      await axios_private.delete('/supplier/delete-multiples', {
        data: { ids: selectedID || selectedIds },
      });

      selectedID
        ? appDispatch(removeSupplier(selectedID))
        : appDispatch(removeSuppliers(selectedIds));

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
    { field: 'company_name', headerName: 'Company Name', width: 200 },
    {
      field: 'supplier_name',
      headerName: 'Supplier Name',
      width: 150,
      renderCell(params) {
        return (
          <div>
            <p> {params.row.supplier_name} </p>

            {params?.row?.phone ? (
              <a href={`tel:${params?.row?.phone}`}>
                {params.row.phone}
                <IconButton size="small">
                  <FIcon icon="phone" />
                </IconButton>
              </a>
            ) : null}
          </div>
        );
      },
    },
    { field: 'address', headerName: 'Address', width: 110 },

    {
      field: 'total_puchase_amount',
      headerName: 'Total Puchase Amount',
      width: 110,
    },

    { field: 'total_paid', headerName: 'Total Paid', width: 110 },
    { field: 'total_due', headerName: 'Total Due', width: 110 },

    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 300,

      renderCell(params) {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="contained"
              title="Edit"
              size="small"
              onClick={() => {
                showAddSupplierPopup.setTrue();
                setEditItem(params.row);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              title="View"
              color="info"
              size="small"
              onClick={() => {
                setSelectedID(params?.id || '');
                showSupplierHistories.setTrue();
              }}
            >
              View
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
      <Breadcrumb pageName="Suppliers" />

      <AddSupplierPopup openModal={showAddSupplierPopup} editItem={editItem} />

      <MuiContentModal
        title={'Supplier Purchase Histories'}
        openModal={showSupplierHistories}
      >
        <SupplierHistories supplierID={selectedID} />
      </MuiContentModal>

      <MuiConfirmationDialog
        loading={selectedDeleting.true}
        showModal={showSelectedDeletePopup}
        warningText={
          selectedID
            ? 'Want to delete supplier?'
            : `Want to delete all selected '${selectedIds?.length}' suppliers?`
        }
        onConfirm={deleteMultipleItems}
        confirmButtonText={selectedID ? 'Delete' : 'Delete All'}
      />

      <MaterialTableServer
        // -- data
        data={makeToSerialize(suppliers, currentPage, limit)}
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
        addNewText={'Add New Supplier'}
        addNewHandler={() => {
          showAddSupplierPopup.setTrue();
          setEditItem({} as SupplierT);
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
