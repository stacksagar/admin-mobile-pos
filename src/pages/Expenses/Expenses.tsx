import { useAppDispatch, useAppSelector } from '../../app/store';
import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { fetchExpenses } from '../../app/features/expenses/requests';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import useFetchWithPagination from '../../hooks/redux/useFetchWithPagination';
import Breadcrumb from '../../components/Breadcrumb';
import AddExpensePopup from './AddExpensePopup';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { axios_private } from '../../api/api';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import {
  removeExpense,
  removeExpenses,
} from '../../app/features/expenses/expenseSlice';
import { useState } from 'react';
import { showDate } from '../../utils/date';
import makeToSerialize from '../../utils/makeToSerialize';

export default function Expenses() {
  const appDispatch = useAppDispatch();
  const {
    data: expenses,
    limit,
    currentPage,
    totalItems,
    totalPages,
    loading,
  } = useAppSelector((s) => s.expenses);

  const { changePage } = useFetchWithPagination({
    data: expenses,
    fetchFunc: fetchExpenses,
  });

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();
  const [editItem, setEditItem] = useState<Expense>({} as Expense);

  const showAddExpensePopup = useBoolean(false);

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();
  async function deleteMultipleItems() {
    selectedDeleting.setTrue();
    try {
      await axios_private.delete('/expense/delete-multiples', {
        data: { ids: selectedID || selectedIds },
      });

      selectedID
        ? appDispatch(removeExpense(selectedID))
        : appDispatch(removeExpenses(selectedIds));

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
      field: 'date',
      headerName: 'Expense Date',
      renderCell(params) {
        return <div> {showDate(params.row?.date, true)} </div>;
      },
    },
    { field: 'name', headerName: 'Expense Name', width: 200 },
    { field: 'category', headerName: 'Expense Category', width: 200 },
    { field: 'cost', headerName: 'Total Cost', width: 200 },

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
                showAddExpensePopup.setTrue();
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
      <Breadcrumb pageName="Expenses" />

      <AddExpensePopup openModal={showAddExpensePopup} editItem={editItem} />

      <MuiConfirmationDialog
        loading={selectedDeleting.true}
        showModal={showSelectedDeletePopup}
        warningText={
          selectedID
            ? 'Want to delete expense?'
            : `Want to delete all selected '${selectedIds?.length}' expenses?`
        }
        onConfirm={deleteMultipleItems}
        confirmButtonText={selectedID ? 'Delete' : 'Delete All'}
      />

      <MaterialTableServer
        // -- data
        data={makeToSerialize(expenses, currentPage, limit)}
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
        addNewText={'Add New Expense'}
        addNewHandler={() => {
          showAddExpensePopup.setTrue();
          setEditItem({} as Expense);
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
