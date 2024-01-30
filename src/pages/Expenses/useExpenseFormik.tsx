import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import { ExpenseT } from '../../data';
import useExpenseCategories from '../../hooks/react-query/useExpenseCategories';

type Props = {
  openModal?: UseBoolean;
  editItem?: ExpenseT;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (expense: ExpenseT) => void;
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
          await axios.put(`/expense/${editItem.id}`, values);
          !avoidUpdateToast && toast({ message: 'Expense Updated!' });
        } else {
          const { data } = await axios.post('/expense', values);
          if (data?.expense) {
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
      category: editItem?.category || ('' as any),
      cost: editItem?.cost || 0,
      date: editItem?.date || new Date().toISOString().split('T')[0],
    });
  }, [editItem]);

  return { formik };
}

export const ExpenseForms = ({ formik }: { formik: any }) => {
  const { categories } = useExpenseCategories();

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
