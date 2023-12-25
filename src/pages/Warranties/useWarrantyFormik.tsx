import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import Warranty from '../../types/data/Warranty';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';
import {
  addWarranty,
  updateWarranty,
} from '../../app/features/warranties/warrantySlice';
import formik_all_fields_required from '../../validations/formik/formik_all_fields_required';

type Props = {
  openModal?: UseBoolean;
  editItem?: Warranty;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (warranty: Warranty) => void;
  _finally?: () => void;
};

export default function useWarrantyFormik({
  openModal,
  editItem,
  avoidUpdateToast,
  _onSuccessAdd,
  _finally,
}: Props) {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
    },

    validate: formik_all_fields_required,

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(`/warranty/${editItem.id}`, values);
          data?.warranty && dispatch(updateWarranty(data?.warranty));
          !avoidUpdateToast && toast({ message: 'Warranty Updated!' });
        } else {
          const { data } = await axios.post('/warranty', values);
          if (data?.warranty) {
            dispatch(addWarranty(data?.warranty));
            _onSuccessAdd && _onSuccessAdd(data?.warranty);
            toast({ message: 'New Warranty Added!' });
          }
        }
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      } finally {
        openModal?.setFalse();
        formik.setSubmitting(false);
        formik.resetForm();
        _finally && _finally();
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: editItem?.name || '',
    });
  }, [editItem]);

  return { formik };
}

export const WarrantyForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      required
      id="name"
      label="Warranty Name"
      {...formik.getFieldProps('name')}
      touched={formik.touched.name}
      error={formik.errors.name}
    />
  </div>
);
