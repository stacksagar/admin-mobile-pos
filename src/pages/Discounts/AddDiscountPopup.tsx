import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useDiscountFormik, { DiscountForms } from './useDiscountFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: Discount;
}

export default function AddDiscountPopup({ openModal, editItem }: Props) {
  const { formik } = useDiscountFormik({ openModal, editItem });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Discount' : 'Add New Discount'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <DiscountForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
