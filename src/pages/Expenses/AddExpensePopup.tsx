import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { ExpenseT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useExpenseFormik, { ExpenseForms } from './useExpenseFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: ExpenseT;
  _finally?: () => void;
}

export default function AddExpensePopup({
  openModal,
  editItem,
  _finally,
}: Props) {
  const { formik } = useExpenseFormik({ openModal, editItem, _finally });

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
