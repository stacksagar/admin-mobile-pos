export default function formik_dynamic_fields_required(
  values: any,
  keys: any[]
) {
  const errors: any = {};
  keys.map((key) => {
    if (!values[key]) errors[key] = `${key} is required!`;
  });

  return errors;
}
