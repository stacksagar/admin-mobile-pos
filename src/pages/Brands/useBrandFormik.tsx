import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import formik_dynamic_fields_required from '../../validations/formik/formik_dynamic_fields_required';
import { BrandT } from '../../data';

type Props = {
  openModal?: UseBoolean;
  editItem?: BrandT;
  avoidUpdateToast?: boolean;
  _finally?: () => void;
};

export default function useBrandFormik({
  openModal,
  editItem,
  avoidUpdateToast,
  _finally,
}: Props) {
  const axios = useAxiosPrivate();

  const formik = useFormik({
    initialValues: {
      name: '',
    },

    validate: (values) => formik_dynamic_fields_required(values, ['name']),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          await axios.put(`/brand/${editItem.id}`, values);
          !avoidUpdateToast && toast({ message: 'Brand Updated!' });
        } else {
          const { data } = await axios.post('/brand', values);
          if (data) toast({ message: 'New Brand Added!' });
        }
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });

        console.log('error ', error);
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

export const BrandForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      id="name"
      label="Brand Name"
      {...formik.getFieldProps('name')}
    />
  </div>
);
