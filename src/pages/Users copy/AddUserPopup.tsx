import { MenuItem, Select } from '@mui/material';
import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import useBoolean, { UseBoolean } from '../../hooks/state/useBoolean';
import { useFormik } from 'formik';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import signin_validate from '../../validations/formik/signin_validate';
import toast from '../../libs/toast';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';
import { addUser, updateUser } from '../../app/features/users/userSlice';
import FIcon from '../../common/Icons/FIcon';
import InputForUpload, {
  InputForUploadSkeleton,
} from '../../common/Forms/InputForUpload';
import onChangeSetURL from '../../utils/onChangeSetURL';
import { useEffect } from 'react';
import remove_empty_value_keys from '../../utils/remove_empty_value_keys';
import error_message from '../../utils/error_message';
import { UserT } from '../../data';

interface Props {
  openModal: UseBoolean;
  editItem?: UserT;
}

export default function AddUserPopup({ openModal, editItem }: Props) {
  const axios = useAxiosPrivate();
  const addDispatch = useAppDispatch();
  const pictureUploading = useBoolean();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      nid: '',
      role: 'user',
      picture: '',
    },

    validate: signin_validate,

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(
            `/auth/update-user/${editItem.id}`,
            remove_empty_value_keys(values)
          );
          data?.user && addDispatch(updateUser({ ...data?.user }));
          toast({ message: 'User Updated!' });
        } else {
          const { data } = await axios.post('/auth/add-new-user', values);
          data?.user && addDispatch(addUser({ ...data?.user, new: true }));
          toast({ message: 'New User Added!' });
        }
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      } finally {
        openModal.setFalse();
        formik.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: editItem?.name || '',
      email: editItem?.email || '',
      password: '',
      phone: editItem?.phone || '',
      nid: editItem?.nid || '',
      role: editItem?.role || 'user',
      picture: editItem?.picture || '',
    });
  }, [editItem]);

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title="Add New User"
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <div className="flex flex-col gap-6">
        <MuiTextField
          required
          id="name"
          label="User Name"
          {...formik.getFieldProps('name')}
          touched={formik.touched.name}
          error={formik.errors.name}
        />

        <MuiTextField
          required
          id="email"
          label="User Email"
          type="email"
          {...formik.getFieldProps('email')}
          touched={formik.touched.email}
          error={formik.errors.email}
        />

        {editItem?.id ? null : (
          <MuiTextField
            required
            id="password"
            label="User Password"
            type="password"
            {...formik.getFieldProps('password')}
            touched={formik.touched.password}
            error={formik.errors.password}
          />
        )}

        <MuiTextField
          id="phone"
          label="User Phone"
          {...formik.getFieldProps('phone')}
        />

        <MuiTextField
          id="nid"
          label="NID Number"
          {...formik.getFieldProps('nid')}
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

        <div>
          <MuiTextField
            label="picture"
            onChange={(e) => formik.setFieldValue('picture', e.target.value)}
            value={formik.values.picture}
          />
          {formik.values.picture ? (
            <div>
              <img
                className="my-2 max-w-[100px] rounded"
                alt=""
                src={formik.values.picture}
              />
              <button
                title="remove"
                className="py-2 text-red-500"
                onClick={() => formik.setFieldValue('picture', '')}
              >
                <FIcon icon="trash" />
              </button>
            </div>
          ) : pictureUploading.true ? (
            <InputForUploadSkeleton />
          ) : (
            <InputForUpload
              onChange={onChangeSetURL(
                (url: string) => formik.setFieldValue('picture', url),
                pictureUploading.set
              )}
            />
          )}
        </div>
      </div>
    </MuiResponsiveDialog>
  );
}
