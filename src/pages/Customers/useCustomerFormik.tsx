import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';

import {
  addCustomer,
  updateCustomer,
} from '../../app/features/customers/customerSlice';

type Props = {
  openModal?: UseBoolean;
  editItem?: Customer;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (customer: Customer) => void;
  _finally?: () => void;
};

export default function useCustomerFormik({
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
      email: '',
      address: '',
      phone: '',
      due: 0,
    },

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(`/customer/${editItem.id}`, values);
          data?.customer && dispatch(updateCustomer(data?.customer));
          !avoidUpdateToast && toast({ message: 'Customer Updated!' });
        } else {
          const { data } = await axios.post('/customer', values);
          if (data?.customer) {
            dispatch(addCustomer(data?.customer));
            _onSuccessAdd && _onSuccessAdd(data?.customer);
            toast({ message: 'New Customer Added!' });
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
      email: editItem?.email || '',
      address: editItem?.address || '',
      phone: editItem?.phone || '',
      due: editItem?.due || 0,
    });
  }, [editItem]);

  return { formik };
}

export const CustomerForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      label="Customer Name"
      {...formik.getFieldProps('name')}
      touched={formik.touched.name}
      error={formik.errors.name}
    />
    <MuiTextField
      label="Address"
      {...formik.getFieldProps('address')}
      touched={formik.touched.address}
      error={formik.errors.address}
    />
    <MuiTextField
      label="Phone"
      {...formik.getFieldProps('phone')}
      touched={formik.touched.phone}
      error={formik.errors.phone}
    />
    <MuiTextField
      label="Customer Email"
      {...formik.getFieldProps('email')}
      touched={formik.touched.email}
      error={formik.errors.email}
    />
    <MuiTextField
      type="number"
      label="Due Amount"
      {...formik.getFieldProps('due')}
      touched={formik.touched.due}
      error={formik.errors.due}
    />
  </div>
);
