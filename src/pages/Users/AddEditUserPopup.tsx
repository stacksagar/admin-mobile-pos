import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UserT } from '../../data';
import { UseBoolean } from '../../hooks/state/useBoolean';
import useCustomerFormik from './useUserFormik';
import { MenuItem, Select } from '@mui/material';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';

interface Props {
  openModal: UseBoolean;
  editItem?: UserT;
  isForCustomer?: boolean;
}

export default function AddUserPopup({ openModal, editItem }: Props) {
  const { formik } = useCustomerFormik({
    openModal,
    editItem,
  });

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update User' : 'Add New User'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
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
          defaultValue={formik.values.role}
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
            Role - Admin <small> - (Create/Read/Update/Delete) </small>
          </MenuItem>
          <MenuItem value="custom">
            Role - Custom <small> - ( As per permision ) </small>
          </MenuItem>
        </Select>
      </div>
    </MuiResponsiveDialog>
  );
}
