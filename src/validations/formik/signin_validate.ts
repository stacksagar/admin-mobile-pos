type values_type = {
  name?: string;
  email?: string;
  password?: string;
};

export default function signin_validate(values: values_type) {
  const errors: values_type = {};

  if (!values.email) {
    errors.email = "Email can't be empty!";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
}
