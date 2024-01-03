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
    formik.setValues({
      name: editItem?.name || '',
      email: editItem?.email || '',
      address: editItem?.address || '',
      phone: editItem?.phone || '',
      due: editItem?.due || 0,
      paid: editItem?.paid || 0,
      total_puchase_amount: editItem?.total_puchase_amount || 0,
      role: editItem?.role as any,
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
      label="Email"
      {...formik.getFieldProps('email')}
      touched={formik.touched.email}
      error={formik.errors.email}
    />

    <Select
      size="small"
      labelId="role"
      id="role"
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
