import { useFormik } from 'formik';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect } from 'react';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import formik_dynamic_fields_required from '../../validations/formik/formik_dynamic_fields_required';
import { PaymentT } from '../../data';
import onChangeSetURL from '../../utils/onChangeSetURL';
import setFormikField from '../../utils/formik/setFormikField';
import FileInput from '../../common/Forms/FileInput';
import SunEditor from '../../common/Editors/SunEditor';
import Label from '../../common/Forms/Label';

type Props = {
  openModal?: UseBoolean;
  editItem?: PaymentT;
  avoidUpdateToast?: boolean;
  _finally?: () => void;
};

export default function usePaymentFormik({
  openModal,
  editItem,
  avoidUpdateToast,
  _finally,
}: Props) {
  const axios = useAxiosPrivate();

  const formik = useFormik({
    initialValues: {
      name: '',
      wallet: '',
      logo: '',
    },

    validate: (values) => formik_dynamic_fields_required(values, ['name']),

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          await axios.put(`/payment/${editItem.id}`, values);
          !avoidUpdateToast && toast({ message: 'Payment Updated!' });
        } else {
          const { data } = await axios.post('/payment', values);
          if (data) toast({ message: 'New Payment Added!' });
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
      wallet: editItem?.wallet || '',
      logo: editItem?.logo || '',
    });
  }, [editItem]);

  return { formik };
}

export const PaymentForms = ({ formik }: { formik: any }) => (
  <div className="flex flex-col gap-6">
    <MuiTextField
      id="name"
      label="Payment Name"
      {...formik.getFieldProps('name')}
    />

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
        required={false}
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

        {formik.values?.logo ? <img src={formik.values?.logo} alt="" /> : null}
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
  </div>
);
