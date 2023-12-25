import { Button, CircularProgress, Typography } from '@mui/material';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { useAuth } from '../../context/auth';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useFormik } from 'formik';
import formik_all_fields_required from '../../validations/formik/formik_all_fields_required';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import ErrorMessage from '../../common/Errors/ErrorMessage';

export default function ChangePassword() {
  const { setAuth, setError, auth } = useAuth();
  const axios = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },

    validate: formik_all_fields_required,

    onSubmit: (values) => {
      const submit = async () => {
        try {
          await axios.post(
            `/auth/change-password?id=${auth?.user?.id}`,
            {
              old_password: values.old_password,
              new_password: values.confirm_password,
            },
            {
              withCredentials: true,
            }
          );

          toast({
            message: 'Password Updated!',
            duration: 3000,
          });
        } catch (error: any) {
          setError(error_message(error));
          setTimeout(() => {
            setError('');
          }, 2000);
        }
      };

      submit().finally(() => {
        setAuth((prev: any) => ({ ...prev, fetched: true }));
        formik.setSubmitting(false);
        setTimeout(() => {
          formik.resetForm();
        }, 500);
      });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 bg-white dark:bg-transparent sm:p-5 lg:p-10"
    >
      <Typography variant="h4">Change Password</Typography>

      <MuiTextField
        type="password"
        label="Old Password"
        {...formik.getFieldProps('old_password')}
        touched={formik.touched.old_password}
        error={formik.errors?.old_password}
      />

      <MuiTextField
        type="password"
        label="New Password"
        {...formik.getFieldProps('new_password')}
        touched={formik.touched.new_password}
        error={formik.errors?.new_password}
      />

      <MuiTextField
        type="password"
        label="Confirm New Password"
        {...formik.getFieldProps('confirm_password')}
        touched={formik.touched.confirm_password}
        error={formik.errors?.confirm_password}
      />

      <ErrorMessage />

      <Button type="submit" size="large" variant="contained">
        Update Password
        {formik.isSubmitting ? (
          <CircularProgress color="inherit" size={20} className="ml-2" />
        ) : null}
      </Button>
    </form>
  );
}
