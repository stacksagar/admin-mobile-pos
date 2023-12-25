import { useFormik } from 'formik';
import { useEffect } from 'react';
import useAxiosPrivate from '../hooks/axios/useAxiosPrivate';
import { useAuth } from '../context/auth';
import toast from '../libs/toast';
import error_message from '../utils/error_message';
import imageUpload from '../utils/imageUpload';
import { Button, CircularProgress } from '@mui/material';
import MuiTextField from '../common/MaterialUi/Forms/MuiTextField';

export default function UserProfile() {
  const axios = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      picture: '',
    },

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('picture', values.picture);

        const { data } = await axios.post(
          `/auth/update?id=${auth?.user?.id}`,
          formData
        );

        setAuth((prev: any) => ({
          ...prev,
          user: { ...prev?.user, ...values },
        }));

        toast({
          message: 'Information updated!',
        });
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      } finally {
        formik.setSubmitting(false);
        formik.resetForm();
      }
    },
  });

  async function uploadProfilePicture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const data = await imageUpload(file);
    formik.setFieldValue('picture', data?.url);
  }

  useEffect(() => {
    formik.setValues({
      name: auth?.user?.name || '',
      email: auth?.user?.email || '',
      phone: auth?.user?.phone || '',
      picture: auth?.user?.picture || '',
    });
  }, [auth]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 bg-white dark:bg-transparent sm:p-5 lg:p-10"
    >
      <MuiTextField
        required
        label="Name"
        {...formik.getFieldProps('name')}
        touched={formik.touched.name}
        error={formik.errors.name}
      />
      <MuiTextField
        required
        label="Email Address"
        {...formik.getFieldProps('email')}
        touched={formik.touched.email}
        error={formik.errors.email}
      />
      <MuiTextField
        label="Phone"
        {...formik.getFieldProps('phone')}
        touched={formik.touched.phone}
        error={formik.errors.phone}
      />

      <div>
        {formik.values.picture ? (
          <img className="w-32" src={formik.values.picture} alt="" />
        ) : null}
        <MuiTextField
          label="Profile Picture"
          {...formik.getFieldProps('picture')}
          touched={formik.touched.picture}
          error={formik.errors.picture}
        />
        <input
          className="mt-1"
          title="Profile Picture"
          onChange={uploadProfilePicture}
          type="file"
        />
      </div>

      <Button type="submit" size="large" variant="contained">
        Update Password
        {formik.isSubmitting ? (
          <CircularProgress color="inherit" size={20} className="ml-2" />
        ) : null}
      </Button>
    </form>
  );
}
