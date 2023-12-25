import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';
import {
  addExpenseCategory,
  updateExpenseCategory,
} from '../../app/features/expenses/expensesCategoriesSlice';

type Props = {
  openModal?: UseBoolean;
  editItem?: ExpenseCategory;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (supplier: ExpenseCategory) => void;
  _finally?: () => void;
};

export default function useExpenseCategoryFormik({
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
          data?.category && dispatch(updateExpenseCategory(data?.category));
          !avoidUpdateToast && toast({ message: 'Category Updated!' });
        } else {
          const { data } = await axios.post('/expense-category', values);
          if (data?.category) {
            dispatch(addExpenseCategory(data?.category));
            _onSuccessAdd && _onSuccessAdd(data?.category);
            toast({ message: 'New Category Added!' });
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
    });
  }, [editItem]);

  return { formik };
}

export const ExpenseCategoryForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      required
      id="name"
      label="Category Name"
      {...formik.getFieldProps('name')}
      touched={formik.touched.name}
      error={formik.errors.name}
    />
  </div>
);
