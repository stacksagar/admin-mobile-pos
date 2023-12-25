import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  addExpense,
  updateExpense,
} from '../../app/features/expenses/expenseSlice';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import useFetchDispatch from '../../hooks/redux/useFetchDispatch';
import { fetchExpensesCategories } from '../../app/features/expenses/requests';

type Props = {
  openModal?: UseBoolean;
  editItem?: Expense;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (expense: Expense) => void;
  _finally?: () => void;
};

export default function useExpenseFormik({
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
      category: '',
      cost: 0,
      date: new Date().toISOString().split('T')[0],
    },

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(`/expense/${editItem.id}`, values);
          data?.expense && dispatch(updateExpense(data?.expense));
          !avoidUpdateToast && toast({ message: 'Expense Updated!' });
        } else {
          const { data } = await axios.post('/expense', values);
          if (data?.expense) {
            dispatch(addExpense(data?.expense));
            _onSuccessAdd && _onSuccessAdd(data?.expense);
            toast({ message: 'New Expense Added!' });
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
    if (!editItem) return;
    formik.setValues({
      name: editItem?.name || '',
      category: editItem?.category || '',
      cost: editItem?.cost || 0,
      date: editItem?.date || new Date().toISOString().split('T')[0],
    });
  }, [editItem]);

  return { formik };
}

export const ExpenseForms = ({ formik }: { formik: any }) => {
  const { data: categories } = useAppSelector((s) => s.expenses_categories);

  useFetchDispatch({
    data: categories,
    fetchFunc: fetchExpensesCategories,
  });

  return (
    <div className="flex flex-col gap-6">
      <MuiTextField label="Expense Name" {...formik.getFieldProps('name')} />

      <MuiSearchSelect
        label="Select Category"
        defaultTitle={formik?.values?.category || null}
        options={categories}
        titleKey="name"
        valueKey="name"
        onChange={(value) => formik?.setFieldValue('category', value)}
      />

      <MuiTextField
        type="number"
        label="Total Cost"
        {...formik.getFieldProps('cost')}
      />

      <MuiTextField
        type="date"
        label="Expense Date"
        {...formik.getFieldProps('date')}
      />
    </div>
  );
};
