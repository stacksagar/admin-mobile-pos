import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';
import {
  addSupplier,
  updateSupplier,
} from '../../app/features/suppliers/supplierSlice';
import { SupplierT } from '../../data';

type Props = {
  openModal?: UseBoolean;
  editItem?: SupplierT;
  avoidUpdateToast?: boolean;
  _onSuccessAdd?: (supplier: SupplierT) => void;
  _finally?: () => void;

  paid_amount: number;
  due_amount: number;
};

export default function useSupplierFormik({
  openModal,
  editItem,
  avoidUpdateToast,
  _onSuccessAdd,
  _finally,
  paid_amount,
  due_amount,
}: Props) {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      company_name: '',
      supplier_name: '',
      address: '',
      phone: '',
      nid: '',
      email: '',
      total_puchase_amount: '',
      total_paid: '',
      total_due: '',
    },

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(`/supplier/${editItem.id}`, values);
          data && dispatch(updateSupplier(data));
          !avoidUpdateToast && toast({ message: 'Supplier Updated!' });
        } else {
          const { data } = await axios.post('/supplier', values);
          if (data) {
            dispatch(addSupplier(data));
            _onSuccessAdd && _onSuccessAdd(data);
            toast({ message: 'New Supplier Added!' });
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
    formik.setFieldValue('company_name', editItem?.company_name || '');
    formik.setFieldValue('supplier_name', editItem?.supplier_name || '');
    formik.setFieldValue('address', editItem?.address || '');
    formik.setFieldValue('phone', editItem?.phone || '');
    formik.setFieldValue('nid', editItem?.nid || '');
    formik.setFieldValue('email', editItem?.email || '');
    formik.setFieldValue(
      'total_puchase_amount',
      Number(editItem?.total_puchase_amount || '0') + paid_amount + due_amount
    );

    formik.setFieldValue(
      'total_paid',
      Number(editItem?.total_paid || '0') + paid_amount
    );

    formik.setFieldValue(
      'total_due',
      Number(editItem?.total_due || '0') + due_amount
    );
  }, [editItem, paid_amount, due_amount]);

  return { formik };
}

export const SupplierForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      id="supplier_name"
      label="Supplier Name"
      {...formik.getFieldProps('supplier_name')}
      touched={formik.touched.supplier_name}
      error={formik.errors.supplier_name}
    />

    <MuiTextField
      id="company_name"
      label="Company Name"
      {...formik.getFieldProps('company_name')}
      touched={formik.touched.company_name}
      error={formik.errors.company_name}
    />

    <MuiTextField
      id="address"
      label="Address"
      {...formik.getFieldProps('address')}
      touched={formik.touched.address}
      error={formik.errors.address}
    />

    <MuiTextField
      id="nid"
      label="NID"
      {...formik.getFieldProps('nid')}
      touched={formik.touched.nid}
      error={formik.errors.nid}
    />

    <MuiTextField
      id="phone"
      label="Phone"
      {...formik.getFieldProps('phone')}
      touched={formik.touched.phone}
      error={formik.errors.phone}
    />
    <MuiTextField
      id="email"
      label="Email"
      {...formik.getFieldProps('email')}
      touched={formik.touched.email}
      error={formik.errors.email}
    />
    <MuiTextField
      disabled
      id="total_puchase_amount"
      label="Total Puchase Amount"
      type="number"
      value={formik.values.total_puchase_amount}
    />
    <MuiTextField
      disabled
      id="total_paid"
      label="Total Paid"
      type="number"
      value={formik.values.total_paid}
    />
    <MuiTextField
      disabled
      id="total_due"
      label="Total Due"
      type="number"
      value={formik.values.total_due}
    />
  </div>
);