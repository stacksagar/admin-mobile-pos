import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useWarrantyFormik, { WarrantyForms } from './useWarrantyFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: Warranty;
}

export default function AddWarrantyPopup({ openModal, editItem }: Props) {
  const { formik } = useWarrantyFormik({ openModal, editItem });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Warranty' : 'Add New Warranty'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <WarrantyForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
