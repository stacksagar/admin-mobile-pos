import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';
import { addVat, updateVat } from '../../app/features/vats/vatSlice';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import formik_dynamic_fields_required from '../../validations/formik/formik_dynamic_fields_required';

type Props = {
  openModal?: UseBoolean;
  editItem?: Vat;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (vat: Vat) => void;
  _finally?: () => void;
};

export default function useVatFormik({
  openModal,
  editItem,
  avoidUpdateToast,
  _onSuccessAdd,
  _finally,
}: Props) {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      value: 0,
      type: 'amount',
    },

    validate: (values) => formik_dynamic_fields_required(values, ['value']),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(`/vat/${editItem.id}`, values);
          data?.vat && dispatch(updateVat(data?.vat));
          !avoidUpdateToast && toast({ message: 'Vat Updated!' });
        } else {
          const { data } = await axios.post('/vat', values);
          if (data?.vat) {
            dispatch(addVat(data?.vat));
            _onSuccessAdd && _onSuccessAdd(data?.vat);
            toast({ message: 'New Vat Added!' });
          }
        }
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      } finally {
        openModal?.setFalse();
        formik.setSubmitting(false);
        formik.resetForm();
        _finally && _finally();
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: editItem?.name || '',
      value: editItem?.value || 0,
      type: editItem?.type || 'amount',
    });
  }, [editItem]);

  return { formik };
}

export const VatForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      id="name"
      label="Vat Name"
      {...formik.getFieldProps('name')}
    />

    <div className="relative">
      <MuiTextField
        required
        id="value"
        type="number"
        label="Vat Value"
        {...formik.getFieldProps('value')}
        touched={formik.touched.value}
        error={formik.errors.value}
      />

      <div className="absolute top-4 right-10 flex h-fit items-center">
        {formik?.values?.type === 'amount' ? '৳' : '%'}
      </div>
    </div>

    <FormControl fullWidth>
      <InputLabel id="vat-by-label">Vat By</InputLabel>
      <Select
        labelId="vat-by-label"
        id="vat-by"
        label="Vat By"
        {...formik.getFieldProps('type')}
      >
        <MenuItem value="percentage">By Percentage (%) </MenuItem>
        <MenuItem value="amount">By Amount (৳) </MenuItem>
      </Select>
    </FormControl>
  </div>
);
