import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UserT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useSupplierFormik, { SupplierForms } from './useSupplierFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: UserT;
}

export default function AddEditSupplierPopup({ openModal, editItem }: Props) {
  const { formik } = useSupplierFormik({ openModal, editItem });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Customer' : 'Add New Customer'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <SupplierForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
