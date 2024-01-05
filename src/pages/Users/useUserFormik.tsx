import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';

import { UserT } from '../../data';
import { MenuItem, Select } from '@mui/material';

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
    formik.setFieldValue(
      'total_puchase_amount',
      editItem?.total_puchase_amount
    );
    formik.setFieldValue('role', editItem?.role || 'user');
  }, [editItem]);

  return { formik };
}

export const CustomerForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      label="User Name"
      {...formik.getFieldProps('name')}
      touched={formik.touched.name}
      error={formik.errors.name}
    />
    <MuiTextField
      label="Address (optional)"
      {...formik.getFieldProps('address')}
      touched={formik.touched.address}
      error={formik.errors.address}
    />
    <MuiTextField
      label="Phone (optional)"
      {...formik.getFieldProps('phone')}
      touched={formik.touched.phone}
      error={formik.errors.phone}
    />
    <MuiTextField
      label="Email"
      {...formik.getFieldProps('email')}
      touched={formik.touched.email}
      error={formik.errors.email}
    />

    <MuiTextField
      label="Password"
      {...formik.getFieldProps('password')}
      touched={formik.touched.password}
      error={formik.errors.password}
    />

    <Select
      size="small"
      labelId="role"
      id="role"
      value={formik.values.role}
      {...formik.getFieldProps('role')}
    >
      <MenuItem value="">
        <em> Select Role </em>
      </MenuItem>
      <MenuItem value="user">
        Role - Normal User <small> - (Default: User) </small>
      </MenuItem>
      <MenuItem value="moderator">
        Role - Moderator <small> - (Only Can Read) </small>{' '}
      </MenuItem>
      <MenuItem value="admin">
        Role - Admin <small> - (Create/Read/Update/Delete) </small>{' '}
      </MenuItem>
    </Select>
  </div>
);
