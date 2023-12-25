import FormWithFormik from '../../../common/Formik/FormWithFormik';
import { useSetting } from '../../../context/setting';
import useBoolean from '../../../hooks/state/useBoolean';
import useSettingSubmit from '../../../hooks/useSettingSubmit';

export default function FooterSetting() {
  const { setting } = useSetting();
  const submitting = useBoolean();
  const submit = useSettingSubmit(submitting.set);

  return (
    <FormWithFormik
      onSubmit={submit}
      submitting={submitting.true}
      fields={{
        footer_logo: {
          type: 'file',
          value: setting?.client?.footer_logo,
        },

        footer_description: {
          type: 'textarea',
          value: setting?.client?.footer_description,
        },

        copyright: {
          type: 'text',
          value: setting?.client?.copyright,
        },
        location: {
          type: 'text',
          value: setting?.client?.location,
        },

        email: {
          type: 'text',
          value: setting?.client?.email,
        },

        phone: {
          type: 'text',
          value: setting?.client?.phone,
        },
        facebook: {
          type: 'text',
          value: setting?.client?.facebook,
        },
        linkedin: {
          type: 'text',
          value: setting?.client?.linkedin,
        },
        youtube: {
          type: 'text',
          value: setting?.client?.youtube,
        },
        twitter: {
          type: 'text',
          value: setting?.client?.twitter,
        },
      }}
    />
  );
}
