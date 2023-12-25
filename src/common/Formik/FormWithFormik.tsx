import { useFormik } from 'formik';
import Button from '../Buttons/Button';
import FileInput from '../Forms/FileInput';
import FormikTextarea from './FormikTextarea';
import { Fragment } from 'react';
import setFormikField from '../../utils/formik/setFormikField';
import onChangeSetURL from '../../utils/onChangeSetURL';
import MuiTextField from '../MaterialUi/Forms/MuiTextField';
interface MyFormikProps {
  fields?: {
    [key: string]: {
      value?: string;
      type: React.HTMLInputTypeAttribute | 'textarea';
      optional?: boolean;
    };
  };

  onSubmit: any;
  submitting?: boolean;
}

export default function FormWithFormik({
  fields,
  onSubmit,
  submitting,
}: MyFormikProps) {
  const initialValues: any = {};
  Object.entries(fields || {}).map(([key, obj]) => {
    initialValues[key] = obj.value;
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  function splitKey(key: string) {
    return key.split('_').join(' ');
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full space-y-6 bg-white dark:bg-black sm:p-5 lg:p-10"
      action="#"
    >
      {Object.entries(fields || {}).map(([key, obj]) =>
        obj.type === 'text' ? (
          <MuiTextField
            key={key}
            label={splitKey(key)}
            {...formik.getFieldProps(key)}
          />
        ) : obj.type === 'color' ? (
          <div className="flex flex-col gap-1">
            <label htmlFor={key} className="capitalize">
              {key?.split('_').join(' ')}
            </label>
            <input
              className="h-[50px] w-full rounded border-none shadow outline-none focus:ring md:w-[300px]"
              key={key}
              id={key}
              type="color"
              {...formik.getFieldProps(key)}
            />
          </div>
        ) : obj.type === 'file' ? (
          <div key={key}>
            <MuiTextField
              label={splitKey(key)}
              {...formik.getFieldProps(key)}
            />
            <div className="my-1">
              <FileInput
                onChange={onChangeSetURL(setFormikField(formik, key))}
                title={splitKey(key)}
              />
            </div>
            <img
              className="w-fit rounded pb-3"
              src={formik.values[key]}
              alt="image"
            />
          </div>
        ) : obj.type === 'textarea' ? (
          <FormikTextarea
            key={key}
            label={splitKey(key)}
            {...formik.getFieldProps(key)}
          />
        ) : (
          <Fragment key={key}></Fragment>
        )
      )}

      <Button type="submit" loading={submitting || formik.isSubmitting}>
        Update
      </Button>
    </form>
  );
}
