import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { BrandT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useBrandFormik, { BrandForms } from './useBrandFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: BrandT;
  _finally?: () => void;
}

export default function AddBrandPopup({ openModal, editItem, _finally }: Props) {
  const { formik } = useBrandFormik({ openModal, editItem, _finally });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Brand' : 'Add New Brand'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <BrandForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
