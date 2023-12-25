import FormWithFormik from '../../../common/Formik/FormWithFormik';
import { useSetting } from '../../../context/setting';
import useBoolean from '../../../hooks/state/useBoolean';
import useSettingSubmit from '../../../hooks/useSettingSubmit';

export default function InvoiceSetting() {
  const { setting } = useSetting();
  const submitting = useBoolean();
  const submit = useSettingSubmit(submitting.set);

  return (
    <FormWithFormik
      onSubmit={submit}
      submitting={submitting.true}
      fields={{
        invoice_title: {
          type: 'text',
          value: setting?.client?.invoice_title,
        },

        invoice_logo: {
          type: 'file',
          value: setting?.client?.invoice_logo,
        },

        invoice_address: {
          type: 'text',
          value: setting?.client?.invoice_address,
        },

        invoice_phone: {
          type: 'text',
          value: setting?.client?.invoice_phone,
        },

        invoice_email: {
          type: 'text',
          value: setting?.client?.invoice_email,
        },

        invoice_website: {
          type: 'text',
          value: setting?.client?.invoice_website,
        },

        invoice_sign: {
          type: 'file',
          value: setting?.client?.invoice_sign,
        },
      }}
    />
  );
}
