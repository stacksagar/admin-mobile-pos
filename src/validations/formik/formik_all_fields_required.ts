export default function formik_all_fields_required(values: any) {
  const errors: any = {};

  Object.keys(values).map((key) => {
    if (!values[key]) errors[key] = `${key?.split('_').join(' ')} is required!`;
  });

  return errors;
}
