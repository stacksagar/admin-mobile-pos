import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { VatT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useVatFormik, { VatForms } from './useVatFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: VatT;
  _finally?: () => void;
}

export default function AddVatPopup({ openModal, editItem, _finally }: Props) {
  const { formik } = useVatFormik({ openModal, editItem, _finally });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Vat' : 'Add New Vat'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <VatForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
