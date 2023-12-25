import { useRef, useEffect } from 'react';
import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../hooks/state/useBoolean';

import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { useAppDispatch } from '../../app/store';
import {
  addPayment,
  updatePayment,
} from '../../app/features/payments/paymentSlice';

import SunEditorCore from 'suneditor/src/lib/core';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import Label from '../../common/Forms/Label';
import SunEditor from '../../common/Editors/SunEditor';
import formik_all_fields_required from '../../validations/formik/formik_all_fields_required';
import FileInput from '../../common/Forms/FileInput';
import onChangeSetURL from '../../utils/onChangeSetURL';
import setFormikField from '../../utils/formik/setFormikField';

interface Props {
  openModal: UseBoolean;
  editItem?: Payment;
}

export default function AddPaymentPopup({ openModal, editItem }: Props) {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const description = useRef<SunEditorCore>();

  const formik = useFormik({
    initialValues: {
      name: '',
      wallet: '',
      logo: '',
    },

    validate: formik_all_fields_required,

    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const payableData = {
        ...values,
        description: description.current?.getContents(false),
      };

      try {
        if (editItem?.id) {
          const { data } = await axios.put(
            `/payment/${editItem.id}`,
            payableData
          );
          data?.payment && dispatch(updatePayment(data?.payment));
          toast({ message: 'Payment Updated!' });
        } else {
          const { data } = await axios.post('/payment', payableData);
          if (data?.payment) {
            dispatch(addPayment(data?.payment));
            toast({ message: 'New Payment Added!' });
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
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: editItem?.name || '',
      wallet: editItem?.wallet || '',
      logo: editItem?.logo || '',
    });
    // description?.current?.setContents(editItem?.description || '');
  }, [editItem]);

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.id ? 'Update Payment' : 'Add New Payment'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <div className="flex flex-col gap-6">
        <MuiTextField
          required
          id="name"
          label="Payment Name"
          {...formik.getFieldProps('name')}
          touched={formik.touched.name}
          error={formik.errors.name}
        />

        <MuiTextField
          required
          id="wallet"
          label="Receive Address"
          {...formik.getFieldProps('wallet')}
          touched={formik.touched.wallet}
          error={formik.errors.wallet}
        />

        <div className="my-1">
          <FileInput
            onChange={onChangeSetURL(setFormikField(formik, 'logo'))}
            title={'Payment Logo'}
          />

          {formik.values?.logo ? (
            <img src={formik.values?.logo} alt="" />
          ) : null}
        </div>

        <div>
          <Label>Payment Method Description</Label>
          <SunEditor
            height="400px"
            defaultValue={editItem?.description}
            placeholder="Page Description..."
            editor={description}
          />
        </div>
      </div>
    </MuiResponsiveDialog>
  );
}
