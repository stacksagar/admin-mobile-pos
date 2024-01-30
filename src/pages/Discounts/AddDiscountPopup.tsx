import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { DiscountT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useDiscountFormik, { DiscountForms } from './useDiscountFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: DiscountT;
  _finally?: () => void;
}

export default function AddDiscountPopup({ openModal, editItem, _finally }: Props) {
  const { formik } = useDiscountFormik({ openModal, editItem, _finally });

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
