import { FormikProps } from 'formik';

export default function setFormikField(formik: FormikProps<any>, key: string) {
  return (value: any) => {
    console.log('value ', value);
    if (key && value) formik.setFieldValue(key, value);
  };
}
