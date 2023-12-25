import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useExpenseCategoryFormik, {
  ExpenseCategoryForms,
} from './useExpenseCategoryFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: ExpenseCategory;
}

export default function AddExpenseCategoryPopup({
  openModal,
  editItem,
}: Props) {
  const { formik } = useExpenseCategoryFormik({ openModal, editItem });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={
        editItem?.id ? 'Update ExpenseCategory' : 'Add New ExpenseCategory'
      }
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <ExpenseCategoryForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
