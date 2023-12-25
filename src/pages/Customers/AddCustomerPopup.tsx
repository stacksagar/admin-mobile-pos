import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useCustomerFormik, { CustomerForms } from './useCustomerFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: Customer;
}

export default function AddCustomerPopup({ openModal, editItem }: Props) {
  const { formik } = useCustomerFormik({ openModal, editItem });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Customer' : 'Add New Customer'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <CustomerForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
