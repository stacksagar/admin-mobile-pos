import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { CategoryT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useCategoryFormik, { ExpenseForms } from './useCategoryFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: CategoryT;
  _finally?: () => void;
}

export default function AddCategoryPopup({
  openModal,
  editItem,
  _finally,
}: Props) {
  const { formik } = useCategoryFormik({ openModal, editItem, _finally });

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
