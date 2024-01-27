import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UserT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useCustomerFormik, { CustomerForms } from './useUserFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: UserT;
  isForCustomer?: boolean;
}

export default function AddUserPopup({ openModal, editItem }: Props) {
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
