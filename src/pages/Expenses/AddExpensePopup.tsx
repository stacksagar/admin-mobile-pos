import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean'; 
import useExpensesFormik, { ExpenseForms } from './useExpensesFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: Expense;
}

export default function AddExpensePopup({ openModal, editItem }: Props) {
  const { formik } = useExpensesFormik({ openModal, editItem });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Expense' : 'Add New Expense'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <ExpenseForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
