import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useSupplierFormik, { SupplierForms } from './useSupplierFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: Supplier;
}

export default function AddSupplierPopup({ openModal, editItem }: Props) {
  const { formik } = useSupplierFormik({ openModal, editItem });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Supplier' : 'Add New Supplier'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <SupplierForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
