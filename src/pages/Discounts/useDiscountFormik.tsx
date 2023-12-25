import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';
import {
  addDiscount,
  updateDiscount,
} from '../../app/features/discounts/discountSlice';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import formik_dynamic_fields_required from '../../validations/formik/formik_dynamic_fields_required';

type Props = {
  openModal?: UseBoolean;
  editItem?: Discount;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (discount: Discount) => void;
  _finally?: () => void;
};

export default function useDiscountFormik({
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
          const { data } = await axios.put(`/discount/${editItem.id}`, values);
          data?.discount && dispatch(updateDiscount(data?.discount));
          !avoidUpdateToast && toast({ message: 'Discount Updated!' });
        } else {
          const { data } = await axios.post('/discount', values);
          if (data?.discount) {
            dispatch(addDiscount(data?.discount));
            _onSuccessAdd && _onSuccessAdd(data?.discount);
            toast({ message: 'New Discount Added!' });
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

export const DiscountForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      id="name"
      label="Discount Name"
      {...formik.getFieldProps('name')}
      touched={formik.touched.name}
      error={formik.errors.name}
    />

    <div className="relative">
      <MuiTextField
        required
        id="value"
        type="number"
        label="Discount Value"
        {...formik.getFieldProps('value')}
        touched={formik.touched.value}
        error={formik.errors.value}
      />
      <div className="absolute top-4 right-10 flex h-fit items-center">
        {formik?.values?.type === 'amount' ? '৳' : '%'}
      </div>
    </div>

    <FormControl fullWidth>
      <InputLabel id="discount-by-label">Discount By</InputLabel>
      <Select
        labelId="discount-by-label"
        id="discount-by"
        label="Discount By"
        {...formik.getFieldProps('type')}
      >
        <MenuItem value="percentage">By Percentage (%) </MenuItem>
        <MenuItem value="amount">By Amount (৳) </MenuItem>
      </Select>
    </FormControl>
  </div>
);
