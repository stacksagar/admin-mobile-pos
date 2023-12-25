import { useAppDispatch, useAppSelector } from '../../app/store';
import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { fetchExpensesCategories } from '../../app/features/expenses/requests';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import useFetchWithPagination from '../../hooks/redux/useFetchWithPagination';
import Breadcrumb from '../../components/Breadcrumb';
import AddExpenseCategoryPopup from './AddExpenseCategory';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { axios_private } from '../../api/api';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import {
  removeExpenseCategory,
  removeExpenseCategories,
} from '../../app/features/expenses/expensesCategoriesSlice';
import { useState } from 'react';
import { showDate } from '../../utils/date';
import makeToSerialize from '../../utils/makeToSerialize';

export default function Categories() {
  const appDispatch = useAppDispatch();
  const {
    data: categories,
    limit,
    currentPage,
    totalItems,
    totalPages,
    loading,
  } = useAppSelector((s) => s.expenses_categories);

  const { changePage } = useFetchWithPagination({
    data: categories,
    fetchFunc: fetchExpensesCategories,
  });

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();
  const [editItem, setEditItem] = useState<ExpenseCategory>(
    {} as ExpenseCategory
  );

  const showAddExpenseCategoryPopup = useBoolean(false);

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();
  async function deleteMultipleItems() {
    selectedDeleting.setTrue();
    try {
      await axios_private.delete('/expense-category/delete-multiple', {
        data: { ids: selectedID || selectedIds },
      });

      selectedID
        ? appDispatch(removeExpenseCategory(selectedID))
        : appDispatch(removeExpenseCategories(selectedIds));

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
        return <small> {showDate(params.row?.createdAt, true)} </small>;
      },
    },
    { field: 'name', headerName: 'Category Name', width: 200 },

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
                showAddExpenseCategoryPopup.setTrue();
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
      <Breadcrumb pageName="Categories" />

      <AddExpenseCategoryPopup
        openModal={showAddExpenseCategoryPopup}
        editItem={editItem}
      />

      <MuiConfirmationDialog
        loading={selectedDeleting.true}
        showModal={showSelectedDeletePopup}
        warningText={
          selectedID
            ? 'Want to delete expense category?'
            : `Want to delete all selected '${selectedIds?.length}' categories?`
        }
        onConfirm={deleteMultipleItems}
        confirmButtonText={selectedID ? 'Delete' : 'Delete All'}
      />

      <MaterialTableServer
        // -- data
        data={makeToSerialize(categories, currentPage, limit)}
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
        addNewText={'Add New ExpenseCategory'}
        addNewHandler={() => {
          showAddExpenseCategoryPopup.setTrue();
          setEditItem({} as ExpenseCategory);
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
