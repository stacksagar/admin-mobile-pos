import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { PageT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import usePageFormik, { PageForms } from './usePageFormik';

interface Props {
  openModal: UseBoolean;
  editItem?: PageT;
  _finally?: () => void;
}

export default function AddPagePopup({ openModal, editItem, _finally }: Props) {
  const { formik } = usePageFormik({ openModal, editItem, _finally });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Page' : 'Add New Page'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <PageForms formik={formik} />
    </MuiResponsiveDialog>
  );
}
