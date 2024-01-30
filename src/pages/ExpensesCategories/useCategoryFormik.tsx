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
import useFetchDispatch from '../../hooks/redux/useFetchDispatch';
import { fetchExpensesCategories } from '../../app/features/expenses/requests';
import { CategoryT } from '../../data';

type Props = {
  openModal?: UseBoolean;
  editItem?: CategoryT;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (expense: CategoryT) => void;
  _finally?: () => void;
};

export default function useCategoryFormik({
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
    },

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(
            `/expense-category/${editItem.id}`,
            values
          );
          data?.expense && dispatch(updateExpense(data?.expense));
          !avoidUpdateToast && toast({ message: 'Expense Updated!' });
        } else {
          const { data } = await axios.post('/expense-category', {
            ...values,
            slug: values?.name?.toLocaleLowerCase()?.split(' ').join('-'),
          });
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
      <MuiTextField label="Category Name" {...formik.getFieldProps('name')} />
    </div>
  );
};
