import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';

import { UserT } from '../../data';

type Props = {
  openModal?: UseBoolean;
  editItem?: UserT;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (customer: UserT) => void;
  _finally?: () => void;
};

export default function useCustomerFormik({
  openModal,
  editItem,
  avoidUpdateToast,
  _finally,
}: Props) {
  const axios = useAxiosPrivate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      address: '',
      phone: '',
      password: '',
      due: 0,
      paid: 0,
      total_puchase_amount: 0,
      role: 'user',
    },

    onSubmit: async (values) => {
      formik.setSubmitting(true);

      try {
        if (editItem?.id) {
          await axios.put(`/auth/user/${editItem.id}`, values);
          !avoidUpdateToast && toast({ message: 'User Updated!' });
        } else {
          await axios.post('/auth/user', values);
          !avoidUpdateToast && toast({ message: 'User Created!' });
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
    formik.setFieldValue('name', editItem?.name);
    formik.setFieldValue('email', editItem?.email);
    formik.setFieldValue('address', editItem?.address);
    formik.setFieldValue('phone', editItem?.phone);
    formik.setFieldValue('due', editItem?.due);
    formik.setFieldValue('paid', editItem?.paid);
    formik.setFieldValue('1', editItem?.total_puchase_amount);
    formik.setFieldValue('role', editItem?.role || 'user');
  }, [editItem]);

  return { formik };
}
