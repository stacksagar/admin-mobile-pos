import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useVatFormik, { VatForms } from './useVatFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: Vat;
}

export default function AddVatPopup({ openModal, editItem }: Props) {
  const { formik } = useVatFormik({ openModal, editItem });

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
