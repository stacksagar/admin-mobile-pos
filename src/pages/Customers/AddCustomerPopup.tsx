import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UserT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useCustomerFormik, { CustomerForms } from './useCustomerFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: UserT;
  _finally?: any;
}

export default function AddCustomerPopup({
  openModal,
  editItem,
  _finally,
}: Props) {
  const { formik } = useCustomerFormik({ openModal, editItem, _finally });

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
