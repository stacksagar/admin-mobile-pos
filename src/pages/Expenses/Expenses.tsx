import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import expenseTableCells from './expenseTableCells';
import AddExpensePopup from './AddExpensePopup';
import useObject from '../../hooks/state/useObject';
import { ExpenseT } from '../../data';
import { Button } from '@mui/material';
import useExpenses from '../../hooks/react-query/useExpenses';

export default function Expenses() {
  const axios = useAxiosPrivate();

  const { expenses, fetchingExpenses, refetchExpenses } = useExpenses();

  const deleting = useBoolean();
  const showAddExpensePopup = useBoolean();
  const selectedItem = useObject({} as ExpenseT);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/expense/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchExpenses();
    }
  }

  return (
    <div>
      <br />

      <AddExpensePopup
        openModal={showAddExpensePopup}
        editItem={selectedItem.data}
        _finally={refetchExpenses}
      />
      <Breadcrumb pageName="Expenses" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchExpenses}
          onDelete={onMultipleDelete}
          tableCells={expenseTableCells({
            onEditBtnClick(b) {
              selectedItem.set(b);
              showAddExpensePopup.setTrue();
            },
          })}
          rows={expenses || []}
          loading={fetchingExpenses}
          tableTitle="Expenses"
          deleting={deleting}
          CustomButton={
            <Button
              onClick={() => {
                showAddExpensePopup?.toggle();
                selectedItem.set({} as ExpenseT);
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
