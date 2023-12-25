import { useAppDispatch, useAppSelector } from '../../app/store';
import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { fetchVats } from '../../app/features/vats/requests';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import useFetchWithPagination from '../../hooks/redux/useFetchWithPagination';
import Breadcrumb from '../../components/Breadcrumb';
import AddVatPopup from './AddVatPopup';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { axios_private } from '../../api/api';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import { removeVat, removeVats } from '../../app/features/vats/vatSlice';
import { useState } from 'react'; 
import isAmountOrPercent from '../../utils/isAmountOrPercent';
import makeToSerialize from '../../utils/makeToSerialize';

export default function Vats() {
  const appDispatch = useAppDispatch();
  const {
    data: vats,
    limit,
    currentPage,
    totalItems,
    totalPages,
    loading,
  } = useAppSelector((s) => s.vats);

  const { changePage } = useFetchWithPagination({
    data: vats,
    fetchFunc: fetchVats,
  });

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();
  const [editItem, setEditItem] = useState<Vat>({} as Vat);

  const showAddVatPopup = useBoolean(false);

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();

  async function deleteMultipleItems() {
    selectedDeleting.setTrue();
    try {
      await axios_private.delete('/vat/delete-multiples', {
        data: { ids: selectedID || selectedIds },
      });

      selectedID
        ? appDispatch(removeVat(selectedID))
        : appDispatch(removeVats(selectedIds));

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
    { field: 'sl', headerName: 'SL', width: 100 },

    { field: 'name', headerName: 'Vat Name', width: 200 },
    {
      field: 'value',
      headerName: 'Vat Value',
      width: 200,

      renderCell(params) {
        return (
          <div>
            {params?.row?.value} {isAmountOrPercent(params?.row?.type)}
          </div>
        );
      },
    },
    { field: 'type', headerName: 'Vat By', width: 200 },

    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 400,

      renderCell(params) {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="contained"
              title="Edit"
              size="small"
              onClick={() => {
                showAddVatPopup.setTrue();
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
      <Breadcrumb pageName="Vats" />

      <AddVatPopup openModal={showAddVatPopup} editItem={editItem} />

      <MuiConfirmationDialog
        loading={selectedDeleting.true}
        showModal={showSelectedDeletePopup}
        warningText={
          selectedID
            ? 'Want to delete vat?'
            : `Want to delete all selected '${selectedIds?.length}' vats?`
        }
        onConfirm={deleteMultipleItems}
        confirmButtonText={selectedID ? 'Delete' : 'Delete All'}
      />

      <MaterialTableServer
        // -- data 
        data={makeToSerialize(vats, currentPage, limit)}
        filterKeys={['name']}
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
        addNewText={'Add New Vat'}
        addNewHandler={() => {
          showAddVatPopup.setTrue();
          setEditItem({} as Vat);
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
