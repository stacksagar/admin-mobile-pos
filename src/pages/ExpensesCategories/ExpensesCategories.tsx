import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import expenseTableCells from './categoryTableCells';
import AddExpensePopup from './AddCategoryPopup';
import useObject from '../../hooks/state/useObject';
import { CategoryT } from '../../data';
import { Button } from '@mui/material';
import useExpenseCategories from '../../hooks/react-query/useExpenseCategories';

export default function Expenses() {
  const axios = useAxiosPrivate();

  const { categories, fetchingCategories, refetchCategories } =
    useExpenseCategories();

  const deleting = useBoolean();
  const showAddExpensePopup = useBoolean();
  const selectedItem = useObject({} as CategoryT);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/expense-category/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchCategories();
    }
  }

  return (
    <div>
      <br />

      <AddExpensePopup
        openModal={showAddExpensePopup}
        editItem={selectedItem.data}
        _finally={refetchCategories}
      />

      <Breadcrumb pageName="Expenses Categories" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchCategories}
          onDelete={onMultipleDelete}
          tableCells={expenseTableCells({
            onEditBtnClick(b) {
              selectedItem.set(b);
              showAddExpensePopup.setTrue();
            },
          })}
          rows={categories || []}
          loading={fetchingCategories}
          tableTitle="Expenses"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showAddExpensePopup?.toggle();
                selectedItem.set({} as CategoryT);
              }}
              variant="contained"
            >
              Add Expense
            </Button>
          }
        />
      </div>
    </div>
  );
}
