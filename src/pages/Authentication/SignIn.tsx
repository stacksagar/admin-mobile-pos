import { useLocation, useNavigate } from 'react-router-dom';
import AdminPanelLogo from '../../common/Logos/AdminPanelLogo';
import Button from '../../common/Buttons/Button';
import { useAuth } from '../../context/auth';
import useBoolean from '../../hooks/state/useBoolean';
import { useFormik } from 'formik';
import { axios_private } from '../../api/api';
import signin_validate from '../../validations/formik/signin_validate';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { useEffect } from 'react';
import FormikInput from '../../common/Formik/FormikInput';
import ErrorMessage from '../../common/Errors/ErrorMessage';
import FIcon from '../../common/Icons/FIcon';
import Checkbox from '../../common/Forms/Checkbox';

const SignIn = () => {
  const { setAuth, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPersist = useBoolean();
  const from = location.state?.from?.pathname || '/';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validate: signin_validate,

    onSubmit: (values) => {
      const signin = async () => {
        try {
          const response = await axios_private.post('/auth/signin', values);

          setAuth({
            access_token: response.data?.access_token,
            user: response?.data?.user,
          });

          navigate(from, { replace: true });

          toast({
            message: 'Logged in!',
          });
        } catch (error: any) {
          setError(error_message(error));

          setTimeout(() => {
            setError('');
          }, 2000);
        }
      };

      signin().finally(() => {
        formik.setSubmitting(false);
      });
    },
  });

  function handleTrustThisDevice(e: React.ChangeEvent<HTMLInputElement>) {
    localStorage.setItem('persist', JSON.stringify(e.target.checked));
    isPersist.set(e.target.checked);
  }

  useEffect(() => {
    const persist = JSON.parse(localStorage.getItem('persist') || 'false');

    if (persist) {
      isPersist.setTrue();
    }
  }, []);

  return (
    <div className="flex items-center justify-center sm:min-h-screen">
      <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:w-[1000px]">
        <div className="flex w-full flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="space-y-6 px-26 py-17.5 text-center">
              <AdminPanelLogo />
            </div>
          </div>

          <div className="flex min-h-screen w-full items-center border-stroke p-8 dark:border-strokedark sm:min-h-0 sm:p-12 xl:w-1/2 xl:border-l-2">
            <form
              onSubmit={formik.handleSubmit}
              className="h-fit w-full space-y-6"
            >
              <h2 className="flex items-center gap-x-2 pb-4 text-center text-2xl font-semibold text-blue-500">
                <FIcon icon="unlock-alt" />
                <span>Signin</span>
              </h2>
              <ErrorMessage />

              <FormikInput
                label="Email"
                type="email"
                placeholder="Email Address"
                {...formik.getFieldProps('email')}
                touched={formik.touched.email}
                error={formik.errors.email}
              />

              <FormikInput
                label="Password"
                type="password"
                placeholder="Password"
                {...formik.getFieldProps('password')}
                touched={formik.touched.password}
                error={formik.errors.password}
              />

              <div className="flex items-center gap-2 dark:text-white">
                <Checkbox
                  checked={isPersist.true}
                  id="remember"
                  onChange={handleTrustThisDevice}
                />
                <label
                  htmlFor="remember"
                  className="flex cursor-pointer items-center gap-x-1"
                  title="If you want to save your Login/Credentials for long time then checked it! Otherwise, If you don't want to save any information then don't checked it!"
                >
                  Trust This Device
                </label>
              </div>

              <Button
                loading={formik.isSubmitting}
                type="submit"
                className="text-gray-100 bg-blue-600"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
